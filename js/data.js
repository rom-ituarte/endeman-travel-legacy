// ============================================================
// THE JUDY & RON ENDEMAN TRAVEL LEGACY
// Complete Trip Data — 7 Continents, 50+ Destinations
// ============================================================

const ENDEMAN_LEGACY = {

  home: { lat: 32.5149, lng: -117.0382, name: "San Diego, California" },

  allDestinations: [
    // EUROPEAN CRUISE (2017)
    { name: "London",                   lat: 51.5074,  lng:  -0.1278, trip: "european_cruise", country: "United Kingdom" },
    { name: "Paris",                    lat: 48.8566,  lng:   2.3522, trip: "european_cruise", country: "France" },
    { name: "Santiago de Compostela",   lat: 42.8782,  lng:  -8.5448, trip: "european_cruise", country: "Spain" },
    { name: "Gibraltar",                lat: 36.1408,  lng:  -5.3536, trip: "european_cruise", country: "Gibraltar" },
    { name: "Monaco",                   lat: 43.7384,  lng:   7.4246, trip: "european_cruise", country: "Monaco" },
    { name: "Rome",                     lat: 41.9028,  lng:  12.4964, trip: "european_cruise", country: "Italy" },
    { name: "Florence",                 lat: 43.7696,  lng:  11.2558, trip: "european_cruise", country: "Italy" },
    { name: "Barcelona",                lat: 41.3851,  lng:   2.1734, trip: "european_cruise", country: "Spain" },

    // CENTRAL AMERICA CRUISE (2019)
    { name: "Los Cabos",                lat: 22.8905,  lng: -109.9167, trip: "central_america", country: "Mexico" },
    { name: "Acapulco",                 lat: 16.8531,  lng:  -99.8237, trip: "central_america", country: "Mexico" },
    { name: "Antigua, Guatemala",       lat: 14.5586,  lng:  -90.7328, trip: "central_america", country: "Guatemala" },
    { name: "Puntarenas, Costa Rica",   lat:  9.9808,  lng:  -84.8282, trip: "central_america", country: "Costa Rica" },
    { name: "León, Nicaragua",          lat: 12.4343,  lng:  -86.8779, trip: "central_america", country: "Nicaragua" },
    { name: "Panama Canal",             lat:  9.0800,  lng:  -79.6800, trip: "central_america", country: "Panama" },
    { name: "Cartagena, Colombia",      lat: 10.3910,  lng:  -75.4794, trip: "central_america", country: "Colombia" },
    { name: "Havana, Cuba",             lat: 23.1136,  lng:  -82.3666, trip: "central_america", country: "Cuba" },
    { name: "Miami",                    lat: 25.7617,  lng:  -80.1918, trip: "central_america", country: "USA" },

    // AFRICA SAFARI 1 (2020)
    { name: "Johannesburg",             lat: -26.2041, lng:  28.0473, trip: "africa", country: "South Africa" },
    { name: "Zimbabwe",                 lat: -17.9244, lng:  25.8566, trip: "africa", country: "Zimbabwe" },
    { name: "Zambia (Victoria Falls)",  lat: -17.8618, lng:  25.8579, trip: "africa", country: "Zambia" },
    { name: "Serengeti, Tanzania",      lat:  -2.3326, lng:  34.8331, trip: "africa", country: "Tanzania" },
    { name: "Masai Mara, Kenya",        lat:  -1.4061, lng:  35.0087, trip: "africa", country: "Kenya" },

    // AFRICA SAFARI 2 (2025)
    { name: "Nairobi, Kenya",           lat:  -1.2921, lng:  36.8219, trip: "africa2", country: "Kenya" },
    { name: "Amboseli, Kenya",          lat:  -2.6527, lng:  37.2606, trip: "africa2", country: "Kenya" },
    { name: "Ngorongoro, Tanzania",     lat:  -3.2539, lng:  35.5010, trip: "africa2", country: "Tanzania" },
    { name: "Zanzibar",                 lat:  -6.1659, lng:  39.2026, trip: "africa2", country: "Tanzania" },

    // ALASKA CRUISE (2021)
    { name: "Seattle",                  lat: 47.6062,  lng: -122.3321, trip: "alaska", country: "USA" },
    { name: "Ketchikan",                lat: 55.3422,  lng: -131.6461, trip: "alaska", country: "USA" },
    { name: "Juneau",                   lat: 58.3005,  lng: -134.4197, trip: "alaska", country: "USA" },
    { name: "Skagway",                  lat: 59.4605,  lng: -135.3144, trip: "alaska", country: "USA" },

    // BAJA WHALE WATCHING (2022)
    { name: "Ensenada",                 lat: 31.8670,  lng: -116.5960, trip: "baja_mexico", country: "Mexico" },
    { name: "Cataviña",                 lat: 29.7500,  lng: -114.6800, trip: "baja_mexico", country: "Mexico" },
    { name: "Guerrero Negro",           lat: 27.9748,  lng: -114.0597, trip: "baja_mexico", country: "Mexico" },

    // MEDITERRANEAN & HOLY LAND CRUISE (2022)
    { name: "Israel",                   lat: 31.7683,  lng:  35.2137, trip: "mediterranean", country: "Israel" },
    { name: "Cyprus",                   lat: 35.1264,  lng:  33.4299, trip: "mediterranean", country: "Cyprus" },
    { name: "Kusadasi, Turkey",         lat: 37.8560,  lng:  27.2594, trip: "mediterranean", country: "Turkey" },
    { name: "Albania",                  lat: 39.8758,  lng:  20.0022, trip: "mediterranean", country: "Albania" },
    { name: "Dubrovnik, Croatia",       lat: 42.6507,  lng:  18.0944, trip: "mediterranean", country: "Croatia" },
    { name: "Athens, Greece",           lat: 37.9838,  lng:  23.7275, trip: "mediterranean", country: "Greece" },
    { name: "Venice",                   lat: 45.4408,  lng:  12.3155, trip: "mediterranean", country: "Italy" },

    // EGYPT CRUISE (2023)
    { name: "Cairo",                    lat: 30.0444,  lng:  31.2357, trip: "egypt", country: "Egypt" },
    { name: "Luxor",                    lat: 25.6872,  lng:  32.6396, trip: "egypt", country: "Egypt" },
    { name: "The Nile",                 lat: 26.8204,  lng:  30.8025, trip: "egypt", country: "Egypt" },
    { name: "Abu Simbel",               lat: 22.3372,  lng:  31.6258, trip: "egypt", country: "Egypt" },

    // ASIA (2024)
    { name: "Singapore",                lat:  1.3521,  lng: 103.8198, trip: "asia", country: "Singapore" },
    { name: "Vietnam",                  lat: 10.8231,  lng: 106.6297, trip: "asia", country: "Vietnam" },
    { name: "Hong Kong",                lat: 22.3193,  lng: 114.1694, trip: "asia", country: "China" },
    { name: "Taipei, Taiwan",           lat: 25.0330,  lng: 121.5654, trip: "asia", country: "Taiwan" },
    { name: "Tokyo, Japan",             lat: 35.6762,  lng: 139.6503, trip: "asia", country: "Japan" },
    { name: "Kagoshima, Japan",         lat: 31.5969,  lng: 130.5571, trip: "asia", country: "Japan" },

    // AUSTRALIA & NEW ZEALAND CRUISE (2025)
    { name: "Cairns / Great Barrier Reef", lat: -16.9186, lng: 145.7781, trip: "australia_nz", country: "Australia" },
    { name: "Melbourne",                lat: -37.8136, lng: 144.9631, trip: "australia_nz", country: "Australia" },
    { name: "Sydney",                   lat: -33.8688, lng: 151.2093, trip: "australia_nz", country: "Australia" },
    { name: "Tasmania",                 lat: -42.8821, lng: 147.3272, trip: "australia_nz", country: "Australia" },
    { name: "Christchurch, New Zealand",lat: -43.5321, lng: 172.6362, trip: "australia_nz", country: "New Zealand" },
    { name: "Auckland",                 lat: -36.8485, lng: 174.7633, trip: "australia_nz", country: "New Zealand" },

    // END OF THE WORLD — Argentina & Antarctica (2026)
    { name: "Buenos Aires",             lat: -34.6037, lng:  -58.3816, trip: "argentina_antartica", country: "Argentina" },
    { name: "Ushuaia",                  lat: -54.8019, lng:  -68.3029, trip: "argentina_antartica", country: "Argentina" },
    { name: "Antarctic Peninsula",      lat: -64.2628, lng:  -56.7219, trip: "argentina_antartica", country: "Antarctica" },
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
      id: "central_america",
      folder: "PANAMA TO PARADISE",
      destination: "Central America",
      subtitle: "Jungles, Canals & the Caribbean",
      countries: ["Mexico", "Guatemala", "Costa Rica", "Nicaragua", "Panama", "Colombia", "Cuba", "USA"],
      continent: "North America",
      continentLabel: "Central America",
      centerLat: 16.0, centerLng: -88.0, zoom: 4,
      color: "#52B788", colorDark: "#2A7A50",
      emoji: "🌴", order: 2, year: 2019, isCruise: true,
      highlights: [
        "Los Cabos & Acapulco, Mexico",
        "Antigua Guatemala — Colonial City",
        "Panama Canal — Engineering Wonder",
        "Puntarenas, Costa Rica",
        "León, Nicaragua",
        "Cartagena, Colombia",
        "Havana, Cuba",
        "Miami, USA"
      ],
      locations: ["Los Cabos", "Acapulco", "Antigua (Guatemala)", "Puntarenas (Costa Rica)", "León (Nicaragua)", "Panama Canal", "Cartagena (Colombia)", "Havana (Cuba)", "Miami"],
      bookText: "Central America — From the Pacific coast of Mexico through colonial cities, the Panama Canal, and all the way to Havana. One of the most epic cruises of our journey together.",
      photos: []
    },
    {
      id: "africa",
      folder: "AFRICA1",
      destination: "Africa — Safari",
      subtitle: "The Wild Continent",
      countries: ["South Africa", "Zimbabwe", "Zambia", "Tanzania", "Kenya"],
      continent: "Africa",
      continentLabel: "Africa",
      centerLat: -10.0, centerLng: 28.0, zoom: 4,
      color: "#F4A261", colorDark: "#C4621A",
      emoji: "🦁", order: 3, year: 2020,
      highlights: [
        "Safari in Masai Mara",
        "Great Migration of the Serengeti",
        "Victoria Falls (Zambia/Zimbabwe)",
        "The Big Five",
        "Johannesburg & Soweto",
        "Sunrise on the Savanna",
        "The Maasai Tribe"
      ],
      locations: ["Johannesburg", "Zimbabwe", "Zambia (Victoria Falls)", "Serengeti (Tanzania)", "Masai Mara (Kenya)"],
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
      centerLat: 58.0, centerLng: -136.0, zoom: 5,
      color: "#74C0E8", colorDark: "#2A80B8",
      emoji: "🐻", order: 4, year: 2021, isCruise: true,
      highlights: [
        "Majestic Glaciers",
        "Whales & Orcas",
        "Ketchikan — Salmon Capital",
        "Juneau — Alaska's Capital",
        "Skagway — Gold Rush Town",
        "Seattle — The Emerald City",
        "Arctic Wilderness"
      ],
      locations: ["Seattle", "Ketchikan", "Juneau", "Skagway"],
      bookText: "Alaska — Where glaciers meet the sky and nature speaks louder than words. Another unforgettable chapter of our journey together.",
      photos: []
    },
    {
      id: "baja_mexico",
      folder: "BAJA",
      destination: "Baja Whale Watching",
      subtitle: "In Search of the Gray Whale",
      countries: ["Mexico"],
      continent: "North America",
      continentLabel: "North America",
      centerLat: 28.5, centerLng: -114.5, zoom: 6,
      color: "#FF8C61", colorDark: "#C44A20",
      emoji: "🐋", order: 5, year: 2022,
      highlights: [
        "Gray Whale Watching, Guerrero Negro",
        "Whale Lagoon — Up Close Encounters",
        "Ensenada's Wine Country",
        "Cataviña Desert & Boulders",
        "Pacific Coast Sunsets",
        "Baja Desert Landscapes",
        "Sea of Cortez"
      ],
      locations: ["Ensenada", "Cataviña", "Guerrero Negro"],
      bookText: "Baja Whale Watching — A road trip down the Baja peninsula to witness the magnificent gray whales up close at Guerrero Negro. Raw, wild, and breathtaking.",
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
      emoji: "🏛️", order: 6, year: 2022, isCruise: true,
      highlights: [
        "The Holy Land, Israel",
        "Dubrovnik — Pearl of the Adriatic",
        "Acropolis of Athens",
        "Canals of Venice",
        "Ephesus, Turkey",
        "Aegean Sea, Greece",
        "Cyprus — Island of Aphrodite"
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
      emoji: "🔺", order: 7, year: 2023, isCruise: true,
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
      id: "asia",
      folder: "ASIA",
      destination: "Asia",
      subtitle: "The Continent of Contrasts",
      countries: ["Singapore", "Vietnam", "Hong Kong", "Taiwan", "Japan"],
      continent: "Asia",
      continentLabel: "Asia",
      centerLat: 20.0, centerLng: 115.0, zoom: 3,
      color: "#FF6B9D", colorDark: "#C02060",
      emoji: "🏯", order: 8, year: 2024,
      highlights: [
        "Tokyo — The City of the Future",
        "Singapore — The Garden City",
        "Vietnam — History & Nature",
        "Hong Kong — City of Light",
        "Taipei & Night Markets",
        "Kagoshima & Sakurajima Volcano",
        "Ancient Temples & Modern Skylines"
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
      centerLat: -38.0, centerLng: 162.0, zoom: 3,
      color: "#A8DADC", colorDark: "#3A8A8C",
      emoji: "🦘", order: 9, year: 2025, isCruise: true, month: "Feb",
      highlights: [
        "Great Barrier Reef, Cairns",
        "Melbourne — Culture Capital",
        "Sydney Opera House",
        "Tasmania — Wild Nature",
        "New Zealand Fiords",
        "Christchurch & Auckland",
        "Unique Wildlife of the World"
      ],
      locations: ["Cairns / Great Barrier Reef", "Melbourne", "Sydney", "Tasmania", "Christchurch (NZ)", "Auckland (NZ)"],
      bookText: "Australia & New Zealand — Breathtaking landscapes, peaceful shores, and another unforgettable journey shared together. Where nature's beauty made every moment even more special.",
      photos: []
    },
    {
      id: "africa2",
      folder: "AFRICA2",
      destination: "Africa — Safari II",
      subtitle: "Return to the Wild",
      countries: ["Kenya", "Tanzania"],
      continent: "Africa",
      continentLabel: "Africa",
      centerLat: -3.0, centerLng: 37.0, zoom: 5,
      color: "#F4A261", colorDark: "#C4621A",
      emoji: "🦒", order: 10, year: 2025,
      highlights: [
        "Nairobi — The Safari Capital",
        "Amboseli — Kilimanjaro Views",
        "Ngorongoro Crater — The Garden of Eden",
        "Zanzibar — Spice Island",
        "The Big Five Again",
        "Sundowners on the Savanna"
      ],
      locations: ["Nairobi", "Amboseli (Kenya)", "Ngorongoro (Tanzania)", "Zanzibar"],
      bookText: "Africa Safari II — The call of the wild brought us back. A second safari, new landscapes, and once again an Africa that took our breath away.",
      photos: []
    },
    {
      id: "argentina_antartica",
      folder: "ARGENTINA",
      destination: "End of the World",
      subtitle: "From Patagonia to the Ice",
      countries: ["Argentina", "Antarctica"],
      continent: "South America",
      continentLabel: "South America · Antarctica",
      centerLat: -52.0, centerLng: -65.0, zoom: 3,
      color: "#B8D4E8", colorDark: "#4A7A9A",
      emoji: "🐧", order: 11, year: 2026, isCruise: true,
      highlights: [
        "Buenos Aires — The Paris of South America",
        "Tango in La Boca",
        "Ushuaia — The World's Southernmost City",
        "Beagle Channel",
        "Antarctic Peninsula",
        "Penguins in their Natural Habitat",
        "Monumental Icebergs"
      ],
      locations: ["Buenos Aires", "Ushuaia", "Antarctic Peninsula"],
      bookText: "End of the World — From the vibrant streets of Buenos Aires to the frozen edge of the Earth. The most extraordinary final chapter of an extraordinary journey.",
      photos: []
    },
  ],

  stats: {
    continents: 7,
    countries: 32,
    destinations: 56,
    trips: 11,
    years: "10+",
    travelers: 20
  },

  continents: [
    { name: "North America",           emoji: "🌎", trips: ["alaska", "baja_mexico", "central_america"], visited: true },
    { name: "South America",           emoji: "🌎", trips: ["argentina_antartica"], visited: true },
    { name: "Europe",                  emoji: "🌍", trips: ["european_cruise", "mediterranean"], visited: true },
    { name: "Africa",                  emoji: "🌍", trips: ["egypt", "africa", "africa2"], visited: true },
    { name: "Asia",                    emoji: "🌏", trips: ["asia", "mediterranean"], visited: true },
    { name: "Australia & the Pacific", emoji: "🌏", trips: ["australia_nz"], visited: true },
    { name: "Antarctica",              emoji: "❄️",  trips: ["argentina_antartica"], visited: true }
  ]
};
