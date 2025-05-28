import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { formatListings } from "./helper/formatListings.js";
import { loadSuburbMap } from "./helper/suburbCsvParser.js";
import { buildQuery } from "./helper/buildQuery.js";

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
  "Get real estate listings for a suburb with optional bedroom filters",
  {
    suburb: z.string().describe("Suburb name"),
    bedroomsMin: z.number().optional().describe("Minimum bedrooms"),
    bedroomsMax: z.number().optional().describe("Maximum bedrooms"),
    // Add more filters as needed
  },
  async ({ suburb, bedroomsMin, bedroomsMax }) => {
    const suburbMap = loadSuburbMap();
    const code = suburbMap[suburb.trim().toLowerCase()];
    if (!code) {
      return {
        content: [
          {
            type: "text",
            text: `Unknown suburb: ${suburb}`,
          },
        ],
      };
    }

    // Build query parameters
    const params: Record<string, any> = {
      "filter[suburb]": [code],
      "page[offset]": 0,
      "page[limit]": 100000, // Fetch all listings
      "meta[aggs]": "popular.res_rent,popular.res_sale",
    };
    if (bedroomsMin !== undefined) params["filter[bedroomsMin]"] = bedroomsMin;
    if (bedroomsMax !== undefined) params["filter[bedroomsMax]"] = bedroomsMax;

    const url = `${REAL_ESTATE_API}?${buildQuery(params)}`;
    const res = await fetch(url);
    if (!res.ok) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to fetch listings for ${suburb}`,
          },
        ],
      };
    }
    const data = await res.json();

    // Format the response as needed
    return {
      content: [
        {
          type: "text",
          text: `Listings for ${suburb}:\n\n${JSON.stringify(
            formatListings(data),
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
