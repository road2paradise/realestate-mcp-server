# mcp-realestatenz

A Model Context Protocol (MCP) server for querying and formatting real estate listings from [realestate.co.nz](https://www.realestate.co.nz/) using suburb codes and various filters.

## Features

- Query real estate listings by suburb name (mapped to suburb code via CSV)
- Filter listings by minimum and maximum bedrooms
- Extract and format listing details, including:
  - Bedroom count
  - Price display
  - Full address
  - Earliest non-elapsed open home
  - Listing URL
  - Other features, parking, construction, floor/land area, bathroom count, price history, deadline date, description, mortgagee sale status
  - Top 3 closest child-cares and schools (with distance and zoning info)

## Project Structure

```
.
├── build/                # Compiled JS output (ignored by git)
├── src/
│   ├── index.ts          # Main MCP server code
│   ├── helper/
│   │   ├── buildQuery.ts
│   │   ├── formatListings.ts
│   │   ├── loadSuburbMap.ts
│   │   └── suburbCsvParser.js
│   ├── types/
│   │   └── types.ts      # TypeScript type definitions
│   └── suburbs.csv       # Suburb code/name mapping
├── package.json
├── .gitignore
└── README.md
```

## Setup

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Build the project:**

   ```sh
   npm run build
   ```

3. **Run the MCP server:**

   ```sh
   node build/index.js
   ```

4. **Ensure `suburbs.csv` is present in the `build/` directory.**  
   The build script copies it automatically.

## Usage

- The MCP server exposes tools for querying listings by suburb and filters.
- Integrate with Claude or other MCP clients to interact with the server.

## Configuration

- **suburbs.csv:**  
  A CSV file mapping suburb names to codes.  
  Example:
  ```
  code,name
  3954,Papamoa
  1234,Another Suburb
  ```

## Development

- TypeScript source is in `src/`.
- Helper functions are in `src/helper/`.
- Types are defined in `src/types/types.ts`.
- Main logic is in `src/index.ts`.

## License

ISC
