export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
};

export type Service = {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
};

export type Stylist = {
  id: number;
  name: string;
  specialty: string;
  image: string;
  bio: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Linen Midi Dress",
    price: 1890,
    category: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
    ],
    description:
      "Breathable pure linen midi dress with a soft A-line silhouette. Perfect for warm days and elevated casual looks.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Ivory", "Sage", "Terracotta"],
  },
  {
    id: 2,
    name: "Silk Blouse",
    price: 1450,
    category: "tops",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"],
    description:
      "Fluid silk blouse with a relaxed fit and delicate mother-of-pearl buttons. Pairs beautifully with tailored trousers.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne", "Black", "Soft Rose"],
  },
  {
    id: 3,
    name: "Wide-Leg Trousers",
    price: 1680,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"],
    description:
      "High-waisted wide-leg trousers in a soft structured fabric. Effortless and flattering on every body.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Charcoal", "Cream", "Olive"],
  },
  {
    id: 4,
    name: "Cashmere Cardigan",
    price: 2490,
    category: "tops",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"],
    description:
      "Ultra-soft pure cashmere cardigan. Lightweight yet warm — the ultimate layering piece.",
    sizes: ["S", "M", "L"],
    colors: ["Oatmeal", "Camel", "Black"],
  },
  {
    id: 5,
    name: "Wrap Maxi Skirt",
    price: 1590,
    category: "bottoms",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80"],
    description:
      "Flowing wrap maxi skirt with an adjustable fit. Moves beautifully with every step.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Terracotta", "Black", "Ivory"],
  },
  {
    id: 6,
    name: "Structured Blazer",
    price: 2890,
    category: "outerwear",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6ca87?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6ca87?w=800&q=80"],
    description:
      "Tailored blazer with soft shoulder and clean lines. Instantly elevates any outfit.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Camel", "Ivory"],
  },
  {
    id: 7,
    name: "Gold Hoop Earrings",
    price: 680,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"],
    description:
      "Lightweight 14k gold-plated hoops. Everyday elegance that goes with everything.",
    sizes: ["One Size"],
    colors: ["Gold"],
  },
  {
    id: 8,
    name: "Leather Crossbody",
    price: 2190,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"],
    description:
      "Soft full-grain leather crossbody with adjustable strap. Perfect for hands-free days.",
    sizes: ["One Size"],
    colors: ["Cognac", "Black", "Cream"],
  },
];

export const services: Service[] = [
  {
    id: 1,
    name: "Wig Installation",
    duration: 90,
    price: 450,
    description:
      "Professional lace front or closure wig installation with seamless blending and natural hairline finish.",
  },
  {
    id: 2,
    name: "Spanish Curls",
    duration: 120,
    price: 650,
    description:
      "Soft, bouncy Spanish curls installed or styled for a glamorous, long-lasting look.",
  },
  {
    id: 3,
    name: "Fish Tail Braids",
    duration: 150,
    price: 550,
    description:
      "Elegant fishtail braids — single, double or full head — neat, durable and stylish.",
  },
  {
    id: 4,
    name: "Deep Wave Styling",
    duration: 90,
    price: 500,
    description:
      "Deep wave unit installation or styling for rich texture and volume that lasts.",
  },
  {
    id: 5,
    name: "Bone Straight",
    duration: 120,
    price: 600,
    description:
      "Sleek bone-straight finish on natural hair or units using professional heat and care techniques.",
  },
  {
    id: 6,
    name: "Box Braids",
    duration: 180,
    price: 700,
    description:
      "Classic or knotless box braids in your preferred size and length. Protective and beautiful.",
  },
  {
    id: 7,
    name: "Cornrows & Feed-ins",
    duration: 120,
    price: 400,
    description:
      "Neat cornrows, stitch braids or feed-in styles tailored to your face shape.",
  },
  {
    id: 8,
    name: "Lace Front / Closure Install",
    duration: 75,
    price: 380,
    description:
      "Secure, natural-looking lace front or closure installation with proper melt and styling.",
  },
  {
    id: 9,
    name: "Hair Treatment Ritual",
    duration: 60,
    price: 350,
    description:
      "Deep conditioning, protein treatment or moisture ritual to restore health and shine.",
  },
  {
    id: 10,
    name: "Bridal / Special Occasion Hair",
    duration: 120,
    price: 850,
    description:
      "Custom updos, soft curls or glam styles for weddings, photoshoots and events.",
  },
];

export const stylists: Stylist[] = [
  {
    id: 1,
    name: "Chileshe Banda",
    specialty: "Wig Installation & Lace Fronts",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
    bio: "Specialises in seamless wig installs and natural hairline finishes.",
  },
  {
    id: 2,
    name: "Mutale Mwansa",
    specialty: "Braids & Protective Styles",
    image: "https://images.unsplash.com/photo-1595476108010-b4d1f785630b?w=400&q=80",
    bio: "Expert in fishtails, box braids, cornrows and all protective styles.",
  },
  {
    id: 3,
    name: "Natasha Phiri",
    specialty: "Curls, Waves & Straightening",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80",
    bio: "Creates stunning Spanish curls, deep waves and bone-straight looks.",
  },
  {
    id: 4,
    name: "Bupe Tembo",
    specialty: "Bridal & Event Styling",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
    bio: "Transforms clients for weddings and special occasions with precision and flair.",
  },
];
