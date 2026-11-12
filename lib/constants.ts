// ===== COMPANY INFO =====
export const COMPANY = {
  name: 'CR Home Pros',
  legalName: 'CR Home Pros LLC',
  tagline: 'Crafting Your Ideal Home Space',
  description: 'Guiding you from design to completion, we aim to exceed your expectations. Our twenty plus years of expertise ensure exceptional, tailored results.',
  founderQuote: `My team and I are dedicated to bringing your home's potential to life, one improvement at a time. With a passion for craftsmanship and a commitment to quality, we're not just renovating spaces—we're here to help you build the dream space you've always envisioned. Let's create something beautiful together.`,
  phone: '5712377164',
  phoneFormatted: '(571) 237-7164',
  whatsapp: 'https://wa.me/15712377164?text=Hi%20Carlos!%20I%27m%20interested%20in%20your%20home%20improvement%20services.',
  email: 'crhomepros@gmail.com',
  emailCarlos: 'crhomepros@gmail.com',
  address: {
    street: '6509 Perry Ct',
    city: 'Hyattsville',
    state: 'MD',
    zip: '20784',
    full: '6509 Perry Ct, Hyattsville, MD 20784',
  },
  license: 'MHIC #05-132359',
  license2: 'MHIC #109350',
  established: 2004,
  yearsInBusiness: 20,
  teamSize: 6,
  projectsCompleted: '500+',
  hours: {
    weekdays: '9:00 AM - 5:00 PM',
    saturday: 'Closed',
    sunday: 'Closed',
    display: 'Mon–Fri: 9AM–5PM',
  },
} as const

// ===== FOUNDER INFO =====
export const FOUNDER = {
  name: 'Carlos Hernandez',
  title: 'Founder',
  bio: `With over two decades of hands-on experience in home improvement, Carlos Hernandez has built CR Home Pros on a foundation of trust, quality, and personalized attention. What started as a passion for craftsmanship has grown into a full-service renovation company that treats every home like it's their own.

Carlos and his skilled team specialize in transforming spaces—from complete kitchen renovations to emergency repairs. They've earned a reputation throughout the DMV area for showing up on time, communicating clearly, and delivering results that exceed expectations.

Whether it's a small repair or a major renovation, Carlos approaches every project with the same dedication: understanding your vision, solving problems proactively, and ensuring your complete satisfaction.`,
  shortBio: `My team and I are dedicated to bringing your home's potential to life, one improvement at a time. With a passion for craftsmanship and a commitment to quality, we're not just renovating spaces—we're here to help you build the dream space you've always envisioned.`,
} as const

// ===== HOURS =====
export const HOURS = {
  weekday: '8:00 AM - 7:00 PM',
  saturday: '8:00 AM - 7:00 PM',
  sunday: 'By Appointment',
  emergency: 'On Call 24/7 for Emergencies',
} as const

// ===== SERVICE AREAS =====
export const SERVICE_AREAS = [
  'Washington DC',
  'Maryland',
  'Virginia',
  'Bethesda',
  'Silver Spring',
  'Rockville',
  'Arlington',
  'Alexandria',
  'Hyattsville',
  'College Park',
  'Chevy Chase',
  'Potomac',
  'Georgetown',
] as const

// ===== SOCIAL MEDIA =====
// URLs are placeholder until Carlos creates each profile.
// Toggle SOCIAL_ACTIVE flags to show/hide in the UI.
export const SOCIAL = {
  facebook: 'https://facebook.com/crhomepros',
  instagram: 'https://www.instagram.com/crhomepros/',
  tiktok: 'https://www.tiktok.com/@crhomepro',
  google: 'https://g.page/crhomepros',
  yelp: 'https://biz.yelp.com/biz_info/-Py44m6S_fcOmE3RLTY31A',
  youtube: 'https://youtube.com/@crhomepros',
} as const

// Set to true once each profile actually exists
export const SOCIAL_ACTIVE: Record<keyof typeof SOCIAL, boolean> = {
  facebook: false,
  instagram: true,
  tiktok: true,
  google: true,
  yelp: true,
  youtube: false,
}

// ===== NAVIGATION =====
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Green', href: '/green', badge: '🌿' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Referrals', href: '/referrals', badge: '$$$' },
  { label: 'Contact', href: '/contact' },
] as const

// ===== SERVICES =====
export const SERVICES = [
  {
    id: 'kitchen-remodeling',
    name: 'Kitchen Remodeling',
    nameEs: 'Remodelación de Cocina',
    shortDescription: 'Transform your kitchen into the heart of your home.',
    shortDescriptionEs: 'Convierta su cocina en el corazón de su hogar.',
    icon: 'ChefHat',
    priceRange: '$15,000 - $75,000+',
    duration: '4-8 weeks',
    durationEs: '4-8 semanas',
  },
  {
    id: 'bathroom-renovation',
    name: 'Bathroom Renovation',
    nameEs: 'Renovación de Baño',
    shortDescription: 'Create spa-worthy retreats with premium materials.',
    shortDescriptionEs: 'Cree un refugio digno de un spa con materiales de primera.',
    icon: 'Bath',
    priceRange: '$10,000 - $50,000+',
    duration: '3-6 weeks',
    durationEs: '3-6 semanas',
  },
  {
    id: 'basement-finishing',
    name: 'Basement Finishing',
    nameEs: 'Acabado de Sótanos',
    shortDescription: 'Unlock your home\'s hidden potential below grade.',
    shortDescriptionEs: 'Aproveche el potencial oculto de su sótano.',
    icon: 'Home',
    priceRange: '$20,000 - $80,000+',
    duration: '6-12 weeks',
    durationEs: '6-12 semanas',
  },
  {
    id: 'roofing',
    name: 'Roofing',
    nameEs: 'Techos',
    shortDescription: 'Protect your home with quality roofing solutions.',
    shortDescriptionEs: 'Proteja su hogar con soluciones de techo de calidad.',
    icon: 'Warehouse',
    priceRange: '$8,000 - $25,000+',
    duration: '1-2 weeks',
    durationEs: '1-2 semanas',
  },
  {
    id: 'concrete-driveways',
    name: 'Concrete & Driveways',
    nameEs: 'Concreto y Entradas de Autos',
    shortDescription: 'Durable concrete work built to last decades.',
    shortDescriptionEs: 'Trabajos de concreto resistentes, hechos para durar décadas.',
    icon: 'Hammer',
    priceRange: '$5,000 - $20,000+',
    duration: '1-2 weeks',
    durationEs: '1-2 semanas',
  },
  {
    id: 'flooring',
    name: 'Flooring & Tiling',
    nameEs: 'Pisos y Azulejos',
    shortDescription: 'Beautiful floors that transform any space.',
    shortDescriptionEs: 'Pisos hermosos que transforman cualquier espacio.',
    icon: 'Grid3X3',
    priceRange: '$3,000 - $15,000+',
    duration: '1-3 weeks',
    durationEs: '1-3 semanas',
  },
  {
    id: 'painting',
    name: 'Interior & Exterior Painting',
    nameEs: 'Pintura Interior y Exterior',
    shortDescription: 'Professional painting with meticulous attention to detail.',
    shortDescriptionEs: 'Pintura profesional con atención minuciosa a cada detalle.',
    icon: 'Paintbrush',
    priceRange: '$2,000 - $15,000+',
    duration: '3-7 days',
    durationEs: '3-7 días',
  },
  {
    id: 'deck-outdoor',
    name: 'Decks & Outdoor Living',
    nameEs: 'Terrazas (Decks) y Espacios Exteriores',
    shortDescription: 'Extend your living space into the outdoors.',
    shortDescriptionEs: 'Extienda su espacio de vida al aire libre.',
    icon: 'TreeDeciduous',
    priceRange: '$10,000 - $40,000+',
    duration: '2-4 weeks',
    durationEs: '2-4 semanas',
  },
  {
    id: 'fencing',
    name: 'Fencing',
    nameEs: 'Cercas',
    shortDescription: 'Privacy fencing, vinyl, wood, and chain-link installation & repair.',
    shortDescriptionEs: 'Instalación y reparación de cercas de privacidad, vinilo, madera y malla ciclónica.',
    icon: 'Fence',
    priceRange: '$3,000 - $15,000+',
    duration: '1-3 days',
    durationEs: '1-3 días',
  },
  {
    id: 'complete-renovations',
    name: 'Complete Renovations',
    nameEs: 'Remodelaciones Completas',
    shortDescription: 'Full home transformations from start to finish.',
    shortDescriptionEs: 'Transformaciones completas de su hogar, de principio a fin.',
    icon: 'Building',
    priceRange: '$50,000 - $200,000+',
    duration: '3-6 months',
    durationEs: '3-6 meses',
  },
  {
    id: 'insurance-claims',
    name: 'Insurance Claims',
    nameEs: 'Reclamos de Seguro',
    shortDescription: 'We work directly with your insurance company.',
    shortDescriptionEs: 'Trabajamos directamente con su compañía de seguros.',
    icon: 'FileText',
    priceRange: 'Varies',
    priceRangeEs: 'Varía',
    duration: 'Varies',
    durationEs: 'Varía',
  },
] as const

// ===== STATS =====
export const STATS = [
  { value: '20+', label: 'Years Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '6', label: 'Skilled Craftsmen' },
  { value: '100%', label: 'Satisfaction Focus' },
] as const

// ===== PAYMENT METHODS =====
export const PAYMENT_METHODS = [
  { id: 'check', name: 'Check', nameEs: 'Cheque', icon: 'FileText', description: 'Personal or business checks accepted', descriptionEs: 'Se aceptan cheques personales o de empresa' },
  { id: 'credit-card', name: 'Credit & Debit Cards', nameEs: 'Tarjetas de Crédito y Débito', icon: 'CreditCard', description: 'Visa, Mastercard, American Express, Discover', descriptionEs: 'Visa, Mastercard, American Express, Discover' },
  { id: 'zelle', name: 'Zelle', nameEs: 'Zelle', icon: 'Smartphone', description: 'Instant bank-to-bank transfers', descriptionEs: 'Transferencias bancarias instantáneas' },
  { id: 'venmo', name: 'Venmo', nameEs: 'Venmo', icon: 'Smartphone', description: 'Quick mobile payments', descriptionEs: 'Pagos móviles rápidos' },
  { id: 'cash-app', name: 'Cash App', nameEs: 'Cash App', icon: 'DollarSign', description: 'Mobile payment transfers', descriptionEs: 'Transferencias de pago móvil' },
  { id: 'klarna', name: 'Klarna', nameEs: 'Klarna', icon: 'Clock', description: 'Buy now, pay later — split into 4 interest-free payments', descriptionEs: 'Compre ahora, pague después — divida en 4 pagos sin intereses' },
  { id: 'insurance', name: 'Insurance Claims', nameEs: 'Reclamos de Seguro', icon: 'Shield', description: 'We work directly with your insurance company to handle claims', descriptionEs: 'Trabajamos directamente con su compañía de seguros para manejar reclamos' },
  { id: 'financing', name: 'Financing Available', nameEs: 'Financiamiento Disponible', icon: 'Percent', description: 'Flexible payment plans for larger projects', descriptionEs: 'Planes de pago flexibles para proyectos más grandes' },
] as const

// ===== WHY CHOOSE US =====
export const WHY_CHOOSE_US = [
  {
    title: '20+ Years Experience',
    description: 'Two decades of trusted craftsmanship serving the DMV area.',
    icon: 'Award',
  },
  {
    title: 'Licensed & Insured',
    description: 'Fully licensed (MHIC #05-132359) and insured for your protection.',
    icon: 'Shield',
  },
  {
    title: 'Bilingual Team',
    description: 'Fluent in English and Spanish. ¡Hablamos Español!',
    icon: 'Languages',
  },
  {
    title: 'Quality Guaranteed',
    description: 'We stand behind our work with pride and accountability.',
    icon: 'CheckCircle',
  },
] as const

// ===== TESTIMONIALS (From his actual website) =====
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marneik',
    location: 'Silver Spring, MD',
    rating: 5,
    text: 'C & R General Services, Inc. (now CR Home Pros) has worked for me for several years. They provide a wide range of services such as painting, drywall, tile, roofing, gutter repairs, concrete work, animal removal and anything that I could not get a contractor to do. They always showed up when scheduled, explained hidden damages and were very professional. All work was done satisfactory and guaranteed. You definitely get what you pay for and it is worth it!!',
    service: 'Multiple Services',
    serviceEs: 'Varios Servicios',
  },
  {
    id: 2,
    name: 'Ketty',
    location: 'Woodbridge, VA',
    rating: 5,
    text: 'Carlos was the best technician you could have sent to inspect my furnace. I was pleased to see he came on time and was very helpful in answering all my questions. He was patient, friendly, and most importantly knowledgeable. He explained in detail what repair needed to be done and what would be involved. I am sold on C&R General Services (now CR Home Pros) and would not hesitate to recommend it to anyone!!!',
    service: 'HVAC Repair',
    serviceEs: 'Reparación de Calefacción y Aire (HVAC)',
  },
  {
    id: 3,
    name: 'Alice',
    location: 'Temple Hills, MD',
    rating: 5,
    text: 'We highly recommend that you contact C&R General Services (now CR Home Pros) if you are considering home improvements that is A+ in customer service, materials, workers, and follow through. We selected C&R General Services (now CR Home Pros) because Mr. Hernandez advised us that it would not be necessary to replace the entire deck. He replaced some boards, reinforced some boards, cleaned and stained the deck. It still looks beautiful and new after 3 years.',
    service: 'Deck Restoration',
    serviceEs: 'Restauración de Terraza (Deck)',
  },
  {
    id: 4,
    name: 'Reginald',
    location: 'Washington, DC',
    rating: 5,
    text: 'I manage a high end multi-unit property in Washington, DC. I came to know Carlos under the worse circumstances, whereas several unit sustained extensive water damage. After the remediation process was complete, Carlos came and completed the restoration process. The scope of work included restoring structural elements such as walls, flooring, and required the removal of large wall sections drywall and wood baseboards. I was really impressed with his work ethic and the speed in which they worked.',
    service: 'Water Damage Restoration',
    serviceEs: 'Restauración por Daños de Agua',
  },
  {
    id: 5,
    name: 'Anna R. Heyden',
    location: 'Rockville, MD',
    rating: 5,
    text: 'I would like to highly recommend Carlos Hernandez of C&R General Services (now CR Home Pros). He is honest, professional, intelligent, talented, and hard working. He can do anything you ask of him. He has completely renovated my basement, bathroom, and bedroom with amazing results. Carlos has gone above and beyond any expectations. No one should hesitate to call him.',
    service: 'Complete Renovation',
    serviceEs: 'Remodelación Completa',
  },
  {
    id: 6,
    name: 'Larry',
    location: 'Fort Washington, MD',
    rating: 5,
    text: 'I have used C&R General Services (now CR Home Pros) for more than ten years to do home improvement projects. A friend told her about a contractor that had completed work for her and she was very satisfied with the work he did. We had Mr. Carlos Hernandez remodel our two bathrooms and some minor electrical work and were very pleased with the finished product. After having worked with Mr. Hernandez and C&R General Services (now CR Home Pros) for over ten years, I highly recommend them to all my friends.',
    service: 'Long-term Client',
    serviceEs: 'Cliente de Muchos Años',
  },
  {
    id: 7,
    name: 'Todd',
    location: 'Capitol Hill, Washington DC',
    rating: 5,
    text: 'We manage several apartment buildings in the Capitol Hill neighborhood, and have had our fair share of emergency repairs that C&R General Services (now CR Home Pros) have tackled. Carlos and his crew have always been available to step in and take care of repairs after surprise leaks and even a collapsed ceiling! All work was done quickly, cleanly, and professionally. We\'re happy to have CR Home Pros on our list of preferred contractors.',
    service: 'Emergency Repairs',
    serviceEs: 'Reparaciones de Emergencia',
  },
  {
    id: 8,
    name: 'Jeffrey',
    location: 'Oxon Hill, MD',
    rating: 5,
    text: 'C&R General Services (now CR Home Pros) / Carlos completed a half bath in my home last year. They did excellent work, showed up on time, and cleaned up after themselves. I was so pleased with their work I recommended them to my mother-in-law.',
    service: 'Bathroom Remodel',
    serviceEs: 'Remodelación de Baño',
  },
  {
    id: 9,
    name: 'Ms. Chambers',
    location: 'Silver Spring, MD',
    rating: 5,
    text: 'C & R General Services, Inc. (now CR Home Pros) has worked for me for several years. They provide a wide range of services such as painting, drywall, tile, roofing, gutter repairs, concrete work, animal removal and anything that I could not get a contractor to do. They always showed up when scheduled, explained hidden damages and were very professional. All work was done satisfactory and guaranteed. You definitely get what you pay for and it is worth it!!',
    service: 'Multiple Services',
    serviceEs: 'Varios Servicios',
  },
] as const

// ===== BUDGET RANGES =====
export const BUDGET_RANGES = [
  'Under $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
  'Not sure yet',
] as const

// ===== TIMELINE OPTIONS =====
export const TIMELINE_OPTIONS = [
  'ASAP - Emergency',
  'Within 1-3 months',
  '3-6 months',
  '6+ months',
  'Just exploring options',
] as const

// ===== HOW DID YOU HEAR =====
export const REFERRAL_SOURCES = [
  'Google Search',
  'Friend/Family Referral',
  'Saw Our Truck',
  'Social Media',
  'Yelp',
  'Home Advisor',
  'Drove By a Job Site',
  'Repeat Client',
  'Other',
] as const

// ===== META =====
// Referral Program
export const REFERRAL_TIERS = [
  { minProject: 0, maxProject: 5000, reward: 100, label: 'Small Projects' },
  { minProject: 5000, maxProject: 15000, reward: 250, label: 'Medium Projects' },
  { minProject: 15000, maxProject: 50000, reward: 500, label: 'Large Projects' },
  { minProject: 50000, maxProject: Infinity, reward: 750, label: 'Major Projects' },
]

export const META = {
  title: 'CR Home Pros | Kitchen & Bath Remodeling | DC, MD, VA',
  description: 'Your Home. Our Expertise. 20+ years of trusted craftsmanship serving Washington DC, Maryland & Virginia. Kitchen remodeling, bathroom renovation, basement finishing, roofing & more. Licensed (MHIC #05-132359) & insured. Free estimates! Call (571) 237-7164.',
  keywords: [
    // Primary services
    'kitchen remodeling',
    'bathroom renovation', 
    'basement finishing',
    'home remodeling contractor',
    'general contractor',
    // Location-based
    'contractor Bethesda MD',
    'kitchen remodel Silver Spring',
    'bathroom renovation Rockville',
    'home improvement DC',
    'contractor Arlington VA',
    'remodeling contractor Hyattsville',
    'home renovation Maryland',
    'contractor DMV area',
    'Washington DC contractor',
    'Montgomery County contractor',
    'Prince Georges County contractor',
    // Service-specific
    'roofing contractor',
    'flooring installation',
    'deck building',
    'painting contractor',
    'tile installation',
    'concrete work',
    // Spanish keywords
    'contratista en español',
    'remodelación de cocina',
    'renovación de baño',
  ].join(', '),
  url: 'https://crhomepros.com',
  image: '/images/og-image.jpg',
} as const

// ===== FAQ (From old site) =====
export const FAQ = [
  {
    question: 'What kind of home improvement services do you offer?',
    answer: 'We specialize in a wide range of services including kitchen and bathroom remodels, flooring installations, painting, roofing, concrete work, deck building, and much more. We also handle insurance claims. If you have a specific project in mind, feel free to reach out to us for more detailed information.',
  },
  {
    question: 'Are you licensed and insured?',
    answer: 'Yes, we are fully licensed (MHIC #05-132359) and insured. We adhere to all industry standards and regulations to ensure the highest quality of work and peace of mind for our clients.',
  },
  {
    question: 'Do you help with design and material selection?',
    answer: 'Absolutely! Our team can assist you in selecting the right materials and designs that suit your taste and functionality needs. We\'re here to guide you through every step of the decision-making process.',
  },
  {
    question: 'How do I get a quote for my project?',
    answer: 'Simply use our "Get Started" form or give us a call at (571) 237-7164. We\'ll discuss your project needs, preferences, and schedule a site visit if necessary, to provide you with an accurate and transparent quote.',
  },
  {
    question: 'How long does a typical project take to complete?',
    answer: 'The duration depends on the project\'s complexity and scope. We strive to complete all projects in a timely manner without compromising on quality. After our initial consultation, we\'ll give you an estimated timeline for your specific project.',
  },
  {
    question: 'What measures do you take to ensure the project area is safe and clean?',
    answer: 'Your safety and comfort are our top priorities. We take extensive measures to keep the work area safe and clean, including regular cleanups, dust barriers, and following all safety protocols.',
  },
  {
    question: 'Do you work with insurance claims?',
    answer: 'Yes! We have extensive experience working with insurance companies on damage claims. We can help document the damage, provide detailed estimates, and work directly with your insurance adjuster to streamline the process.',
  },
  {
    question: 'Do you offer emergency repair services?',
    answer: 'Yes, we\'re on call for emergencies. Whether it\'s a collapsed ceiling, water damage, or urgent repairs, we can respond quickly to help minimize damage and get your home back to normal.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit and debit cards (Visa, Mastercard, Amex, Discover), Zelle, Venmo, Cash App, personal or business checks, and Klarna (buy now, pay later — split into 4 interest-free payments). We also work directly with insurance companies on covered claims.',
  },
  {
    question: 'Do you offer financing for larger projects?',
    answer: 'Yes! For larger projects like kitchen renovations, basement finishing, or whole-home remodels, we offer flexible financing options including Klarna. This lets you break payments into manageable installments while we get started on your project right away.',
  },
  {
    question: 'What areas do you serve?',
    answer: 'We serve the entire DMV (DC, Maryland, Virginia) area including Washington DC, Hyattsville, Silver Spring, Bethesda, Rockville, College Park, Bowie, Laurel, Columbia, Arlington, Alexandria, Falls Church, Fairfax, and surrounding communities. If you\'re unsure whether we cover your area, just give us a call.',
  },
  {
    question: 'Do you speak Spanish? / ¿Hablan español?',
    answer: '¡Sí! Our entire team is bilingual in English and Spanish. We want every homeowner to feel comfortable communicating about their project in the language they prefer. Our website is also available in Spanish.',
  },
  {
    question: 'Do you offer eco-friendly or green renovation options?',
    answer: 'Yes. We use low-VOC and zero-VOC paints, LED lighting, and Energy Star appliances as standard practice. We also offer sustainable materials like bamboo flooring, reclaimed wood, and recycled countertops. We recycle construction waste and donate usable materials to organizations like Habitat for Humanity ReStore.',
  },
  {
    question: 'How does your referral program work?',
    answer: 'When you refer a friend, family member, or neighbor who books a project with us, you earn a referral reward. Just fill out our referral form with their contact info, and once their project is completed, we\'ll send you your reward via your preferred payment method (check, Zelle, Venmo, or credit).',
  },
  {
    question: 'Can I see examples of your past work?',
    answer: 'Absolutely! Visit our Projects page to browse our gallery of completed projects with before-and-after photos. You can also check out our Instagram (@crhomepros) and TikTok (@crhomepro) for recent project videos and updates.',
  },
] as const

// ===== ALL SERVICES LIST (From old site - 27 services) =====
export const ALL_SERVICES_LIST = [
  'ADA Compliant and Special Needs Remodeling',
  'Basement Remodeling and Renovations',
  'Asphalt Sealing',
  'Bathroom Remodeling and Renovations',
  'Carpentry',
  'Ceilings/Collapsed Ceilings',
  'Complete Remodeling and Renovations',
  'Concrete Work and Repair',
  'Concrete-Driveway and Curb',
  'Deck (Custom Design and Repairs)',
  'Drywall',
  'Electricity',
  'Flooring and Tiling',
  'Framing',
  'Gutter Cleaning and Repairs',
  'Insulation',
  'Insurance Claims',
  'Kitchen Remodeling and Renovations',
  'Painting',
  'Power Washing',
  'Retaining Walls',
  'Roofing',
  'Staining',
  'Waterproofing',
] as const

// ===== POPULAR SERVICES (for footer) =====
export const POPULAR_SERVICES = [
  'Insurance Claims',
  'Kitchen Remodeling',
  'Bathroom Remodeling',
  'Concrete Jobs',
  'Painting',
  'Roofing',
  'Flooring',
] as const
