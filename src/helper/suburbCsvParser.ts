import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { parse as csvParse } from "csv-parse/sync";

// Helper to load suburb code map from CSV
export function loadSuburbMap(): Record<string, number> {
  // Get __dirname in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // suburbs.csv is expected to be in the same directory as the built index.js
  const suburbCsv = fs.readFileSync(
    path.join(__dirname, "../suburbs.csv"),
    "utf8"
  );
  const records = csvParse(suburbCsv, { columns: true });
  const suburbMap: Record<string, number> = {};
  for (const row of records) {
    suburbMap[row.name.trim().toLowerCase()] = Number(row.code);
  }
  return suburbMap;
}
