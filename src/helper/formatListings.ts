import { ApiResponse } from "../types/types.js";

export function formatListings(response: ApiResponse) {
  const now = new Date();
  return response.data.map((entry) => {
    const attrs = entry.attributes || {};
    // Find the earliest open home that hasn't ended yet
    let earliestOpenHome: string | null = null;
    if (Array.isArray(attrs["open-homes"])) {
      const futureOpenHomes = attrs["open-homes"]
        .filter((oh) => new Date(oh.end) > now)
        .sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );
      if (futureOpenHomes.length > 0) {
        earliestOpenHome = futureOpenHomes[0].start;
      }
    }

    // Map other-features
    const otherFeatures = Array.isArray(attrs["other-features"])
      ? attrs["other-features"].map((f) => ({
          heading: f.heading,
          value: f.value,
        }))
      : [];

    // Map child-cares
    let childCares = Array.isArray(attrs["child-cares"])
      ? attrs["child-cares"].map((c) => ({
          name: c["organization-name"],
          distance: c["geo-radius"],
          inZone: c["in-zone"],
        }))
      : [];

    childCares = childCares
      .sort((a, b) => {
        // Sort by distance, then by name
        const distanceA = a.distance ? parseFloat(a.distance) : Infinity;
        const distanceB = b.distance ? parseFloat(b.distance) : Infinity;
        if (distanceA !== distanceB) {
          return distanceA - distanceB; // Ascending by distance
        }
        return a.name!.localeCompare(b.name!); // Ascending by name
      })
      .slice(0, 3); // Limit to top 3 child cares

    // Map schools
    let schools = Array.isArray(attrs["schools"])
      ? attrs["schools"].map((s) => ({
          name: s["organization-name"],
          distance: s["geo-radius"],
          inZone: s["in-zone"],
        }))
      : [];

    schools = schools
      .sort((a, b) => {
        // Sort by distance, then by name
        const distanceA = a.distance ? parseFloat(a.distance) : Infinity;
        const distanceB = b.distance ? parseFloat(b.distance) : Infinity;
        if (distanceA !== distanceB) {
          return distanceA - distanceB; // Ascending by distance
        }
        return a.name!.localeCompare(b.name!); // Ascending by name
      })
      .slice(0, 3); // Limit to top 3 schools

    // Map price history
    const priceHistory = Array.isArray(attrs["price-history"])
      ? attrs["price-history"].map((h) => ({
          from: h["from-value"],
          to: h["to-value"],
          date: h["created-date"],
        }))
      : [];

    return {
      bedrooms: attrs["bedroom-count"] ?? null,
      price: attrs["price-display"] ?? null,
      address: attrs.address?.["full-address"] ?? null,
      earliestOpenHome: earliestOpenHome,
      url: attrs["website-full-url"] ?? null,
      otherFeatures,
      parkingGarageCount: attrs["parking-garage-count"] ?? null,
      isNewConstruction: attrs["is-new-construction"] ?? null,
      floorArea: attrs["floor-area"] ?? null,
      landArea: attrs["land-area"] ?? null,
      bathroomFullCount: attrs["bathroom-full-count"] ?? null,
      priceHistory,
      deadlineDate: attrs["deadline-date"] ?? null,
      priceDisplay: attrs["price-display"] ?? null,
      isMortgageeSale: attrs["is-mortgagee-sale"] ?? null,
      childCares,
      schools,
    };
  });
}


export function formatListingDetail(detail: any) {
  const now = new Date();
  const entry = detail.data;
  const attrs = entry.attributes || {};

  // Find the earliest open home that hasn't ended yet
  let earliestOpenHome: string | null = null;
  if (Array.isArray(attrs["open-homes"])) {
    const futureOpenHomes = attrs["open-homes"]
      .filter((oh) => new Date(oh.end) > now)
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
    if (futureOpenHomes.length > 0) {
      earliestOpenHome = futureOpenHomes[0].start;
    }
  }

  // Map other-features
  const otherFeatures = Array.isArray(attrs["other-features"])
    ? attrs["other-features"].map((f) => ({
        heading: f.heading,
        value: f.value,
      }))
    : [];

  // Map child-cares
  let childCares = Array.isArray(attrs["child-cares"])
    ? attrs["child-cares"].map((c) => ({
        name: c["organization-name"],
        distance: c["geo-radius"],
        inZone: c["in-zone"],
      }))
    : [];

  childCares = childCares
    .sort((a, b) => {
      const distanceA = a.distance ? parseFloat(a.distance) : Infinity;
      const distanceB = b.distance ? parseFloat(b.distance) : Infinity;
      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }
      return a.name!.localeCompare(b.name!);
    })
    .slice(0, 3);

  // Map schools
  let schools = Array.isArray(attrs["schools"])
    ? attrs["schools"].map((s) => ({
        name: s["organization-name"],
        distance: s["geo-radius"],
        inZone: s["in-zone"],
      }))
    : [];

  schools = schools
    .sort((a, b) => {
      const distanceA = a.distance ? parseFloat(a.distance) : Infinity;
      const distanceB = b.distance ? parseFloat(b.distance) : Infinity;
      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }
      return a.name!.localeCompare(b.name!);
    })
    .slice(0, 3);

  // Map price history
  const priceHistory = Array.isArray(attrs["price-history"])
    ? attrs["price-history"].map((h) => ({
        from: h["from-value"],
        to: h["to-value"],
        date: h["created-date"],
      }))
    : [];

  return {
    bedrooms: attrs["bedroom-count"] ?? null,
    price: attrs["price-display"] ?? null,
    address: attrs.address?.["full-address"] ?? null,
    earliestOpenHome: earliestOpenHome,
    url: attrs["website-full-url"] ?? null,
    otherFeatures,
    parkingGarageCount: attrs["parking-garage-count"] ?? null,
    isNewConstruction: attrs["is-new-construction"] ?? null,
    floorArea: attrs["floor-area"] ?? null,
    landArea: attrs["land-area"] ?? null,
    bathroomFullCount: attrs["bathroom-full-count"] ?? null,
    priceHistory,
    deadlineDate: attrs["deadline-date"] ?? null,
    priceDisplay: attrs["price-display"] ?? null,
    isMortgageeSale: attrs["is-mortgagee-sale"] ?? null,
    childCares,
    schools,
  };
}