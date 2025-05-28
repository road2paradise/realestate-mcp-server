import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { formatListings, formatListingDetail } from "./helper/formatListings.js";
import { loadSuburbMap } from "./helper/suburbCsvParser.js";
import { matchAddress } from "./helper/matchAddress.js";

// API endpoint for real estate listings
const REAL_ESTATE_API = "https://platform.realestate.co.nz/search/v1/listings";

// Create server instance
const server = new McpServer({
  name: "realestaate",
  version: "1.0.0",
});

// MCP tool for real estate listings
server.tool(
  "get-listings",
  "Get real estate listings for one or more suburbs, or by address, with optional bedroom filters and pagination",
  {
    suburbs: z.array(z.string()).optional().describe("List of suburb names"),
    address: z.string().optional().describe("Street address to search for"),
    bedroomsMin: z.number().optional().describe("Minimum bedrooms"),
    bedroomsMax: z.number().optional().describe("Maximum bedrooms"),
    saleMin: z.number().optional().describe("Minimum sale price"),
    saleMax: z.number().optional().describe("Maximum sale price"),
    bathroomsMin: z.number().optional().describe("Minimum bathrooms"),
    landAreaMin: z.number().optional().describe("Minimum land area"),
    landAreaMax: z.number().optional().describe("Maximum land area"),
    floorAreaMin: z.number().optional().describe("Minimum floor area"),
    floorAreaMax: z.number().optional().describe("Maximum floor area"),
    carparks: z.number().optional().describe("Number of carparks"),
    pageOffset: z.number().optional().describe("Page offset for pagination"),
    pageSize: z.number().optional().describe("Number of listings per page (default 20)"),
  },
  async ({   suburbs, address, bedroomsMin, bedroomsMax, saleMin, saleMax,
  bathroomsMin, landAreaMin, landAreaMax, floorAreaMin, floorAreaMax, carparks,
  pageOffset, pageSize }) => {
    // Address search takes priority
    if (address) {
      const smartUrl = `https://platform.realestate.co.nz/search/v1/listings/smart?q=${encodeURIComponent(address)}&filter[category][0]=res_sale`;
      const smartRes = await fetch(smartUrl);
      if (!smartRes.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to search for address: ${address}`,
            },
          ],
        };
      }
      const smartData = await smartRes.json();
      const bestListing = matchAddress(address, smartData.data);
      if (!bestListing || !bestListing["listing-id"]) {
        return {
          content: [
            {
              type: "text",
              text: `No listings found for address: ${address}`,
            },
          ],
        };
      }
      const listingId = bestListing["listing-id"];
      const detailUrl = `https://platform.realestate.co.nz/search/v1/listings/${listingId}`;
      const detailRes = await fetch(detailUrl);
      if (!detailRes.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to fetch details for listing ID: ${listingId}`,
            },
          ],
        };
      }
      const detailData = await detailRes.json();
      const formatted = formatListingDetail(detailData);
      return {
        content: [
          {
            type: "text",
            text: `Listing details for address "${address}":\n\n${JSON.stringify(formatted, null, 2)}`,
          },
        ],
};

    }

    const suburbMap = loadSuburbMap();
    const codes: string[] = [];
    const unknown: string[] = [];

    if (suburbs) {
      for (const suburb of suburbs) {
        const code = suburbMap[suburb.trim().toLowerCase()];
        if (code) {
          codes.push(String(code));
        } else {
          unknown.push(suburb);
        }
      }
    }

    if (suburbs && codes.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `Unknown suburb(s): ${unknown.join(", ")}`,
          },
        ],
      };
    }

    const limit = pageSize ?? 20;
    const offset = pageOffset ?? 0;

    const queryParts: string[] = [];
    queryParts.push(`filter[category][]=res_sale`);
    queryParts.push(`filter[propertyType][]=1`);

    // Suburb param: single = filter[suburb]=code, multiple = filter[suburb][]=code
    if (codes.length === 1) {
      queryParts.push(`filter[suburb][]=${encodeURIComponent(codes[0])}`);
    } else if (codes.length > 1) {
      codes.forEach(code => queryParts.push(`filter[suburb][]=${encodeURIComponent(code)}`));
    }

    if (bedroomsMin !== undefined) queryParts.push(`filter[bedroomsMin]=${bedroomsMin}`);
    if (bedroomsMax !== undefined) queryParts.push(`filter[bedroomsMax]=${bedroomsMax}`);
    if (saleMin !== undefined) queryParts.push(`filter[saleMin]=${saleMin}`);
    if (saleMax !== undefined) queryParts.push(`filter[saleMax]=${saleMax}`);
    if (bathroomsMin !== undefined) queryParts.push(`filter[bathroomsMin]=${bathroomsMin}`);
    if (landAreaMin !== undefined) queryParts.push(`filter[landAreaMin]=${landAreaMin}`);
    if (landAreaMax !== undefined) queryParts.push(`filter[landAreaMax]=${landAreaMax}`);
    if (floorAreaMin !== undefined) queryParts.push(`filter[floorAreaMin]=${floorAreaMin}`);
    if (floorAreaMax !== undefined) queryParts.push(`filter[floorAreaMax]=${floorAreaMax}`);
    if (carparks !== undefined) queryParts.push(`filter[carparks]=${carparks}`);
    queryParts.push(`meta[aggs]=propertyType,listingCategoryCode,suburb`);
    queryParts.push(`page[offset]=${offset}`);
    queryParts.push(`page[limit]=${limit}`);
    queryParts.push(`page[groupBy]=featured`);

    const query = queryParts.join("&");
    const url = `${REAL_ESTATE_API}?${query}`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch listings for suburbs: ${suburbs?.join(", ")}`,
          },
        ],
      };
    }
    const data = await res.json();
    const listings = formatListings(data);
    const total = data.meta?.total ?? 0;

    return {
      content: [
        {
          type: "text",
          text: `Listings for ${suburbs?.join(", ") ?? "search"} (${listings.length} of ${total}):\n\n${JSON.stringify(
            listings,
            null,
            2
          )}`,
        },
      ],
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Real Estate MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
