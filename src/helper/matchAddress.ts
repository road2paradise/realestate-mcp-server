export function matchAddress(address: string, listings: any[]): any | null {
  if (!Array.isArray(listings) || listings.length === 0) return null;
  const lowerAddress = address.toLowerCase();

  // Score each listing by how well its address matches the query
  let bestScore = -1;
  let bestListing = null;

  for (const listing of listings) {
    const attrs = listing.attributes || {};
    const fullAddress = attrs.address?.["full-address"]?.toLowerCase() || "";
    const displayAddress = attrs.address?.["display-address"]?.toLowerCase() || "";

    let score = 0;
    if (fullAddress.includes(lowerAddress)) score += 2;
    if (displayAddress.includes(lowerAddress)) score += 1;
    if (fullAddress.startsWith(lowerAddress)) score += 1;
    if (displayAddress.startsWith(lowerAddress)) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestListing = listing;
    }
  }

  return bestListing;
}