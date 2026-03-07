export const ROOM_TYPES = [
  "Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room",
  "Home Office", "Nursery", "Laundry Room", "Mudroom", "Entryway",
  "Sunroom", "Attic", "Basement", "Garage", "Walk-in Closet",
  "Outdoor Patio", "Balcony"
];

export const DESIGN_STYLES = [
  "Modern Minimalist", "Japandi", "Bohemian", "Industrial",
  "Mid-Century Modern", "Coastal", "Scandinavian", "Farmhouse",
  "Traditional", "Transitional", "Art Deco", "Glam", "Rustic",
  "Mediterranean", "Tropical", "Maximalist"
];

export const TOP_CITIES = [
  // North America
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington",
  "Boston", "Nashville", "El Paso", "Detroit", "Portland", "Las Vegas", "Oklahoma City", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta", "Long Beach", "Colorado Springs",
  "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg", "Quebec City", "Hamilton",
  // Europe
  "London", "Paris", "Berlin", "Madrid", "Rome", "Amsterdam", "Stockholm", "Vienna", "Prague", "Warsaw",
  "Dublin", "Brussels", "Copenhagen", "Munich", "Milan", "Barcelona", "Lisbon", "Zurich", "Oslo", "Helsinki",
  "Manchester", "Birmingham", "Edinburgh", "Glasgow", "Nice", "Lyon", "Marseille", "Athens", "Budapest", "Hamburg",
  // Asia & Oceania
  "Tokyo", "Seoul", "Singapore", "Hong Kong", "Bangkok", "Mumbai", "Delhi", "Bangalore", "Dubai", "Abu Dhabi",
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Auckland", "Wellington", "Jakarta", "Manila", "Taipei",
  "Shanghai", "Beijing", "Ho Chi Minh City", "Kuala Lumpur", "Riyadh", "Tel Aviv"
];

export const PAINT_COLORS = [
  "Navy Blue", "Sage Green", "Terracotta", "Greige", "Charcoal Gray",
  "Soft White", "Mustard Yellow", "Forest Green", "Dusty Rose", "Teal",
  "Slate Blue", "Warm Sand", "Espresso", "Olive Green", "Matte Black"
];

export const COMPETITORS = [
  "Interior AI", "RoomGPT", "ReDesign AI", "AI Interior Design", "CoolAIid",
  "Planner 5D", "HomeStyler", "Havenly", "Modsy"
];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function unslugify(slug: string) {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export interface SEOParams {
  room?: string;
  style?: string;
  city?: string;
  color?: string;
  competitor?: string;
  type?: "restyle" | "staging" | "paint" | "alternative";
}

export function getSEOMetadata(params: SEOParams) {
  const { room, style, city, color, competitor, type } = params;

  let title = "AI Room Design & Interior Redesign | HomeRestyler";
  let description = "Transform any space with HomeRestyler's All-in-One AI Spatial Studio. Professional virtual staging, paint visualization, and photoreal interior redesign in seconds.";

  if (type === "staging") {
    title = `AI Virtual Staging for ${room || "Empty Rooms"} | HomeRestyler`;
    description = `Professional AI virtual staging for empty ${room ? room.toLowerCase() + "s" : "homes"}. Furnish any space instantly with ${style || "modern"} decor to increase property value with HomeRestyler.`;
  } else if (type === "paint") {
    title = `AI ${color || ""} Paint Color Visualizer for ${room || "Walls"} | HomeRestyler`;
    description = `Visualize ${color ? color + " " : ""}paint colors on your ${room ? room.toLowerCase() + " " : ""}walls instantly. Our AI paint tool preserves layout and furniture for the perfect preview with HomeRestyler.`;
  } else if (type === "alternative") {
    title = `Best ${competitor || "Interior AI"} Alternative | HomeRestyler.app`;
    description = `Looking for the best ${competitor || "Interior AI"} alternative? HomeRestyler.app offers superior spatial accuracy, realistic textures, and cheaper credits for AI design.`;
  } else if (room && style && city) {
    title = `AI ${style} ${room} Design in ${city} | HomeRestyler`;
    description = `Transform your ${room} in ${city} with AI-powered ${style} design. Upload a photo and see instant, photorealistic ${style} results for your ${city} home today with HomeRestyler.`;
  } else if (room && style) {
    title = `AI ${style} ${room} Design | HomeRestyler.app`;
    description = `Get instant AI ${style} design ideas for your ${room}. HomeRestyler.app helps you visualize your dream ${style} ${room} in seconds with professional AI accuracy.`;
  } else if (room && city) {
    title = `AI ${room} Design in ${city} | HomeRestyler`;
    description = `The best AI ${room} interior design tool for residents in ${city}. Transform your ${room} with HomeRestyler.app's advanced spatial AI technology today.`;
  } else if (style && city) {
    title = `AI ${style} Interior Design in ${city} | HomeRestyler`;
    description = `Professional AI ${style} interior design results in ${city}. HomeRestyler.app brings premium ${style} aesthetics to your ${city} property in seconds.`;
  } else if (room) {
    title = `AI ${room} Interior Design & Redesign | HomeRestyler`;
    description = `Generate stunning AI ${room} design concepts instantly. Use HomeRestyler.app to restyle your ${room} with 20+ styles, custom colors, and photoreal renders.`;
  } else if (style) {
    title = `AI ${style} Interior Design Tool | HomeRestyler`;
    description = `Experience the best AI ${style} interior design with HomeRestyler.app. Transform any space into a ${style} masterpiece with our advanced photoreal AI pipeline.`;
  } else if (city) {
    title = `AI Interior Design in ${city} | HomeRestyler.app`;
    description = `Find the best AI interior design inspiration in ${city}. HomeRestyler.app is the #1 spatial design tool for homeowners and designers in the ${city} area.`;
  }

  if (description.length < 120) {
    description += " Try the future of interior design for free today with our easy-to-use AI studio.";
  }

  return { title, description };
}

export function getSEOContent(params: SEOParams) {
  const { room, style, city, color, competitor, type } = params;

  if (type === "alternative") {
    return {
      intro: `Searching for a better ${competitor} alternative? While ${competitor} offers basic AI redesigns, HomeRestyler.app specializes in architecturally-aware spatial generation that preserves your room's exact dimensions and perspective.`,
      benefit1: `More realistic materials. Unlike ${competitor}, our engine produces high-fidelity textures for wood, metal, and textiles that look physical and locally sourced with HomeRestyler's premium pipeline.`,
      benefit2: `Better value. Our platform plan provides professional-grade results at a fraction of the cost of ${competitor}, with faster generation times and more design styles.`,
    };
  }

  if (type === "staging") {
    return {
      intro: `Virtually furnish your empty ${room || "property"} in seconds. Our AI virtual staging tool is the fastest way for real estate agents and homeowners to visualize potential.`,
      benefit1: `Increase property interest. Staged ${room || "homes"} sell faster. Visualize ${style || "Modern"} furniture in your vacant space without the cost of physical staging.`,
      benefit2: `Perfect perspective. Our AI respects the original room dimensions, ensuring every piece of furniture is perfectly scaled and positioned for a realistic feel.`,
    };
  }

  if (type === "paint") {
    return {
      intro: `See exactly how ${color || "new paint"} looks on your ${room || "walls"}. Avoid painting mistakes by visualizing ${color || "different shades"} in your room's actual lighting.`,
      benefit1: `Isolate wall colors. Our specialized paint mode changes only the walls, keeping your existing furniture, flooring, and decor completely intact for an accurate preview.`,
      benefit2: `Material-aware rendering. AI captures how ${color || "the paint"} interacts with shadows, highlights, and different surfaces like plaster or brick.`,
    };
  }

  const roomText = room ? `your ${room.toLowerCase()}` : "your space";
  const styleText = style ? `the ${style} aesthetic` : "modern design styles";
  const cityText = city ? `homes in ${city}` : "modern properties";

  return {
    intro: `Visualize ${styleText} for ${roomText} instantly. Our AI spatial engine analyzes your existing architecture to deliver professional-grade ${style ? style + " " : ""}results tailored for ${cityText}.`,
    benefit1: `For ${city ? city + " residents" : "homeowners"}, our AI provides localized design trends that match the unique architectural character of ${city || "modern homes"}.`,
    benefit2: `Achieve a perfect ${style || "modern"} balance. Whether you're in a ${city || "city"} apartment or a suburban home, our AI respects your room's natural light and proportions.`,
  };
}
