-- Optional: seed default catalog (run in Supabase SQL Editor)
-- Safe to re-run: uses upsert on primary key

-- Note: Adjust if you already have rows. This seeds the built-in defaults.

INSERT INTO services (id, name, duration, price, description) VALUES
(1, 'Wig Installation', 90, 450, 'Professional lace front or closure wig installation with seamless blending and natural hairline finish.'),
(2, 'Lace Front / Closure Install', 75, 380, 'Secure, natural-looking lace front or closure installation with proper melt and styling.'),
(3, 'Frontal Install', 90, 500, 'Full frontal lace installation with baby hairs and natural hairline customization.'),
(4, 'Glue-less Wig Install', 60, 350, 'Comfortable glue-less wig fitting and styling for everyday wear.'),
(5, 'Spanish Curls', 120, 650, 'Soft, bouncy Spanish curls installed or styled for a glamorous, long-lasting look.'),
(6, 'Deep Wave Styling', 90, 500, 'Deep wave unit installation or styling for rich texture and volume that lasts.'),
(7, 'Water Wave / Wet Look', 90, 480, 'Defined water waves or wet-look curls for a fresh, glamorous finish.'),
(8, 'Body Wave Styling', 90, 450, 'Soft body wave styling on natural hair or units for effortless volume.'),
(9, 'Bone Straight', 120, 600, 'Sleek bone-straight finish on natural hair or units using professional heat and care techniques.'),
(10, 'Silk Press', 90, 400, 'Smooth silk press for natural hair — shiny, straight and healthy-looking.'),
(11, 'Box Braids', 180, 700, 'Classic or knotless box braids in your preferred size and length. Protective and beautiful.'),
(12, 'Knotless Braids', 210, 850, 'Lightweight knotless box braids — gentler on edges, natural scalp look.'),
(13, 'Fish Tail Braids', 150, 550, 'Elegant fishtail braids — single, double or full head — neat, durable and stylish.'),
(14, 'Cornrows & Feed-ins', 120, 400, 'Neat cornrows, stitch braids or feed-in styles tailored to your face shape.'),
(15, 'Ghana Braids / Cornrow Ponytail', 150, 500, 'Classic Ghana braids or cornrow-to-ponytail styles, clean and long-lasting.'),
(16, 'Fulani / Tribal Braids', 180, 650, 'Decorative Fulani or tribal braid patterns with beads optional.'),
(17, 'Passion Twists', 180, 700, 'Soft passion twists — low maintenance protective style with beautiful bounce.'),
(18, 'Spring Twists', 180, 680, 'Bouncy spring twists for a playful, textured look.'),
(19, 'Senegalese Twists', 210, 750, 'Classic Senegalese / rope twists in medium or small size.'),
(20, 'Marley Twists', 180, 650, 'Natural-looking Marley twists for protective everyday wear.'),
(21, 'Faux Locs', 240, 900, 'Soft or goddess faux locs — stylish protective style for weeks of wear.'),
(22, 'Butterfly Locs', 240, 950, 'Trendy butterfly locs with textured ends for volume and movement.'),
(23, 'Soft Locs', 210, 850, 'Lightweight soft locs with a natural, flexible finish.'),
(24, 'Boho Braids / Goddess Braids', 210, 900, 'Boho or goddess braids with curly ends for a soft, romantic look.'),
(25, 'Lemonade Braids', 180, 600, 'Side-swept lemonade-style braids, neat and photogenic.'),
(26, 'Micro Braids', 300, 1200, 'Fine micro braids for a long-lasting, versatile protective style.'),
(27, 'Sew-in Weave', 150, 550, 'Full or partial sew-in weave with tracks, blended and styled.'),
(28, 'Quick Weave', 90, 400, 'Fast quick-weave install for a full look without a long appointment.'),
(29, 'Bonding', 90, 380, 'Hair bonding service for weave or extension attachment.'),
(30, 'Wash & Blowout', 60, 250, 'Thorough wash, condition and professional blow-dry.'),
(31, 'Hair Treatment Ritual', 60, 350, 'Deep conditioning, protein treatment or moisture ritual to restore health and shine.'),
(32, 'Hot Oil Treatment', 45, 280, 'Nourishing hot oil treatment for dry or damaged hair.'),
(33, 'Relaxer / Texturizer', 120, 450, 'Professional relaxer or texturizer application with neutralizing and care.'),
(34, 'Retwist (Dreadlocks)', 120, 400, 'Loc retwist and maintenance for clean, neat dreadlocks.'),
(35, 'Starter Locs', 150, 500, 'Professional starter locs — comb coils or two-strand beginnings.'),
(36, 'Twist Out / Wash & Go', 75, 300, 'Defined twist-out or wash-and-go styling for natural hair.'),
(37, 'Cornrow / Braid Takedown', 60, 200, 'Gentle takedown of braids or cornrows with detangle and basic care.'),
(38, 'Hair Colouring', 120, 550, 'Professional colour application — full head, highlights or fashion colours.'),
(39, 'Ombre / Balayage', 150, 700, 'Soft ombre or balayage colour for a modern, blended look.'),
(40, 'Haircut & Trim', 45, 200, 'Shape, trim or dusting for healthy ends and style maintenance.'),
(41, 'Bridal / Special Occasion Hair', 120, 850, 'Custom updos, soft curls or glam styles for weddings, photoshoots and events.'),
(42, 'Makeup — Everyday / Date Night', 60, 350, 'Fresh, polished makeup for date nights, dinners and everyday glam.'),
(43, 'Makeup — Graduation / Event', 75, 450, 'Camera-ready makeup for graduations, parties and formal events.'),
(44, 'Makeup — Bridal / Wedding', 90, 800, 'Full bridal makeup application for the bride or wedding party — long-wear and photo-friendly.'),
(45, 'Makeup — Photoshoot / Glam', 75, 500, 'Full glam makeup for photoshoots, birthdays and red-carpet moments.'),
(46, 'Hair & Makeup Combo', 150, 1100, 'Combined hair styling and makeup for weddings, graduations and special occasions.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  duration = EXCLUDED.duration,
  price = EXCLUDED.price,
  description = EXCLUDED.description;

-- Reset identity sequence
SELECT setval(pg_get_serial_sequence('services','id'), (SELECT COALESCE(MAX(id), 1) FROM services));
