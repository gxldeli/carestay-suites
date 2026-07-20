interface ListingCopyInput {
  title: string;
  location: string;
  beds?: number;
  bedrooms?: number;
  description?: string;
}

const COUNT_WORD = String.raw`(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[-\s](?:one|two|three|four|five|six|seven|eight|nine))?|(?:one\s+)?hundred)`;
const RESTRICTED_DURATION_COPY = new RegExp(
  String.raw`\b(?:minimum(?:\s+stay)?|short[-\s]?term|month[-\s]?to[-\s]?month|monthly|weekly|daily|nightly|long[-\s]?term|long(?:er)?\s+stays?|per\s+(?:day|night|week|month))\b|\b${COUNT_WORD}\+?(?:\s*[-–—]\s*|\s+)(?:day|days|night|nights|week|weeks|month|months)\b`,
  "i",
);
const LEGACY_HEALTHCARE_COPY = /designed for healthcare professionals|spare scrubs \(s\/m\/l\)/i;

export function hasRestrictedDurationLanguage(copy?: string): boolean {
  return RESTRICTED_DURATION_COPY.test(copy || "");
}

export function filterPublicAmenities(amenities: string[]): string[] {
  return amenities.filter((amenity) => !hasRestrictedDurationLanguage(amenity));
}

export function buildProfessionalListingDescription({ title, location, beds, bedrooms }: ListingCopyInput): string {
  const bedroomCount = bedrooms ?? beds ?? 0;
  const suiteType = bedroomCount > 0 ? `${bedroomCount}-bedroom suite` : "studio suite";

  return `${title} is a fully furnished ${suiteType} in ${location}, professionally managed for comfortable stays.

The space
A practical home base for work and everyday living. Ask the CareStay team to confirm the exact layout, amenities, and inclusions for this suite.

Professional stay support
CareStay welcomes independent professionals, companies, relocating guests, healthcare assignments, insurance placements, and project teams.

Things to know
- Current availability is confirmed during inquiry
- Property-specific terms and inclusions vary by suite`;
}

export function getPublicListingDescription(input: ListingCopyInput): string {
  const description = input.description?.trim() || "";
  return LEGACY_HEALTHCARE_COPY.test(description) || hasRestrictedDurationLanguage(description)
    ? buildProfessionalListingDescription(input)
    : description;
}
