export const imagePlaceholders = {
  hero: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1600&h=900&fit=crop&crop=center",
  heroSlides: [
    "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=1080&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1920&h=1080&fit=crop&crop=center",
  ],

  about: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=1000&fit=crop&crop=center",
  aboutSecondary: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=400&fit=crop&crop=center",

  unitTK: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&h=400&fit=crop&crop=center",
  unitSD: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&crop=center",
  unitSMP: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&crop=top",
  unitSMA: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop&crop=center",

  programTahfidz: "https://images.unsplash.com/photo-1585036156171-384164a8c159?w=600&h=400&fit=crop&crop=center",
  programSTEM: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=400&fit=crop&crop=center",
  programLanguage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&crop=center",
  programLeadership: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&crop=center",

  schoolLife: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop&crop=center",
  schoolLife1: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=450&fit=crop&crop=center",
  schoolLife2: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=450&fit=crop&crop=center",
  schoolLife3: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=450&fit=crop&crop=center",

  gallery1: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&crop=center",
  gallery2: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&h=800&fit=crop&crop=center",
  gallery3: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&crop=center",
  gallery4: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop&crop=center",
  gallery5: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=600&fit=crop&crop=center",

  news1: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop&crop=center",
  news2: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop&crop=center",
  news3: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&crop=center",

  ppdb: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop&crop=center",

  fallback: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&crop=center",
} as const;

export type PlaceholderKey = keyof typeof imagePlaceholders;
