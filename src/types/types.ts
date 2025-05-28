export type OtherFeature = {
  "sort-order"?: number;
  "heading"?: string;
  "value"?: string;
};

export type ChildCare = {
  "organization-name"?: string;
  "slug"?: string;
  "geo-radius"?: string;
  "geo-point"?: [number, number];
  "in-zone"?: boolean;
  "has-zone"?: boolean;
};

export type School = {
  "organization-name"?: string;
  "slug"?: string;
  "geo-radius"?: string;
  "geo-point"?: [number, number];
  "in-zone"?: boolean;
  "has-zone"?: boolean;
};

export type PriceHistory = {
  "from-value"?: string;
  "to-value"?: string;
  "created-date"?: string;
};

export type ListingAttributes = {
  "bedroom-count"?: number;
  "price-display"?: string;
  address?: { "full-address"?: string };
  "open-homes"?: { start: string; end: string }[];
  "website-full-url"?: string;
  "other-features"?: OtherFeature[];
  "parking-garage-count"?: number;
  "is-new-construction"?: boolean;
  "floor-area"?: number;
  "land-area"?: number;
  "bathroom-full-count"?: number;
  "price-history"?: PriceHistory[];
  "deadline-date"?: string;
  "description"?: string;
  "is-mortgagee-sale"?: boolean;
  "child-cares"?: ChildCare[];
  "schools"?: School[];
};

export type Listing = {
  attributes: ListingAttributes;
};

export type ApiResponse = {
  data: Listing[];
};