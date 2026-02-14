// Price ranges by service and size tier (DMV area typical pricing)
// These are estimates only — adjust as market changes

export interface PriceTier {
  label: string
  labelEs: string
  description: string
  descriptionEs: string
  min: number
  max: number
}

export interface ServicePricing {
  id: string
  name: string
  nameEs: string
  icon: string
  tiers: PriceTier[]
}

export const SERVICE_PRICING: ServicePricing[] = [
  {
    id: 'kitchen',
    name: 'Kitchen Remodeling',
    nameEs: 'Remodelación de Cocina',
    icon: '🍳',
    tiers: [
      { label: 'Minor Update', labelEs: 'Actualización Menor', description: 'Paint, hardware swap, backsplash', descriptionEs: 'Pintura, cambio de tiradores, backsplash', min: 3000, max: 7000 },
      { label: 'Small', labelEs: 'Pequeña', description: 'Countertops + backsplash + paint', descriptionEs: 'Mesones + backsplash + pintura', min: 8000, max: 15000 },
      { label: 'Medium', labelEs: 'Mediana', description: 'Cabinets, countertops, flooring', descriptionEs: 'Gabinetes, mesones, pisos', min: 15000, max: 30000 },
      { label: 'Large', labelEs: 'Grande', description: 'Full gut renovation', descriptionEs: 'Renovación completa', min: 30000, max: 50000 },
      { label: 'Premium', labelEs: 'Premium', description: 'High-end finishes, layout changes, appliances', descriptionEs: 'Acabados de alta gama, cambios de distribución, electrodomésticos', min: 50000, max: 85000 },
    ],
  },
  {
    id: 'bathroom',
    name: 'Bathroom Renovation',
    nameEs: 'Remodelación de Baño',
    icon: '🚿',
    tiers: [
      { label: 'Refresh', labelEs: 'Actualización', description: 'Fixtures, paint, accessories', descriptionEs: 'Accesorios, pintura, griferías', min: 2000, max: 5000 },
      { label: 'Small', labelEs: 'Pequeño', description: 'Tile, vanity, fixtures', descriptionEs: 'Azulejos, lavamanos, griferías', min: 5000, max: 12000 },
      { label: 'Medium', labelEs: 'Mediano', description: 'Full remodel, shower/tub', descriptionEs: 'Remodelación completa, ducha/bañera', min: 12000, max: 25000 },
      { label: 'Large', labelEs: 'Grande', description: 'Luxury remodel, custom tile', descriptionEs: 'Remodelación de lujo, azulejo personalizado', min: 25000, max: 40000 },
      { label: 'Master Suite', labelEs: 'Suite Principal', description: 'Full master bath transformation', descriptionEs: 'Transformación completa del baño principal', min: 35000, max: 60000 },
    ],
  },
  {
    id: 'basement',
    name: 'Basement Finishing',
    nameEs: 'Terminación de Sótano',
    icon: '🏠',
    tiers: [
      { label: 'Basic', labelEs: 'Básico', description: 'Drywall, paint, basic flooring', descriptionEs: 'Drywall, pintura, piso básico', min: 10000, max: 20000 },
      { label: 'Standard', labelEs: 'Estándar', description: 'Full finish with bathroom', descriptionEs: 'Terminación completa con baño', min: 20000, max: 40000 },
      { label: 'Premium', labelEs: 'Premium', description: 'Custom design, wet bar, theater', descriptionEs: 'Diseño personalizado, barra, sala de cine', min: 40000, max: 70000 },
    ],
  },
  {
    id: 'painting',
    name: 'Painting',
    nameEs: 'Pintura',
    icon: '🎨',
    tiers: [
      { label: 'Single Room', labelEs: 'Habitación Individual', description: '1 room interior', descriptionEs: '1 habitación interior', min: 300, max: 800 },
      { label: 'Multiple Rooms', labelEs: 'Varias Habitaciones', description: '3-5 rooms interior', descriptionEs: '3-5 habitaciones interior', min: 1500, max: 4000 },
      { label: 'Whole Interior', labelEs: 'Interior Completo', description: 'Full house interior', descriptionEs: 'Interior de casa completa', min: 4000, max: 10000 },
      { label: 'Exterior', labelEs: 'Exterior', description: 'Full exterior paint', descriptionEs: 'Pintura exterior completa', min: 3000, max: 12000 },
      { label: 'Commercial', labelEs: 'Comercial', description: 'Multi-story / large building', descriptionEs: 'Multi-piso / edificio grande', min: 8000, max: 30000 },
    ],
  },
  {
    id: 'roofing',
    name: 'Roofing',
    nameEs: 'Techos',
    icon: '🏗️',
    tiers: [
      { label: 'Repair', labelEs: 'Reparación', description: 'Patch, leak fix, minor repair', descriptionEs: 'Parche, reparación de filtración', min: 500, max: 2000 },
      { label: 'Partial', labelEs: 'Parcial', description: 'Section replacement', descriptionEs: 'Reemplazo de sección', min: 2000, max: 6000 },
      { label: 'Full Replacement', labelEs: 'Reemplazo Completo', description: 'Complete roof replacement', descriptionEs: 'Reemplazo completo de techo', min: 8000, max: 20000 },
      { label: 'Flat Roof', labelEs: 'Techo Plano', description: 'Flat rubber roof system', descriptionEs: 'Sistema de techo plano de caucho', min: 5000, max: 15000 },
    ],
  },
  {
    id: 'concrete',
    name: 'Concrete & Masonry',
    nameEs: 'Concreto y Albañilería',
    icon: '🧱',
    tiers: [
      { label: 'Small Repair', labelEs: 'Reparación Menor', description: 'Crack repair, patching', descriptionEs: 'Reparación de grietas', min: 500, max: 2000 },
      { label: 'Walkway/Patio', labelEs: 'Camino/Patio', description: 'New walkway or patio slab', descriptionEs: 'Nuevo camino o losa de patio', min: 2000, max: 6000 },
      { label: 'Driveway', labelEs: 'Entrada', description: 'Full driveway pour', descriptionEs: 'Entrada de concreto completa', min: 5000, max: 15000 },
      { label: 'Retaining Wall', labelEs: 'Muro de Contención', description: 'Structural retaining wall', descriptionEs: 'Muro de contención estructural', min: 3000, max: 12000 },
    ],
  },
  {
    id: 'deck',
    name: 'Decks & Patios',
    nameEs: 'Decks y Patios',
    icon: '🪵',
    tiers: [
      { label: 'Repair/Stain', labelEs: 'Reparación/Teñido', description: 'Deck repair and staining', descriptionEs: 'Reparación y teñido de deck', min: 800, max: 3000 },
      { label: 'Small Deck', labelEs: 'Deck Pequeño', description: 'Up to 200 sq ft', descriptionEs: 'Hasta 200 pies cuadrados', min: 5000, max: 12000 },
      { label: 'Large Deck', labelEs: 'Deck Grande', description: '200-500 sq ft, multi-level', descriptionEs: '200-500 pies cuadrados, multi-nivel', min: 12000, max: 30000 },
    ],
  },
  {
    id: 'power-washing',
    name: 'Power Washing',
    nameEs: 'Lavado a Presión',
    icon: '💧',
    tiers: [
      { label: 'Driveway', labelEs: 'Entrada', description: 'Driveway or walkway', descriptionEs: 'Entrada o camino', min: 150, max: 400 },
      { label: 'Deck/Patio', labelEs: 'Deck/Patio', description: 'Deck or patio area', descriptionEs: 'Área de deck o patio', min: 200, max: 500 },
      { label: 'Full Exterior', labelEs: 'Exterior Completo', description: 'House siding + driveway', descriptionEs: 'Revestimiento de casa + entrada', min: 400, max: 1200 },
    ],
  },
  {
    id: 'general',
    name: 'General Repairs & Handyman',
    nameEs: 'Reparaciones Generales',
    icon: '🔧',
    tiers: [
      { label: 'Quick Fix', labelEs: 'Reparación Rápida', description: '1-2 hour job', descriptionEs: 'Trabajo de 1-2 horas', min: 150, max: 400 },
      { label: 'Half Day', labelEs: 'Medio Día', description: 'Multiple small repairs', descriptionEs: 'Múltiples reparaciones pequeñas', min: 400, max: 1000 },
      { label: 'Full Day+', labelEs: 'Día Completo+', description: 'Larger repair projects', descriptionEs: 'Proyectos de reparación más grandes', min: 1000, max: 3000 },
    ],
  },
  {
    id: 'asphalt-sealing',
    name: 'Asphalt Sealing',
    nameEs: 'Sellado de Asfalto',
    icon: '🛣️',
    tiers: [
      { label: 'Small Driveway', labelEs: 'Entrada Pequeña', description: 'Up to 500 sq ft', descriptionEs: 'Hasta 500 pies cuadrados', min: 200, max: 500 },
      { label: 'Standard Driveway', labelEs: 'Entrada Estándar', description: '500-1000 sq ft', descriptionEs: '500-1000 pies cuadrados', min: 400, max: 900 },
      { label: 'Large / Parking', labelEs: 'Grande / Estacionamiento', description: '1000+ sq ft or commercial', descriptionEs: '1000+ pies cuadrados o comercial', min: 800, max: 2500 },
    ],
  },
  {
    id: 'flooring',
    name: 'Flooring Installation',
    nameEs: 'Instalación de Pisos',
    icon: '🪵',
    tiers: [
      { label: 'Single Room', labelEs: 'Una Habitación', description: 'LVP, laminate, or tile — up to 200 sq ft', descriptionEs: 'LVP, laminado o azulejo — hasta 200 pies cuadrados', min: 1500, max: 3500 },
      { label: 'Multiple Rooms', labelEs: 'Varias Habitaciones', description: '500-1000 sq ft, includes transitions', descriptionEs: '500-1000 pies cuadrados, incluye transiciones', min: 4000, max: 9000 },
      { label: 'Whole Home', labelEs: 'Casa Completa', description: '1000+ sq ft, hardwood or premium tile', descriptionEs: '1000+ pies cuadrados, madera o azulejo premium', min: 8000, max: 20000 },
      { label: 'Custom / Specialty', labelEs: 'Personalizado / Especial', description: 'Herringbone, patterned tile, heated floors', descriptionEs: 'Espiga, azulejo con patrón, pisos calefaccionados', min: 15000, max: 35000 },
    ],
  },
  {
    id: 'complete-renovation',
    name: 'Complete Home Renovation',
    nameEs: 'Renovación Completa del Hogar',
    icon: '🏠',
    tiers: [
      { label: 'Cosmetic Refresh', labelEs: 'Actualización Cosmética', description: 'Paint, flooring, fixtures throughout', descriptionEs: 'Pintura, pisos, accesorios en toda la casa', min: 15000, max: 40000 },
      { label: 'Mid-Range Remodel', labelEs: 'Remodelación Media', description: 'Kitchen + bath + flooring + paint', descriptionEs: 'Cocina + baño + pisos + pintura', min: 40000, max: 80000 },
      { label: 'Full Gut Renovation', labelEs: 'Renovación Total', description: 'Everything down to studs, layout changes', descriptionEs: 'Todo hasta los montantes, cambios de distribución', min: 80000, max: 200000 },
      { label: 'Luxury / Addition', labelEs: 'Lujo / Ampliación', description: 'High-end finishes, additions, structural', descriptionEs: 'Acabados de lujo, ampliaciones, estructural', min: 150000, max: 400000 },
    ],
  },
  {
    id: 'fencing',
    name: 'Fencing',
    nameEs: 'Cercas',
    icon: '🏗️',
    tiers: [
      { label: 'Repair / Patch', labelEs: 'Reparación', description: 'Fix damaged sections, replace boards', descriptionEs: 'Reparar secciones dañadas, reemplazar tablas', min: 300, max: 1500 },
      { label: 'Small Yard', labelEs: 'Patio Pequeño', description: 'Up to 100 linear feet, wood or vinyl', descriptionEs: 'Hasta 100 pies lineales, madera o vinilo', min: 2000, max: 5000 },
      { label: 'Standard Yard', labelEs: 'Patio Estándar', description: '100-200 linear feet, privacy fence', descriptionEs: '100-200 pies lineales, cerca de privacidad', min: 4000, max: 10000 },
      { label: 'Large / Custom', labelEs: 'Grande / Personalizado', description: '200+ linear feet, decorative or commercial', descriptionEs: '200+ pies lineales, decorativa o comercial', min: 8000, max: 20000 },
    ],
  },
]

// ============================================
// Emergency On-Call Rates
// ============================================
// Toggle visibility via admin - this gives Carlos extra revenue for after-hours work
export const EMERGENCY_RATES = {
  enabled: true, // Toggle to show/hide on site
  calloutFee: { min: 150, max: 250, description: 'Emergency dispatch fee (applied to first hour)' },
  hourlyRate: { min: 125, max: 200, description: 'Per hour after first hour' },
  categories: [
    { name: 'Burst Pipes / Water Damage', nameEs: 'Tuberías Rotas / Daño por Agua', rate: '$150-250/hr', icon: '💧' },
    { name: 'Roof Leak / Storm Damage', nameEs: 'Goteras / Daño por Tormenta', rate: '$150-250/hr', icon: '🌧️' },
    { name: 'Electrical Emergency', nameEs: 'Emergencia Eléctrica', rate: '$175-275/hr', icon: '⚡' },
    { name: 'Broken Window / Door', nameEs: 'Ventana / Puerta Rota', rate: '$125-200/hr', icon: '🪟' },
    { name: 'Collapsed Ceiling / Structural', nameEs: 'Techo Colapsado / Estructural', rate: '$200-300/hr', icon: '🏚️' },
    { name: 'Flooding / Sump Pump Failure', nameEs: 'Inundación / Falla de Bomba', rate: '$150-250/hr', icon: '🌊' },
  ],
}
