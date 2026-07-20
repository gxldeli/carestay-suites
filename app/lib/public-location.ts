const PRECISE_ADDRESS_PATTERN = /\d|\b(?:street|st\.?|road|rd\.?|avenue|ave\.?|boulevard|blvd\.?|drive|dr\.?|lane|ln\.?|court|ct\.?|terrace|crescent|way)\b/i;

/** Keep showcase inventory at neighbourhood/city level without publishing an entered street address. */
export function getPublicAreaLabel(value: string): string {
  const location = value.trim().slice(0, 80);
  if (!location || PRECISE_ADDRESS_PATTERN.test(location)) return "Toronto area";
  return location;
}

export function getPublicShowcaseDescription(title: string, location: string): string {
  return `${title} is a non-bookable example shown to illustrate the style of furnished stay CareStay can help source in ${location}. It is not an active CareStay listing. Tell our team what you need and we’ll look for a real match.`;
}
