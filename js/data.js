// ============================================================
// THE JUDY & RON ENDEMAN TRAVEL LEGACY
// Complete Trip Data — 7 Continents, 50+ Destinations
// ============================================================

const ENDEMAN_LEGACY = {

  home: { lat: 32.5149, lng: -117.0382, name: "San Diego, California" },

  allDestinations: [
    // EUROPE — CRUISE
    { name: "London", lat: 51.5074, lng: -0.1278, trip: "european_cruise", country: "United Kingdom" },
    { name: "Paris", lat: 48.8566, lng: 2.3522, trip: "european_cruise", country: "France" },
    { name: "Santiago de Compostela", lat: 42.8782, lng: -8.5448, trip: "european_cruise", country: "Spain" },
    { name: "Gibraltar", lat: 36.1408, lng: -5.3536, trip: "european_cruise", country: "Gibraltar" },
    { name: "Monaco", lat: 43.7384, lng: 7.4246, trip: "european_cruise", country: "Monaco" },
    { name: "Rome", lat: 41.9028, lng: 12.4964, trip: "european_cruise", country: "Italy" },
    { name: "Florence", lat: 43.7696, lng: 11.2558, trip: "european_cruise", country: "Italy" },
    { name: "Barcelona", lat: 41.3851, lng: 2.1734, trip: "european_cruise", country: "Spain" },

    // MEDITERRANEAN / MIDDLE EAST
    { name: "Israel", lat: 31.7683, lng: 35.2137, trip: "mediterranean", country: "Israel" },
    { name: "Cyprus", lat: 35.1264, lng: 33.4299, trip: "mediterranean", country: "Cyprus" },
    { name: "Kusadasi, Turkey", lat: 37.8560, lng: 27.2594, trip: "mediterranean", country: "Turkey" },
    { name: "Albania", lat: 39.8758, lng: 20.0022, trip: "mediterranean", country: "Albania" },
    { name: "Dubrovnik, Croatia", lat: 42.6507, lng: 18.0944, trip: "mediterranean", country: "Croatia" },
    { name: "Athens, Greece", lat: 37.9838, lng: 23.7275, trip: "mediterranean", country: "Greece" },
    { name: "Venice", lat: 45.4408, lng: 12.3155, trip: "mediterranean", country: "Italy" },

    // EGYPT
    { name: "Cairo", lat: 30.0444, lng: 31.2357, trip: "egypt", country: "Egypt" },
    { name: "Luxor", lat: 25.6872, lng: 32.6396, trip: "egypt", country: "Egypt" },
    { name: "The Nile", lat: 26.8204, lng: 30.8025, trip: "egypt", country: "Egypt" },
    { name: "Abu Simbel", lat: 22.3372, lng: 31.6258, trip: "egypt", country: "Egypt" },

    // AFRICA SAFARI
    { name: "Zimbabwe", lat: -17.9244, lng: 25.8566, trip: "africa", country: "Zimbabwe" },
    { name: "Zambia", lat: -17.8618, lng: 25.8579, trip: "africa", country: "Zambia" },
    { name: "Serengeti, Tanzania", lat: -2.3326, lng: 34.8331, trip: "africa", country: "Tanzania" },
    { name: "Masai Mara, Kenya", lat: -1.4061, lng: 35.0087, trip: "africa", country: "Kenya" },
    { name: "Johannesburg", lat: -26.2041, lng: 28.0473, trip: "africa", country: "South Africa" },

    // CENTRAL AMERICA
    { name: "Antigua, Guatemala", lat: 14.5586, lng: -90.7328, trip: "central_america", country: "Guatemala" },
    { name: "Puntarenas, Costa Rica", lat: 9.9808, lng: -84.8282, trip: "central_america", country: "Costa Rica" },
    { name: "León, Nicaragua", lat: 12.4343, lng: -86.8779, trip: "central_america", country: "Nicaragua" },
    { name: "Panama Canal", lat: 9.0800, lng: -79.6800, trip: "central_america", country: "Panama" },

    // CUBA / MIAMI
    { name: "Cuba", lat: 23.1136, lng: -82.3666, trip: "cuba", country: "Cuba" },
    { name: "Miami", lat: 25.7617, lng: -80.1918, trip: "cuba", country: "USA" },

    // ALASKA
    { name: "Seattle", lat: 47.6062, lng: -122.3321, trip: "alaska", country: "USA" },
    { name: "Alaska", lat: 63.1148, lng: -151.1926, trip: "alaska", country: "USA" },

    // BAJA (Endeman trips only — Ensenada, San Quintin, Los Cabos)
    { name: "Ensenada", lat: 31.8670, lng: -116.5960, trip: "baja_mexico", country: "Mexico" },
    { name: "San Quintín", lat: 30.4800, lng: -115.9700, trip: "baja_mexico", country: "Mexico" },
    { name: "Los Cabos", lat: 22.8905, lng: -109.9167, trip: "baja_mexico", country: "Mexico" },

    // ASIA
    { name: "Singapore", lat: 1.3521, lng: 103.8198, trip: "asia", country: "Singapore" },
    { name: "Vietnam", lat: 10.8231, lng: 106.6297, trip: "asia", country: "Vietnam" },
    { name: "Hong Kong", lat: 22.3193, lng: 114.1694, trip: "asia", country: "China" },
    { name: "Taipei, Taiwan", lat: 25.0330, lng: 121.5654, trip: "asia", country: "Taiwan" },
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, trip: "asia", country: "Japan" },
    { name: "Kagoshima, Japan", lat: 31.5969, lng: 130.5571, trip: "asia", country: "Japan" },

    // AUSTRALIA / NEW ZEALAND
    { name: "Great Barrier Reef, Cairns", lat: -16.9186, lng: 145.7781, trip: "australia_nz", country: "Australia" },
    { name: "Sydney", lat: -33.8688, lng: 151.2093, trip: "australia_nz", country: "Australia" },
    { name: "Tasmania", lat: -42.8821, lng: 147.3272, trip: "australia_nz", country: "Australia" },
    { name: "Christchurch, New Zealand", lat: -43.5321, lng: 172.6362, trip: "australia_nz", country: "New Zealand" },
    { name: "Auckland", lat: -36.8485, lng: 174.7633, trip: "australia_nz", country: "New Zealand" },

    // ARGENTINA
    { name: "Buenos Aires", lat: -34.6037, lng: -58.3816, trip: "argentina", country: "Argentina" },
    { name: "Ushuaia", lat: -54.8019, lng: -68.3029, trip: "argentina", country: "Argentina" },

    // ANTARCTICA
    { name: "Antarctica", lat: -64.2628, lng: -56.7219, trip: "antarctica", country: "Antarctica" },
  ],

  trips: [
    {
      id: "european_cruise",
      folder: "European Cruise",
      destination: "European Cruise",
      subtitle: "The Heart of the Old World",
      countries: ["United Kingdom", "France", "Spain", "Italy", "Monaco"],
      continent: "Europe",
      continentLabel: "Europe",
      centerLat: 45.0, centerLng: 5.0, zoom: 4,
      color: "#C8A96E", colorDark: "#8B6914",
      emoji: "⚓", order: 1, year: 2017, isCruise: true,
      highlights: [
        "Eiffel Tower, Paris",
        "The Colosseum, Rome",
        "Sagrada Família, Barcelona",
        "Cathedral of Santiago de Compostela",
        "The Rock of Gibraltar",
        "The Principality of Monaco",
        "Florence & the Renaissance"
      ],
      locations: ["London", "Paris", "Santiago de Compostela", "Gibraltar", "Monaco", "Rome", "Florence", "Barcelona"],
      bookText: "European Cruise — The Beginning of the Journey. From the elegant boulevards of Paris to the ancient grandeur of Rome, this cruise through Europe marked the beginning of an extraordinary tradition of travel together.",
      photos: []
    },
    {
      id: "mediterranean",
      folder: "ISRAEL",
      destination: "Mediterranean & Holy Land",
      subtitle: "Land of Ancient History",
      countries: ["Israel", "Cyprus", "Turkey", "Albania", "Croatia", "Greece", "Italy"],
      continent: "Europe",
      continentLabel: "Europe · Asia",
      centerLat: 37.0, centerLng: 24.0, zoom: 4,
      color: "#4ECDC4", colorDark: "#2A8A85",
      emoji: "🏛️", order: 2, year: 2022, isCruise: true,
      highlights: [
        "The Holy Land, Israel",
        "Dubrovnik — Pearl of the Adriatic",
        "Acropolis of Athens",
        "Canals of Venice",
        "Ephesus, Turkey",
        "The Walls of Dubrovnik",
        "Aegean Sea, Greece"
      ],
      locations: ["Israel", "Cyprus", "Kusadasi (Turkey)", "Albania", "Dubrovnik", "Athens", "Venice"],
      bookText: "Mediterranean Journey — Ancient cities, breathtaking views, and another unforgettable adventure shared together.",
      photos: []
    },
    {
      id: "egypt",
      folder: "EGYPT",
      destination: "Egypt",
      subtitle: "Wonders of the Ancient World",
      countries: ["Egypt"],
      continent: "Africa",
      continentLabel: "Africa",
      centerLat: 26.5, centerLng: 31.0, zoom: 6,
      color: "#E8C547", colorDark: "#A8880A",
      emoji: "🔺", order: 3, year: 2023,
      highlights: [
        "The Pyramids of Giza",
        "The Great Sphinx",
        "Egyptian Museum, Cairo",
        "Temples of Luxor",
        "Abu Simbel — Treasure of Nubia",
        "Nile River Cruise",
        "Valley of the Kings"
      ],
      locations: ["Cairo", "Luxor", "The Nile", "Abu Simbel"],
      bookText: "Egypt — Among temples, pyramids, and the Nile, we experienced one of the most unforgettable adventures of our lives — together.",
      photos: []
    },
    {
      id: "africa",
      folder: "AFRICA1",
      destination: "Africa — Safari",
      subtitle: "The Wild Continent",
      countries: ["Kenya", "Tanzania", "Zambia", "Zimbabwe", "South Africa"],
      continent: "Africa",
      continentLabel: "Africa",
      centerLat: -10.0, centerLng: 28.0, zoom: 4,
      color: "#F4A261", colorDark: "#C4621A",
      emoji: "🦁", order: 4, year: 2020,
      highlights: [
        "Safari in Masai Mara",
        "Great Migration of the Serengeti",
        "Victoria Falls (Zambia/Zimbabwe)",
        "The Big Five",
        "Johannesburg & Soweto",
        "Sunrise on the Savanna",
        "The Maasai Tribe"
      ],
      locations: ["Masai Mara (Kenya)", "Serengeti (Tanzania)", "Victoria Falls (Zambia)", "Zimbabwe", "Johannesburg"],
      bookText: "Africa Safari — An intimate encounter with nature in its most pure state. The Great Migration, the Big Five, and an Africa that stays with you forever.",
      photos: []
    },
    {
      id: "alaska",
      folder: "ALASKA",
      destination: "Alaska",
      subtitle: "The Last Frontier",
      countries: ["USA"],
      continent: "North America",
      continentLabel: "North America",
      centerLat: 61.0, centerLng: -153.0, zoom: 5,
      color: "#74C0E8", colorDark: "#2A80B8",
      emoji: "🐻", order: 5, year: 2021,
      highlights: [
        "Mount Denali",
        "Majestic Glaciers",
        "Whales & Orcas",
        "Northern Lights",
        "Seattle — The Emerald City",
        "Alaska Wildlife",
        "Arctic Wilderness"
      ],
      locations: ["Seattle", "Alaska / Denali"],
      bookText: "Alaska — Where glaciers meet the sky and nature speaks louder than words. Another unforgettable chapter of our journey together.",
      photos: []
    },
    {
      id: "baja_mexico",
      folder: "BAJA",
      destination: "Baja California",
      subtitle: "Sea & Desert",
      countries: ["Mexico"],
      continent: "North America",
      continentLabel: "North America",
      centerLat: 27.0, centerLng: -113.0, zoom: 6,
      color: "#FF8C61", colorDark: "#C44A20",
      emoji: "🌊", order: 6, year: 2022,
      highlights: [
        "The Arch of Los Cabos",
        "Gray Whale Watching",
        "Ensenada's Wine Country",
        "San Quintín — Bird Paradise",
        "Pacific Coast Sunsets",
        "Sea of Cortez",
        "Fresh Seafood on the Shore"
      ],
      locations: ["Ensenada", "San Quintín", "Los Cabos"],
      bookText: "Baja California — The magic of Mexico's Pacific coast, from whale watching to the iconic Arch of Cabo. Home, but always an adventure.",
      photos: []
    },
    {
      id: "central_america",
      folder: "PANAMA TO PARADISE",
      destination: "Central America",
      subtitle: "From Jungles to World Wonders",
      countries: ["Guatemala", "Costa Rica", "Nicaragua", "Panama"],
      continent: "North America",
      continentLabel: "Central America",
      centerLat: 10.5, centerLng: -84.0, zoom: 5,
      color: "#52B788", colorDark: "#2A7A50",
      emoji: "🌴", order: 7, year: 2019,
      highlights: [
        "Antigua Guatemala — Colonial City",
        "Panama Canal — Engineering Wonder",
        "Puntarenas, Costa Rica",
        "León, Nicaragua — Historic City",
        "Tropical Rainforests",
        "Wildlife & Biodiversity",
        "Central American Volcanoes"
      ],
      locations: ["Antigua (Guatemala)", "Puntarenas (Costa Rica)", "León (Nicaragua)", "Panama Canal"],
      bookText: "Central America — From colonial cities to engineering wonders, new landscapes and another unforgettable chapter of memories shared together.",
      photos: []
    },
    {
      id: "cuba",
      folder: "CUBA",
      destination: "Cuba & Miami",
      subtitle: "Rhythm, History & the Caribbean",
      countries: ["Cuba", "USA"],
      continent: "North America",
      continentLabel: "Caribbean",
      centerLat: 23.5, centerLng: -79.0, zoom: 5,
      color: "#E63946", colorDark: "#A01020",
      emoji: "💃", order: 8, year: 2024,
      highlights: [
        "Old Havana",
        "Cuban Salsa & Music",
        "El Malecón",
        "Classic 1950s Cars",
        "Miami Beach",
        "Little Havana, Miami",
        "Turquoise Caribbean"
      ],
      locations: ["Havana, Cuba", "Miami, Florida"],
      bookText: "Cuba & Miami — Colors, music, rhythm, and the warmth of the Caribbean. A journey between two worlds connected by the sea.",
      photos: []
    },
    {
      id: "asia",
      folder: "ASIA",
      destination: "Asia",
      subtitle: "The Continent of Contrasts",
      countries: ["Singapore", "Vietnam", "Hong Kong", "Taiwan", "Japan"],
      continent: "Asia",
      continentLabel: "Asia",
      centerLat: 20.0, centerLng: 115.0, zoom: 3,
      color: "#FF6B9D", colorDark: "#C02060",
      emoji: "🏯", order: 9, year: 2024,
      highlights: [
        "Tokyo — The City of the Future",
        "Temples of Kyoto",
        "Mount Fuji",
        "Singapore — The Garden City",
        "Vietnam — History & Nature",
        "Hong Kong — City of Light",
        "Kagoshima & Sakurajima Volcano"
      ],
      locations: ["Singapore", "Vietnam", "Hong Kong", "Taipei (Taiwan)", "Tokyo", "Kagoshima"],
      bookText: "Asia — Between ancient tradition and 21st-century ultramodernity. Vibrant cultures, beautiful landscapes, and another unforgettable adventure shared together.",
      photos: []
    },
    {
      id: "australia_nz",
      folder: "AUSTRALIA_&_NEW_ZELAND_",
      destination: "Australia & New Zealand",
      subtitle: "To the Edge of the Earth",
      countries: ["Australia", "New Zealand"],
      continent: "Australia & the Pacific",
      continentLabel: "Australia & the Pacific",
      centerLat: -35.0, centerLng: 165.0, zoom: 3,
      color: "#A8DADC", colorDark: "#3A8A8C",
      emoji: "🦘", order: 10, year: 2025,
      highlights: [
        "Sydney Opera House",
        "Great Barrier Reef",
        "Tasmania — Wild Nature",
        "New Zealand Fiords",
        "Christchurch",
        "Auckland — City of Sails",
        "Unique Wildlife of the World"
      ],
      locations: ["Cairns / Great Barrier Reef", "Sydney", "Tasmania", "Christchurch", "Auckland"],
      bookText: "Australia & New Zealand — Breathtaking landscapes, peaceful shores, and another unforgettable journey shared together. Where nature's beauty made every moment even more special.",
      photos: []
    },
    {
      id: "argentina",
      folder: "ARGENTINA",
      destination: "Argentina",
      subtitle: "The Country at the End of the World",
      countries: ["Argentina"],
      continent: "South America",
      continentLabel: "South America",
      centerLat: -42.0, centerLng: -65.0, zoom: 4,
      color: "#75B2DD", colorDark: "#2A5A8A",
      emoji: "🥩", order: 11, year: null,
      highlights: [
        "Buenos Aires — The Paris of South America",
        "Tango in La Boca",
        "Ushuaia — The World's Southernmost City",
        "Beagle Channel",
        "Argentine Patagonia",
        "Glaciers",
        "Argentine Asado"
      ],
      locations: ["Buenos Aires", "Ushuaia"],
      bookText: "Argentina — From the vibrant Buenos Aires to the southernmost city in the world, a country of infinite contrasts and unforgettable moments.",
      photos: []
    },
    {
      id: "antarctica",
      folder: "ANTARTICA",
      destination: "Antarctica",
      subtitle: "The Last Continent",
      countries: ["Antarctica"],
      continent: "Antarctica",
      continentLabel: "Antarctica",
      centerLat: -66.0, centerLng: -57.0, zoom: 4,
      color: "#B8D4E8", colorDark: "#4A7A9A",
      emoji: "🐧", order: 12, year: 2026,
      highlights: [
        "Penguins in their Natural Habitat",
        "Monumental Icebergs",
        "Absolute Silence",
        "Humpback Whales",
        "Aurora Australis",
        "The Antarctic Peninsula",
        "A Place Few Humans Have Ever Seen"
      ],
      locations: ["Antarctic Peninsula"],
      bookText: "Antarctica — The most remote and pristine place on Earth. A privilege that few human beings ever experience. The final chapter in our extraordinary journey around the world.",
      photos: []
    }
  ],

  stats: {
    continents: 7,
    countries: 30,
    destinations: 50,
    trips: 12,
    years: "10+",
    travelers: 20
  },

  continents: [
    { name: "North America", emoji: "🌎", trips: ["alaska", "baja_mexico", "central_america", "cuba"], visited: true },
    { name: "South America", emoji: "🌎", trips: ["argentina"], visited: true },
    { name: "Europe", emoji: "🌍", trips: ["european_cruise", "mediterranean"], visited: true },
    { name: "Africa", emoji: "🌍", trips: ["egypt", "africa"], visited: true },
    { name: "Asia", emoji: "🌏", trips: ["asia", "mediterranean"], visited: true },
    { name: "Australia & the Pacific", emoji: "🌏", trips: ["australia_nz"], visited: true },
    { name: "Antarctica", emoji: "❄️", trips: ["antarctica"], visited: true }
  ]
};
