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

  {
    id: 9,
    name: "Tailored Two-Piece Suit",
    price: 1850,
    category: "suits",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
    description: "Sharp tailored suit for formal events, interviews and celebrations. Available in classic cuts.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Charcoal"],
  },
  {
    id: 10,
    name: "Signature Eau de Parfum",
    price: 450,
    category: "perfumes",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80"],
    description: "Long-lasting unisex fragrance with warm floral notes — perfect for day and evening.",
    sizes: ["50ml", "100ml"],
    colors: ["Default"],
  },
  {
    id: 11,
    name: "Luxury Bedding Set",
    price: 980,
    category: "beddings",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"],
    description: "Soft premium bedding set — duvet cover, fitted sheet and pillowcases. Hotel-quality comfort.",
    sizes: ["Double", "Queen", "King"],
    colors: ["Ivory", "Grey", "Blush"],
  },
];

export const services: Service[] = [
  // Wig & unit installs
  { id: 1, name: "Wig Installation", duration: 90, price: 450, description: "Professional lace front or closure wig installation with seamless blending and natural hairline finish." },
  { id: 2, name: "Lace Front / Closure Install", duration: 75, price: 380, description: "Secure, natural-looking lace front or closure installation with proper melt and styling." },
  { id: 3, name: "Frontal Install", duration: 90, price: 500, description: "Full frontal lace installation with baby hairs and natural hairline customization." },
  { id: 4, name: "Glue-less Wig Install", duration: 60, price: 350, description: "Comfortable glue-less wig fitting and styling for everyday wear." },
  // Curls & waves
  { id: 5, name: "Spanish Curls", duration: 120, price: 650, description: "Soft, bouncy Spanish curls installed or styled for a glamorous, long-lasting look." },
  { id: 6, name: "Deep Wave Styling", duration: 90, price: 500, description: "Deep wave unit installation or styling for rich texture and volume that lasts." },
  { id: 7, name: "Water Wave / Wet Look", duration: 90, price: 480, description: "Defined water waves or wet-look curls for a fresh, glamorous finish." },
  { id: 8, name: "Body Wave Styling", duration: 90, price: 450, description: "Soft body wave styling on natural hair or units for effortless volume." },
  { id: 9, name: "Bone Straight", duration: 120, price: 600, description: "Sleek bone-straight finish on natural hair or units using professional heat and care techniques." },
  { id: 10, name: "Silk Press", duration: 90, price: 400, description: "Smooth silk press for natural hair — shiny, straight and healthy-looking." },
  // Braids (popular in Zambia)
  { id: 11, name: "Box Braids", duration: 180, price: 700, description: "Classic or knotless box braids in your preferred size and length. Protective and beautiful." },
  { id: 12, name: "Knotless Braids", duration: 210, price: 850, description: "Lightweight knotless box braids — gentler on edges, natural scalp look." },
  { id: 13, name: "Fish Tail Braids", duration: 150, price: 550, description: "Elegant fishtail braids — single, double or full head — neat, durable and stylish." },
  { id: 14, name: "Cornrows & Feed-ins", duration: 120, price: 400, description: "Neat cornrows, stitch braids or feed-in styles tailored to your face shape." },
  { id: 15, name: "Ghana Braids / Cornrow Ponytail", duration: 150, price: 500, description: "Classic Ghana braids or cornrow-to-ponytail styles, clean and long-lasting." },
  { id: 16, name: "Fulani / Tribal Braids", duration: 180, price: 650, description: "Decorative Fulani or tribal braid patterns with beads optional." },
  { id: 17, name: "Passion Twists", duration: 180, price: 700, description: "Soft passion twists — low maintenance protective style with beautiful bounce." },
  { id: 18, name: "Spring Twists", duration: 180, price: 680, description: "Bouncy spring twists for a playful, textured look." },
  { id: 19, name: "Senegalese Twists", duration: 210, price: 750, description: "Classic Senegalese / rope twists in medium or small size." },
  { id: 20, name: "Marley Twists", duration: 180, price: 650, description: "Natural-looking Marley twists for protective everyday wear." },
  { id: 21, name: "Faux Locs", duration: 240, price: 900, description: "Soft or goddess faux locs — stylish protective style for weeks of wear." },
  { id: 22, name: "Butterfly Locs", duration: 240, price: 950, description: "Trendy butterfly locs with textured ends for volume and movement." },
  { id: 23, name: "Soft Locs", duration: 210, price: 850, description: "Lightweight soft locs with a natural, flexible finish." },
  { id: 24, name: "Boho Braids / Goddess Braids", duration: 210, price: 900, description: "Boho or goddess braids with curly ends for a soft, romantic look." },
  { id: 25, name: "Lemonade Braids", duration: 180, price: 600, description: "Side-swept lemonade-style braids, neat and photogenic." },
  { id: 26, name: "Micro Braids", duration: 300, price: 1200, description: "Fine micro braids for a long-lasting, versatile protective style." },
  // Weaves & sew-in
  { id: 27, name: "Sew-in Weave", duration: 150, price: 550, description: "Full or partial sew-in weave with tracks, blended and styled." },
  { id: 28, name: "Quick Weave", duration: 90, price: 400, description: "Fast quick-weave install for a full look without a long appointment." },
  { id: 29, name: "Bonding", duration: 90, price: 380, description: "Hair bonding service for weave or extension attachment." },
  // Natural hair & treatments
  { id: 30, name: "Wash & Blowout", duration: 60, price: 250, description: "Thorough wash, condition and professional blow-dry." },
  { id: 31, name: "Hair Treatment Ritual", duration: 60, price: 350, description: "Deep conditioning, protein treatment or moisture ritual to restore health and shine." },
  { id: 32, name: "Hot Oil Treatment", duration: 45, price: 280, description: "Nourishing hot oil treatment for dry or damaged hair." },
  { id: 33, name: "Relaxer / Texturizer", duration: 120, price: 450, description: "Professional relaxer or texturizer application with neutralizing and care." },
  { id: 34, name: "Retwist (Dreadlocks)", duration: 120, price: 400, description: "Loc retwist and maintenance for clean, neat dreadlocks." },
  { id: 35, name: "Starter Locs", duration: 150, price: 500, description: "Professional starter locs — comb coils or two-strand beginnings." },
  { id: 36, name: "Twist Out / Wash & Go", duration: 75, price: 300, description: "Defined twist-out or wash-and-go styling for natural hair." },
  { id: 37, name: "Cornrow / Braid Takedown", duration: 60, price: 200, description: "Gentle takedown of braids or cornrows with detangle and basic care." },
  // Colour & finishes
  { id: 38, name: "Hair Colouring", duration: 120, price: 550, description: "Professional colour application — full head, highlights or fashion colours." },
  { id: 39, name: "Ombre / Balayage", duration: 150, price: 700, description: "Soft ombre or balayage colour for a modern, blended look." },
  { id: 40, name: "Haircut & Trim", duration: 45, price: 200, description: "Shape, trim or dusting for healthy ends and style maintenance." },
  // Special occasion + makeup
  { id: 41, name: "Bridal / Special Occasion Hair", duration: 120, price: 850, description: "Custom updos, soft curls or glam styles for weddings, photoshoots and events." },
  { id: 42, name: "Makeup — Everyday / Date Night", duration: 60, price: 350, description: "Fresh, polished makeup for date nights, dinners and everyday glam." },
  { id: 43, name: "Makeup — Graduation / Event", duration: 75, price: 450, description: "Camera-ready makeup for graduations, parties and formal events." },
  { id: 44, name: "Makeup — Bridal / Wedding", duration: 90, price: 800, description: "Full bridal makeup application for the bride or wedding party — long-wear and photo-friendly." },
  { id: 45, name: "Makeup — Photoshoot / Glam", duration: 75, price: 500, description: "Full glam makeup for photoshoots, birthdays and red-carpet moments." },
  { id: 46, name: "Hair & Makeup Combo", duration: 150, price: 1100, description: "Combined hair styling and makeup for weddings, graduations and special occasions." },
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
