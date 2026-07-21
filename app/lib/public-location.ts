const PRECISE_ADDRESS_PATTERN = /\d|\b(?:street|st\.?|road|rd\.?|avenue|ave\.?|boulevard|blvd\.?|drive|dr\.?|lane|ln\.?|court|ct\.?|terrace|crescent|way)\b/i;
const EXISTING_CARESTAY_EDITORIAL_IMAGE = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

export type PortfolioRelationship = "unverified" | "managed" | "past-stay" | "coming-soon";

/** Keep portfolio inventory at neighbourhood/city level without publishing an entered street address. */
export function getPublicAreaLabel(value: string): string {
  const location = value.trim().slice(0, 80);
  if (!location || PRECISE_ADDRESS_PATTERN.test(location)) return "Toronto area";
  return location;
}

export function isPublishablePortfolioRelationship(value?: string): value is Exclude<PortfolioRelationship, "unverified"> {
  return value === "managed" || value === "past-stay" || value === "coming-soon";
}

export function getPortfolioStatusLabel(relationship: Exclude<PortfolioRelationship, "unverified">): string {
  if (relationship === "past-stay") return "Past stay";
  if (relationship === "coming-soon") return "Coming soon";
  return "Currently unavailable";
}

export function getPublicPortfolioDescription(
  title: string,
  location: string,
  relationship: Exclude<PortfolioRelationship, "unverified">
): string {
  if (relationship === "past-stay") {
    return `${title} is part of CareStay’s hosted-stay portfolio in ${location}. It is not currently accepting new inquiries. Tell our team what you need and we’ll help find a current match.`;
  }
  if (relationship === "coming-soon") {
    return `${title} is joining the CareStay portfolio in ${location}. Final stay details are being prepared. Join the waitlist or tell our team what you need.`;
  }
  return `${title} is a furnished CareStay suite in ${location}. It is currently unavailable for new stays. Tell our team what you need and we’ll help find a current match.`;
}

/** Use CareStay's existing editorial image while Waterfront's legacy image host is unavailable. */
export function getPublicPortfolioImages(title: string, images: string[]): string[] {
  const cleanImages = images.filter(Boolean);
  const hasOnlyLegacyAirbnbImages = cleanImages.length > 0 && cleanImages.every((image) => image.includes("a0.muscache.com"));
  if (/waterfront residence/i.test(title) && hasOnlyLegacyAirbnbImages) {
    return [EXISTING_CARESTAY_EDITORIAL_IMAGE];
  }
  return cleanImages;
}
