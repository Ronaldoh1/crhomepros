// All project images organized by category
// Images stored locally in /public/images/

const BASE_01 = '/images/2024-01'
const BASE_06 = '/images/2024-06'
const BASE_2025_05 = '/images/2025-05'
const BASE_FENCE_BOWIE = '/images/2025-fence-bowie'
const BASE_BASEMENT_GREENBELT = '/images/2025-basement-greenbelt'

export interface GalleryProject {
  id: string
  title: string
  titleEs?: string
  category: string
  description?: string
  descriptionEs?: string
  images: string[]
  beforeImages?: string[]
  featured?: boolean
  completedDate?: string
}

export const GALLERY_PROJECTS: GalleryProject[] = [
  // ===== KITCHEN PROJECTS =====
  {
    id: 'kitchen-full-renovation',
    title: 'Full Kitchen Renovation',
    titleEs: 'Renovación Completa de Cocina',
    descriptionEs: 'Transformación completa de cocina en Silver Spring — Gabinetes nuevos a medida, mesones de cuarzo, electrodomésticos de acero inoxidable e iluminación moderna.',
    category: 'Kitchen',
    description: 'Complete kitchen transformation in Silver Spring — New custom cabinets, quartz countertops, stainless steel appliances, and modern lighting.',
    featured: true,
    images: [
      `${BASE_01}/img_3700-1024x746.JPEG`,
      `${BASE_01}/img_3701-1-1024x748.JPEG`,
      `${BASE_01}/img_3702-780x1024.JPEG`,
    ],
  },
  {
    id: 'kitchen-renovation-2',
    title: 'Kitchen Renovation',
    titleEs: 'Renovación de Cocina',
    descriptionEs: 'Actualización moderna de cocina en Hyattsville — Gabinetes renovados, salpicadero nuevo y mejor funcionalidad.',
    category: 'Kitchen',
    description: 'Modern kitchen update in Hyattsville — Updated cabinets, new backsplash, and improved functionality.',
    images: [
      `${BASE_01}/img_1607-1024x614.JPEG`,
      `${BASE_01}/img_1608-1024x614.JPEG`,
      `${BASE_01}/img_1609-1024x614.JPEG`,
      `${BASE_01}/img_1611-1024x614.JPEG`,
    ],
  },
  {
    id: 'kitchen-tiling',
    description: 'Custom tile work and flooring installation — Gorgeous backsplash and durable, stylish flooring.',
    title: 'Kitchen Tiling Renovation',
    titleEs: 'Renovación de Azulejos de Cocina',
    descriptionEs: 'Trabajo de azulejo a medida e instalación de pisos — Un salpicadero precioso y pisos duraderos y con estilo.',
    category: 'Kitchen',
    images: [
      `${BASE_01}/img_2016-768x1024.JPEG`,
      `${BASE_01}/img_2017-768x1024.JPEG`,
      `${BASE_01}/img_2018-768x1024.JPEG`,
      `${BASE_01}/img_2020-768x1024.JPEG`,
      `${BASE_01}/img_2021-768x1024.JPEG`,
      `${BASE_01}/img_2022-768x1024.JPEG`,
      `${BASE_01}/img_2023-1024x768.JPEG`,
    ],
  },
  {
    id: 'kitchen-pg-county',
    title: 'Kitchen Remodel — Prince George\'s County',
    titleEs: 'Remodelación de Cocina — Condado de Prince George\'s',
    descriptionEs: 'Renovación completa de cocina en el Condado de PG, MD — Gabinetes estilo shaker color espresso oscuro con herrajes de níquel cepillado, mesones de cuarzo calacatta, salpicadero de azulejo tipo subway, piso de porcelanato imitación madera y electrodomésticos de acero inoxidable. Parte de una remodelación de toda la casa que incluyó el reemplazo del techo, todo gestionado a través del seguro.',
    category: 'Kitchen',
    description: 'Full kitchen renovation in PG County, MD — Dark espresso shaker cabinets with brushed nickel hardware, calacatta quartz countertops, subway tile backsplash, wood-look porcelain tile flooring, and stainless steel appliances. Part of a whole-home remodel including roof replacement, all handled through insurance.',
    featured: true,
    images: [
      `${BASE_2025_05}/kitchen-pg-county-01.png`,
    ],
  },

  // ===== BATHROOM PROJECTS =====
  {
    id: 'bathroom-1',
    description: 'Spa-like bathroom renovation in College Park — Walk-in shower, new vanity, elegant tile work, and modern fixtures.',
    title: 'Modern Bathroom Remodel',
    titleEs: 'Remodelación Moderna de Baño',
    descriptionEs: 'Renovación de baño estilo spa en College Park — Ducha de acceso directo, mueble de lavamanos nuevo, elegante trabajo de azulejo y accesorios modernos.',
    category: 'Bathroom',
    featured: true,
    images: [
      `${BASE_06}/img_3497-1-768x1024.JPEG`,
      `${BASE_06}/img_3464-1-768x1024.JPEG`,
      `${BASE_06}/img_2733-1-1024x768.JPEG`,
      `${BASE_06}/img_2732-1-768x1024.JPEG`,
      `${BASE_06}/img_2728-1-1024x768.JPEG`,
      `${BASE_06}/img_2719-1-768x1024.JPEG`,
    ],
  },
  {
    id: 'bathroom-2',
    description: 'Full bathroom transformation — New tub/shower combo, custom vanity, premium tile work, and updated plumbing.',
    title: 'Complete Bathroom Renovation',
    titleEs: 'Renovación Completa de Baño',
    descriptionEs: 'Transformación completa de baño — Nueva combinación de tina y ducha, mueble de lavamanos a medida, trabajo de azulejo de primera calidad y plomería actualizada.',
    category: 'Bathroom',
    images: [
      `${BASE_01}/img_0416-768x1024.JPEG`,
      `${BASE_01}/img_0423-768x1024.JPEG`,
      `${BASE_01}/img_0491-768x1024.JPEG`,
      `${BASE_01}/img_0496-1024x768.JPEG`,
      `${BASE_01}/img_0497-768x1024.JPEG`,
      `${BASE_01}/img_0498-768x1024.JPEG`,
      `${BASE_01}/img_0500-768x1024.JPEG`,
      `${BASE_01}/img_0501-1024x768.JPEG`,
    ],
  },
  {
    id: 'bathroom-walk-in-shower',
    title: 'Walk-In Shower Remodel — Marble Tile',
    titleEs: 'Remodelación de Ducha de Acceso Directo — Azulejo de Mármol',
    descriptionEs: 'Construcción a medida de ducha de acceso directo con porcelanato imitación mármol calacatta, franja decorativa de vidrio gris, piso de ducha de mosaico de piedrecillas, repisa esquinera de mármol, ducha de mano cromada con barra deslizante, barra de apoyo para accesibilidad y trabajo de azulejo de precisión en todo el espacio. Un acabado limpio, moderno y con calidad de spa.',
    category: 'Bathroom',
    description: 'Custom walk-in shower build with calacatta marble-look porcelain tile, gray glass accent stripe, pebble mosaic shower floor, corner marble shelf, chrome handheld showerhead with slide bar, grab bar for accessibility, and precision tile work throughout. Clean, modern, spa-quality finish.',
    featured: true,
    images: [
      `${BASE_2025_05}/bathroom-tile-02.png`,
      `${BASE_2025_05}/bathroom-tile-03.png`,
      `${BASE_2025_05}/bathroom-tile-01.png`,
    ],
  },

  // ===== COMPLETE RENOVATION PROJECTS =====
  {
    id: 'renovation-1',
    description: 'Full home renovation in Takoma Park — Kitchen, bathrooms, flooring, paint, lighting, and structural improvements throughout.',
    title: 'Whole Home Transformation',
    titleEs: 'Transformación de Toda la Casa',
    descriptionEs: 'Renovación completa de casa en Takoma Park — Cocina, baños, pisos, pintura, iluminación y mejoras estructurales en toda la casa.',
    category: 'Complete Renovation',
    featured: true,
    images: [
      `${BASE_01}/img_1551-1024x768.JPEG`,
      `${BASE_01}/img_1550-1024x768.JPEG`,
      `${BASE_01}/img_1548-1024x768.JPEG`,
      `${BASE_01}/img_1548-2-1024x768.JPEG`,
      `${BASE_01}/img_1546-1024x768.JPEG`,
      `${BASE_01}/img_1545-768x1024.JPEG`,
      `${BASE_01}/img_1537-768x1024.JPEG`,
      `${BASE_01}/img_1532-768x1024.JPEG`,
      `${BASE_01}/img_1531-1024x768.JPEG`,
      `${BASE_01}/img_1530-1024x768.JPEG`,
      `${BASE_01}/img_1509-1024x768.JPEG`,
      `${BASE_01}/img_1508-768x1024.JPEG`,
      `${BASE_01}/img_1507-1024x768.JPEG`,
      `${BASE_01}/img_1506-768x1024.JPEG`,
      `${BASE_01}/img_1423-1024x768.JPEG`,
    ],
  },
  {
    id: 'renovation-2',
    description: 'Complete property makeover — Multiple rooms renovated, new finishes, updated systems, and modernized living spaces.',
    title: 'Full Property Renovation',
    titleEs: 'Renovación Completa de Propiedad',
    descriptionEs: 'Renovación total de la propiedad — Varias habitaciones renovadas, acabados nuevos, sistemas actualizados y espacios habitables modernizados.',
    category: 'Complete Renovation',
    images: [
      `${BASE_01}/img_0580-1024x768.JPEG`,
      `${BASE_01}/img_0591-1024x768.JPEG`,
      `${BASE_01}/img_0596-1024x768.JPEG`,
      `${BASE_01}/img_0597-1024x768.JPEG`,
      `${BASE_01}/img_0623-1024x768.JPEG`,
      `${BASE_01}/img_0624-1024x768.JPEG`,
      `${BASE_01}/img_0709-1024x768.JPEG`,
      `${BASE_01}/img_0710-1024x768.JPEG`,
      `${BASE_01}/img_0712-1024x768.JPEG`,
    ],
  },

  // ===== CONCRETE & DRIVEWAY PROJECTS =====
  {
    id: 'driveway-projects',
    description: 'Professional concrete driveway installation — Durable, properly graded, and finished to perfection.',
    title: 'Driveway Installation',
    titleEs: 'Instalación de Entrada de Auto',
    descriptionEs: 'Instalación profesional de entrada de auto de concreto — Duradera, con la nivelación adecuada y un acabado perfecto.',
    category: 'Concrete',
    featured: true,
    images: [
      `${BASE_06}/img_3167-1-765x1024.JPEG`,
      `${BASE_06}/img_3276-1-1024x765.JPEG`,
      `${BASE_01}/img_1338-768x1024.JPEG`,
      `${BASE_01}/img_1337-768x1024.JPEG`,
      `${BASE_01}/img_1335-768x1024.JPEG`,
    ],
  },
  {
    id: 'concrete-walls',
    description: 'Structural retaining wall construction — Engineered for stability and built to last.',
    title: 'Concrete Retaining Walls',
    titleEs: 'Muros de Contención de Concreto',
    descriptionEs: 'Construcción de muros de contención estructurales — Diseñados para la estabilidad y construidos para durar.',
    category: 'Concrete',
    images: [
      `${BASE_01}/img_0050-768x1024.JPEG`,
      `${BASE_01}/img_0046-768x1024.JPEG`,
      `${BASE_01}/img_0028-768x1024.JPEG`,
    ],
  },

  // ===== FLAT ROOFING PROJECTS =====
  {
    id: 'roof-replacement-clarksburg',
    title: 'Full Roof Replacement — Clarksburg, MD',
    titleEs: 'Reemplazo Completo de Techo — Clarksburg, MD',
    descriptionEs: 'Remoción completa y reemplazo de techo en una casa colonial de dos pisos en Clarksburg, MD — Se retiraron las tejas asfálticas viejas hasta dejar la base al descubierto, se inspeccionó y reparó el entablado, se instaló una membrana sintética con barrera contra hielo y agua en los valles y aleros, y se terminó con tejas asfálticas arquitectónicas de primera calidad y nuevas ventilas de cumbrera. Una instalación limpia y profesional terminada en marzo de 2022.',
    category: 'Roofing',
    description: 'Complete tear-off and roof replacement on a two-story colonial in Clarksburg, MD — Stripped old shingles down to bare decking, inspected and repaired sheathing, installed synthetic underlayment with ice & water shield at valleys and eaves, then finished with premium architectural shingles and new ridge vents. Clean, professional install completed March 2022.',
    featured: true,
    images: [
      `${BASE_2025_05}/roof-md-05-house.png`,
      `${BASE_2025_05}/roof-md-01-decking.png`,
      `${BASE_2025_05}/roof-md-02-underlayment.png`,
      `${BASE_2025_05}/roof-md-03-shingles.png`,
      `${BASE_2025_05}/roof-md-04-finished.png`,
    ],
  },
  {
    id: 'flat-roof-install',
    description: 'Professional flat roof replacement — rubber roofing for superior waterproofing and longevity.',
    title: 'Flat Roof Installation',
    titleEs: 'Instalación de Techo Plano',
    descriptionEs: 'Reemplazo profesional de techo plano — techado de caucho para una impermeabilización y durabilidad superiores.',
    category: 'Roofing',
    images: [
      `${BASE_01}/img_0806.JPEG`,
      `${BASE_01}/img_0867-576x1024.PNG`,
      `${BASE_01}/img_0815-576x1024.PNG`,
      `${BASE_01}/img_0862-1024x768.JPEG`,
    ],
  },
  {
    id: 'roof-replacement-pg-county',
    title: 'Full Shingle Roof Replacement — Insurance Claim',
    titleEs: 'Reemplazo Completo de Techo de Tejas Asfálticas — Reclamo de Seguro',
    descriptionEs: 'Remoción completa y reemplazo de techo en una casa unifamiliar de dos pisos en el Condado de Prince George\'s, MD. Se retiraron las tejas asfálticas viejas hasta la base, se inspeccionó y reemplazó la membrana, y se instalaron nuevas tejas asfálticas arquitectónicas con ventilas de cumbrera, tapajuntas y goteros. Gestionado como reclamo de seguro después de daños por tormenta.',
    category: 'Roofing',
    description: 'Complete roof tear-off and replacement on a two-story single-family home in Prince George\'s County, MD. Old shingles stripped to decking, underlayment inspected and replaced, new architectural shingles installed with ridge vents, flashing, and drip edge. Handled as an insurance claim after storm damage.',
    featured: true,
    images: [
      `${BASE_2025_05}/roofing-md-01.png`,
      `${BASE_2025_05}/roofing-md-02.png`,
    ],
  },
  {
    id: 'roof-replacement-clarksburg-colonial',
    title: 'Complete Roof Replacement',
    titleEs: 'Reemplazo Completo de Techo',
    descriptionEs: 'Remoción completa y reemplazo de techo de tejas asfálticas en Clarksburg, MD — Se retiraron las tejas viejas hasta dejar la base al descubierto, se inspeccionó y reparó el entablado, se instaló una membrana sintética con barrera contra hielo y agua en los valles y bordes, y luego se colocaron nuevas tejas asfálticas arquitectónicas con la ventilación de cumbrera adecuada. Una línea de techo limpia y terminada en una casa colonial de dos pisos. Terminado en marzo de 2022.',
    category: 'Roofing',
    description: 'Full shingle roof tear-off and replacement in Clarksburg, MD — Stripped old shingles down to bare deck, inspected and repaired sheathing, installed synthetic underlayment with ice and water shield at valleys and edges, then laid new architectural shingles with proper ridge ventilation. Clean finished roofline on a two-story colonial. Completed March 2022.',
    featured: true,
    images: [
      `${BASE_2025_05}/roof-md-05-house.png`,
      `${BASE_2025_05}/roof-md-01-tearoff.png`,
      `${BASE_2025_05}/roof-md-02-underlayment.png`,
      `${BASE_2025_05}/roof-md-03-shingles.png`,
      `${BASE_2025_05}/roof-md-04-finished.png`,
    ],
  },

  // ===== DECK PROJECTS =====
  {
    id: 'deck-1',
    description: 'Beautiful custom deck construction — Quality materials, expert craftsmanship, perfect for outdoor entertaining.',
    title: 'Custom Deck Build',
    titleEs: 'Construcción de Terraza a Medida',
    descriptionEs: 'Hermosa construcción de terraza a medida — Materiales de calidad, mano de obra experta, perfecta para recibir invitados al aire libre.',
    category: 'Deck',
    featured: true,
    images: [
      `${BASE_06}/img_2379-1024x768.JPEG`,
      `${BASE_06}/img_2380-768x1024.JPEG`,
      `${BASE_06}/img_2386-1024x768.JPEG`,
      `${BASE_06}/img_2387-768x1024.JPEG`,
    ],
  },
  {
    id: 'deck-2',
    description: 'Deck restoration and professional staining — Revitalized outdoor space with weather-resistant finish.',
    title: 'Deck Renovation & Staining',
    titleEs: 'Renovación y Tinte de Terraza',
    descriptionEs: 'Restauración de terraza y aplicación profesional de tinte — Espacio exterior revitalizado con un acabado resistente a la intemperie.',
    category: 'Deck',
    images: [
      `${BASE_01}/img_0941-768x1024.JPEG`,
      `${BASE_01}/img_0942-768x1024.JPEG`,
      `${BASE_01}/img_0947-768x1024.JPEG`,
      `${BASE_01}/img_0948-768x1024.JPEG`,
      `${BASE_01}/img_0949-768x1024.JPEG`,
      `${BASE_01}/img_0950-768x1024.JPEG`,
      `${BASE_01}/img_1095-768x1024.JPEG`,
    ],
  },
  {
    id: 'deck-composite-bowie',
    title: 'Composite Deck Build — Insurance Claim',
    titleEs: 'Construcción de Terraza de Material Compuesto — Reclamo de Seguro',
    descriptionEs: 'Reemplazo completo de terraza de material compuesto en Bowie, MD — Gestionado a través del reclamo al seguro del propietario. Se instalaron tablas de material compuesto gris de primera calidad con postes de vinilo blanco, balaustres de aluminio negro y escaleras construidas a medida. Fascia revestida con tapajuntas protector para una durabilidad a largo plazo. Cubierto por el seguro después de que una tormenta dañó la estructura original.',
    category: 'Deck',
    description: 'Full composite deck replacement in Bowie, MD — Handled through homeowner\'s insurance claim. Installed premium gray composite decking with white vinyl posts, black aluminum balusters, and custom-built stairs. Fascia wrapped in protective flashing for long-term durability. Covered under insurance after storm damage to the original structure.',
    featured: true,
    images: [
      `${BASE_2025_05}/deck-pg-county-01.png`,
      `${BASE_2025_05}/deck-pg-county-02.png`,
      `${BASE_2025_05}/deck-pg-county-03.png`,
    ],
  },
  {
    id: 'deck-staining-va',
    title: 'Elevated Deck Staining — Virginia',
    titleEs: 'Tinte de Terraza Elevada — Virginia',
    descriptionEs: 'Restauración completa y tinte de terraza en el Norte de Virginia — Terraza elevada de segundo piso decapada, lijada y terminada con un tinte sólido verde cazador intenso. Escaleras, barandas, balaustres y postes de soporte recubiertos para una protección uniforme contra la intemperie. Se conservó el patio de ladrillo de abajo. Transformación de antes y después.',
    category: 'Deck',
    description: 'Complete deck restoration and staining in Northern Virginia — Elevated second-story deck stripped, sanded, and finished with a rich hunter green solid stain. Stairs, railings, balusters, and support posts all coated for uniform weather protection. Brick patio underneath preserved. Before and after transformation.',
    featured: true,
    beforeImages: [
      `${BASE_2025_05}/deck-va-before-01.png`,
    ],
    images: [
      `${BASE_2025_05}/deck-va-after-01.png`,
    ],
  },

  // ===== PAINTING PROJECTS =====
  {
    id: 'exterior-painting-dc',
    title: 'Exterior Painting — Historic Rowhouse',
    titleEs: 'Pintura Exterior — Casa Adosada Histórica',
    descriptionEs: 'Repintado exterior completo de una casa adosada histórica de cuatro pisos en Washington, D.C. — Lavado a presión a fondo, raspado, imprimación y dos capas de pintura exterior de primera calidad. Molduras, cornisas, marcos de ventanas y entrada detallados a mano para conservar el carácter arquitectónico clásico del edificio.',
    category: 'Painting',
    description: 'Full exterior repaint of a four-story historic rowhouse in Washington, D.C. — Thorough power washing, scraping, priming, and two coats of premium exterior paint. Trim, cornices, window frames, and entryway detailed by hand to preserve the building\'s classic architectural character.',
    completedDate: 'May 2025',
    featured: true,
    images: [
      `${BASE_2025_05}/exterior-painting-dc-01.png`,
    ],
  },
  {
    id: 'basement-painting-md',
    title: 'Basement Finish & Paint',
    titleEs: 'Acabado y Pintura de Sótano',
    descriptionEs: 'Renovación completa y pintura de sótano en Laurel, MD — Se tomó un espacio en obra negra, sin terminar, con vigas expuestas y pisos de concreto, y se transformó en un área habitable completamente terminada. Se instaló drywall en todo el espacio, se agregó iluminación empotrada, se colocó piso de azulejo y las paredes se terminaron en una paleta limpia de azul grisáceo con una llamativa pared de acento. Incluye un rincón de lavandería con molduras nuevas y almacenamiento integrado.',
    category: 'Painting',
    description: 'Complete basement renovation and painting in Laurel, MD — Took a raw, unfinished space with exposed joists and concrete floors and transformed it into a fully finished living area. Drywall installed throughout, recessed lighting added, tile flooring laid, and walls finished in a clean blue-gray palette with a bold accent wall. Includes a dedicated laundry nook with fresh trim and built-in storage.',
    completedDate: 'October 2024',
    featured: true,
    beforeImages: [
      `${BASE_2025_05}/basement-md-before-01.png`,
      `${BASE_2025_05}/basement-md-before-02.png`,
      `${BASE_2025_05}/basement-md-during-01.png`,
    ],
    images: [
      `${BASE_2025_05}/basement-md-after-01.png`,
      `${BASE_2025_05}/basement-md-after-02.png`,
      `${BASE_2025_05}/basement-md-after-03.png`,
      `${BASE_2025_05}/basement-md-after-04.png`,
    ],
  },
  {
    id: 'basement-finish-porcelain',
    title: 'Finished Basement — Porcelain Tile Floor',
    titleEs: 'Sótano Terminado — Piso de Porcelanato',
    descriptionEs: 'Sótano terminado con piso de porcelanato en todo el espacio, iluminación empotrada, pintura nueva y molduras y zócalos blancos. La escalera abierta está terminada en blanco para combinar.',
    category: 'Basement',
    description: 'Finished basement with porcelain tile flooring throughout, recessed lighting, fresh paint, and white trim and baseboards. The open staircase is finished in white to match.',
    featured: true,
    images: [
      '/images/recent-projects/basement-finish-porcelain/after-staircase-wide.jpg',
    ],
  },
  {
    id: 'roof-replacement-ridge-maryland',
    title: 'New Roof — Maryland',
    titleEs: 'Techo Nuevo — Maryland',
    descriptionEs: 'Techo nuevo en Maryland — se retiraron las tejas asfálticas viejas hasta la base de tablones de madera, y luego se colocaron nuevas tejas asfálticas arquitectónicas con una ventila de cumbrera a lo largo de la parte más alta.',
    category: 'Roofing',
    description: 'New roof in Maryland — the old shingles torn off down to the wood plank decking, then new architectural shingles with a ridge vent along the peak.',
    featured: true,
    images: [
      '/images/recent-projects/roof-replacement-ridge-maryland/after-new-shingles-ridge-vent.jpg',
      '/images/recent-projects/roof-replacement-ridge-maryland/during-tearoff-plank-decking.jpg',
    ],
  },
  {
    id: 'roof-replacement-tearoff-decking',
    title: 'Roof Replacement — Maryland', // TODO: city to confirm (Ron said Temple Hills for the set; two houses)
    titleEs: 'Reemplazo de Techo — Maryland',
    descriptionEs: 'Reemplazo de techo en Maryland — el equipo retirando el techo viejo hasta las vigas y colocando una nueva base de techo.',
    category: 'Roofing',
    description: 'Roof replacement in Maryland — the crew tearing off the old roof down to the rafters and laying new roof decking.',
    featured: true,
    images: [
      '/images/recent-projects/roof-replacement-tearoff-decking/during-tearoff-new-decking.jpg',
    ],
  },
  {
    id: 'roof-replacement-brick-two-story',
    title: 'Roof Replacement — Maryland', // TODO: city to confirm
    titleEs: 'Reemplazo de Techo — Maryland',
    descriptionEs: 'Reemplazo de techo en una casa de dos pisos con fachada de ladrillo en Maryland — tejas asfálticas nuevas entregadas en la entrada de auto y el equipo trabajando en el techo principal.',
    category: 'Roofing',
    description: 'Roof replacement on a two-story brick-front home in Maryland — new shingles delivered to the driveway and the crew working across the main roof.',
    featured: true,
    images: [
      '/images/recent-projects/roof-replacement-brick-two-story/during-crew-on-roof-garage-side.jpg',
      '/images/recent-projects/roof-replacement-brick-two-story/during-shingles-delivered-front.jpg',
    ],
  },
  {
    id: 'bathroom-maryland',
    title: 'New Bathroom — Maryland', // TODO: add city once Ron confirms
    titleEs: 'Baño Nuevo — Maryland',
    descriptionEs: 'Baño nuevo en Maryland — ducha de acceso directo con azulejo imitación mármol y banco integrado, piso de ducha de mosaico hexagonal, puerta corrediza de vidrio y barras de apoyo, además de azulejo imitación mármol en el piso del baño.',
    category: 'Bathroom',
    description: 'New bathroom in Maryland — walk-in shower in marble-look tile with a built-in bench, hexagon mosaic shower floor, sliding glass door and grab bars, plus marble-look tile on the bathroom floor.',
    featured: true,
    images: [
      '/images/recent-projects/bathroom-maryland/after-walk-in-shower-glass-door.jpg',
    ],
  },
  {
    id: 'bathroom-rockville-md',
    title: 'New Bathroom — Maryland', // TODO: city to confirm (Ron said Rockville, then Bethesda; photo metadata says Fort Washington)
    titleEs: 'Baño Nuevo — Maryland',
    descriptionEs: 'Baño nuevo en Maryland — ducha de azulejo imitación mármol con una franja decorativa de vidrio azul, piso de ducha de mosaico hexagonal, un banco integrado con cubierta de piedra, puerta corrediza de vidrio y barra de apoyo, y azulejo tipo tablón imitación mármol en el piso del baño.',
    category: 'Bathroom',
    description: 'New bathroom in Maryland — marble-look tile shower with a blue glass accent stripe, hexagon mosaic shower floor, a built-in bench with a stone top, sliding glass door and grab bar, and marble-look plank tile on the bathroom floor.',
    featured: true,
    images: [
      '/images/recent-projects/bathroom-rockville-md/after-shower-glass-door-bench.jpg',
      '/images/recent-projects/bathroom-rockville-md/during-shower-tile-bench.jpg',
      '/images/recent-projects/bathroom-rockville-md/during-floor-tile-shower-curb.jpg',
    ],
  },
  {
    id: 'flooring-painting-bedroom',
    title: 'New Flooring & Interior Painting', // TODO: add city once Ron confirms
    titleEs: 'Pisos Nuevos y Pintura Interior',
    descriptionEs: 'Pisos nuevos y pintura interior — piso de tablones oscuros, paredes en dos tonos, turquesa y gris claro, divididas por una moldura blanca de protección, y zócalos blancos.',
    category: 'Painting',
    description: 'New flooring and interior painting — dark plank flooring, two-tone walls in turquoise and light gray split by a white chair rail, and white baseboards.',
    featured: true,
    images: [
      '/images/recent-projects/flooring-painting-bedroom/after-hardwood-floor-two-tone-walls.jpg',
    ],
  },
  {
    id: 'basement-vinyl-floor-potomac-md',
    title: 'Basement Waterproofing & Vinyl Floor — Potomac, MD',
    titleEs: 'Impermeabilización de Sótano y Piso de Vinilo — Potomac, MD',
    descriptionEs: 'Sótano en Potomac, MD — impermeabilización nueva, paredes aisladas, drywall y pintura, terminado con piso de tablones de vinilo y zócalos blancos. Transformación de antes y después.',
    category: 'Basement',
    description: 'Basement in Potomac, MD — new waterproofing, insulated walls, drywall and paint, finished with vinyl plank flooring and white baseboards. Before and after transformation.',
    featured: true,
    beforeImages: [
      '/images/recent-projects/basement-vinyl-floor-potomac-md/before-insulated-framing-windows.jpg',
    ],
    images: [
      '/images/recent-projects/basement-vinyl-floor-potomac-md/after-vinyl-floor-windows.jpg',
      '/images/recent-projects/basement-vinyl-floor-potomac-md/after-vinyl-floor-wide.jpg',
      '/images/recent-projects/basement-vinyl-floor-potomac-md/after-vinyl-floor-door-windows.jpg',
      '/images/recent-projects/basement-vinyl-floor-potomac-md/during-drywall-patching-windows.jpg',
    ],
  },
  {
    id: 'painting-power-washing-maryland-brick',
    title: 'Exterior Painting & Power Washing — Maryland',
    titleEs: 'Pintura Exterior y Lavado a Presión — Maryland',
    descriptionEs: 'Pintura exterior y lavado a presión en una casa colonial de ladrillo en Maryland — molduras, columnas, baranda del balcón y buhardillas en blanco, con lavado del ladrillo, el porche y la entrada de auto.',
    category: 'Painting',
    description: 'Exterior painting and power washing on a brick colonial in Maryland — white trim, columns, balcony railing and dormers, with the brick, porch and driveway washed.',
    featured: true,
    images: [
      '/images/recent-projects/painting-power-washing-maryland-brick/after-front-full.jpg',
      '/images/recent-projects/painting-power-washing-maryland-brick/after-front-side-angle.jpg',
    ],
  },
  {
    id: 'power-washing-painting-maryland',
    title: 'Power Washing & Exterior Painting — Maryland',
    titleEs: 'Lavado a Presión y Pintura Exterior — Maryland',
    descriptionEs: 'Lavado a presión y pintura exterior en una casa de ladrillo y piedra en Maryland — molduras, columnas, marcos de ventanas y ventana salediza en blanco. Fotos tomadas durante el trabajo.',
    category: 'Painting',
    description: 'Power washing and exterior painting on a brick and stone home in Maryland — white trim, columns, window surrounds and bay window. Photos taken during the job.',
    featured: true,
    images: [
      '/images/recent-projects/power-washing-painting-maryland/during-garage-side-balcony.jpg',
      '/images/recent-projects/power-washing-painting-maryland/during-front-entry-ladders.jpg',
      '/images/recent-projects/power-washing-painting-maryland/during-rear-patio-windows.jpg',
      '/images/recent-projects/power-washing-painting-maryland/during-bay-window-rear.jpg',
    ],
  },
  {
    id: 'exterior-painting-gutters-potomac-md',
    title: 'Exterior Painting & Gutters — Potomac, MD',
    titleEs: 'Pintura Exterior y Canaletas — Potomac, MD',
    descriptionEs: 'Pintura exterior y canaletas en Potomac, MD — molduras, cornisa y marcos de ventanas recién pintados en una casa de ladrillo y su garaje, con canaletas y bajantes a lo largo de la línea del techo.',
    category: 'Painting',
    description: 'Exterior painting and gutters in Potomac, MD — freshly painted trim, cornice and window surrounds on a brick home and garage, with gutters and downspouts along the roofline.',
    featured: true,
    images: [
      '/images/recent-projects/exterior-painting-gutters-potomac-md/after-garage-trim-gutters.jpg',
      '/images/recent-projects/exterior-painting-gutters-potomac-md/after-cornice-window-trim.jpg',
    ],
  },
  {
    id: 'painting-kitchen-washington-dc',
    title: 'Interior Painting & Kitchen — Washington, DC',
    titleEs: 'Pintura Interior y Cocina — Washington, DC',
    descriptionEs: 'Pintura interior y cocina en Washington, DC — paredes y techos pintados en toda un área de estar abierta con una pared de escalera con molduras de paneles, y una cocina con gabinetes blancos estilo shaker, salpicadero de azulejo tipo subway, mesones de cuarzo y una isla con cascada.',
    category: 'Painting',
    description: 'Interior painting and kitchen in Washington, DC — walls and ceilings painted throughout an open living area with a panel-molding stair wall, and a kitchen with white shaker cabinets, subway tile backsplash, quartz counters and a waterfall island.',
    featured: true,
    images: [
      '/images/recent-projects/painting-kitchen-washington-dc/after-kitchen-pendants.jpg',
      '/images/recent-projects/painting-kitchen-washington-dc/after-kitchen-waterfall-island.jpg',
      '/images/recent-projects/painting-kitchen-washington-dc/after-kitchen-cabinets-range.jpg',
      '/images/recent-projects/painting-kitchen-washington-dc/during-living-room-to-kitchen.jpg',
      '/images/recent-projects/painting-kitchen-washington-dc/during-stairs-panel-wall.jpg',
      '/images/recent-projects/painting-kitchen-washington-dc/during-living-room-bay-windows.jpg',
    ],
  },
  {
    id: 'waterproofing-washington-dc',
    title: 'Basement Waterproofing & Finish — Washington, DC',
    titleEs: 'Impermeabilización y Acabado de Sótano — Washington, DC',
    descriptionEs: 'Sótano en Washington, DC — impermeabilización, estructura y aislamiento nuevos, drywall y pintura, terminado como un área de estar abierta con una pared de ventanas. Transformación de antes y después.',
    category: 'Basement',
    description: 'Basement in Washington, DC — waterproofing, new framing and insulation, drywall, and painting, finished into an open living area with a wall of windows. Before and after transformation.',
    featured: true,
    beforeImages: [
      '/images/recent-projects/waterproofing-washington-dc/during-insulated-wall-framing.jpg',
    ],
    images: [
      '/images/recent-projects/waterproofing-washington-dc/after-living-area-windows-wide.jpg',
      '/images/recent-projects/waterproofing-washington-dc/after-painted-living-area-long.jpg',
      '/images/2026-waterproofing-nwdc/after-living-room-full.jpeg',
      '/images/recent-projects/waterproofing-washington-dc/before-vapor-barrier-framing-room.jpg',
      '/images/recent-projects/waterproofing-washington-dc/before-foundation-drainage.jpg',
      '/images/recent-projects/waterproofing-washington-dc/during-insulation-corner.jpg',
      '/images/recent-projects/waterproofing-washington-dc/during-drywall-patching.jpg',
    ],
  },
  {
    id: 'fence-suitland-md',
    title: 'Vinyl Privacy Fence — Suitland, MD',
    titleEs: 'Cerca de Privacidad de Vinilo — Suitland, MD',
    descriptionEs: 'Cerca de vinilo en Suitland, MD — se retiró la cerca de madera vieja e inclinada y se reemplazó con una cerca de privacidad de vinilo blanco y un portón. Transformación de antes y después.',
    category: 'Fencing',
    description: 'Vinyl fence in Suitland, MD — the old, leaning wood fence was taken out and replaced with a white vinyl privacy fence and gate. Before and after transformation.',
    featured: true,
    beforeImages: [
      '/images/recent-projects/fence-suitland-md/before-wood-fence-broken.jpg',
    ],
    images: [
      '/images/recent-projects/fence-suitland-md/after-side-panels-mulch.jpg',
      '/images/recent-projects/fence-suitland-md/after-gate-panels-lawn.jpg',
      '/images/recent-projects/fence-suitland-md/after-side-panels-lawn.jpg',
      '/images/recent-projects/fence-suitland-md/after-gate-panels-new-soil.jpg',
      '/images/recent-projects/fence-suitland-md/during-vinyl-panels-install.jpg',
    ],
  },
  {
    id: 'kitchen-remodel',
    title: 'Kitchen Remodel — Maryland',
    titleEs: 'Remodelación de Cocina — Maryland',
    descriptionEs: 'Remodelación de cocina en Maryland — gabinetes oscuros estilo shaker con manijas de níquel cepillado, mesones blancos imitación mármol, salpicadero de azulejo tipo subway, piso de azulejo tipo tablón imitación madera y electrodomésticos de acero inoxidable.',
    category: 'Kitchen',
    description: 'Kitchen remodel in Maryland — dark shaker cabinets with brushed nickel pulls, white marble-look counters, a subway tile backsplash, wood-look plank tile floor, and stainless steel appliances.',
    featured: true,
    images: [
      '/images/recent-projects/kitchen-remodel/after-dark-cabinets-quartz-counters.jpg',
    ],
  },
  {
    id: 'deck-waterproofing',
    title: 'Deck Waterproofing & New Composite Deck', // TODO: add city once Ron confirms
    titleEs: 'Impermeabilización de Terraza y Nueva Terraza de Material Compuesto',
    descriptionEs: 'Impermeabilización de terraza y una nueva terraza de material compuesto — se retiraron las tablas viejas de la terraza hasta las vigas, se aplicó una membrana impermeabilizante sobre la superficie y se instalaron nuevas tablas de material compuesto gris hasta las puertas corredizas. Transformación de antes y después.',
    category: 'Deck',
    description: 'Deck waterproofing and a new composite deck — the old deck boards removed down to the joists, a waterproofing membrane applied over the surface, and new gray composite decking installed up to the sliding doors. Before and after transformation.',
    featured: true,
    beforeImages: [
      '/images/recent-projects/deck-waterproofing/before-old-joists-removed.jpg',
    ],
    images: [
      '/images/recent-projects/deck-waterproofing/after-composite-deck.jpg',
      '/images/recent-projects/deck-waterproofing/during-waterproofing-membrane.jpg',
    ],
  },
  {
    id: 'deck-alexandria-va',
    title: 'New Composite Deck — Alexandria, VA',
    titleEs: 'Nueva Terraza de Material Compuesto — Alexandria, VA',
    descriptionEs: 'Nueva terraza de material compuesto en Alexandria, VA — tablas y peldaños de material compuesto gris, barandas blancas con balaustres negros y fascia blanca alrededor de la terraza y las escaleras.',
    category: 'Deck',
    description: 'New composite deck in Alexandria, VA — gray composite deck boards and stair treads, white railings with black balusters, and white fascia around the deck and stairs.',
    featured: true,
    images: [
      '/images/recent-projects/deck-alexandria-va/after-deck-stairs-railing-wide.jpg',
      '/images/recent-projects/deck-alexandria-va/after-railing-rear-wide.jpg',
      '/images/recent-projects/deck-alexandria-va/after-stairs-railing.jpg',
      '/images/recent-projects/deck-alexandria-va/during-composite-boards-posts.jpg',
    ],
  },
  {
    id: 'deck-leesburg-va',
    title: 'Finished Deck — Leesburg, VA',
    titleEs: 'Terraza Terminada — Leesburg, VA',
    descriptionEs: 'Terraza terminada en Leesburg, VA — nuevas tablas de madera tratada a presión colocadas en secciones en ángulo con tablas de borde entre ellas, y nuevos peldaños y contrahuellas, enmarcadas por las barandas color crema y la pérgola.',
    category: 'Deck',
    description: 'Finished deck in Leesburg, VA — new pressure-treated deck boards laid in angled sections with border boards between them, and new stair treads and risers, framed by the cream railings and pergola.',
    featured: true,
    images: [
      '/images/recent-projects/deck-leesburg-va/after-stairs-deck-wide.jpg',
      '/images/recent-projects/deck-leesburg-va/after-deck-boards-pergola.jpg',
    ],
  },
  {
    id: 'addition-leesburg-va',
    title: 'House Extension — Leesburg, VA',
    titleEs: 'Ampliación de Casa — Leesburg, VA',
    descriptionEs: 'Ampliación de casa en Leesburg, VA — una nueva sala familiar construida como parte de la casa. Azulejo de porcelanato tipo tablón imitación madera colocado en patrón escalonado, iluminación empotrada, una nueva hilera de ventanas, apliques de pared, una abertura de paso hacia la cocina, y molduras y pintura nuevas en todo el espacio. Transformación de antes y después.',
    category: 'Complete Renovation',
    description: 'House extension in Leesburg, VA — a new family room built onto the home. Wood-look porcelain plank tile laid in a staggered pattern, recessed lighting, a new bank of windows, wall sconces, a pass-through opening to the kitchen, and fresh trim and paint throughout. Before and after transformation.',
    featured: true,
    beforeImages: [
      '/images/recent-projects/addition-leesburg-va/during-tile-floor-install.jpg',
    ],
    images: [
      '/images/recent-projects/addition-leesburg-va/after-family-room-wide.jpg',
      '/images/recent-projects/addition-leesburg-va/after-tile-grouted-window-wall.jpg',
    ],
  },
  {
    id: 'renovation-painting-va',
    title: 'Interior Renovation & Paint — Virginia',
    titleEs: 'Renovación Interior y Pintura — Virginia',
    descriptionEs: 'Renovación interior completa en el Norte de Virginia — Nuevo piso de tablones de vinilo de lujo en todo el espacio, drywall nuevo, iluminación empotrada y un acabado de pintura lavanda personalizado. Espacio de estar de concepto abierto transformado con instalación eléctrica nueva, trabajo de molduras y una paleta limpia y moderna. Espacio preparado para quedar listo para mudarse.',
    category: 'Complete Renovation',
    description: 'Full interior renovation in Northern Virginia — New luxury vinyl plank flooring throughout, fresh drywall, recessed lighting, and a custom lavender paint finish. Open-concept living space transformed with new electrical, trim work, and a clean modern palette. Space prepped for move-in ready condition.',
    featured: true,
    images: [
      `${BASE_2025_05}/renovation-va-01.png`,
      `${BASE_2025_05}/renovation-va-02.png`,
    ],
  },

  // ===== FENCING PROJECTS =====
  {
    id: 'fence-vinyl-bowie',
    title: 'Vinyl Privacy Fence Installation',
    titleEs: 'Instalación de Cerca de Privacidad de Vinilo',
    descriptionEs: 'Reemplazo completo de cerca en Bowie, MD — Se retiró la cerca de privacidad de madera deteriorada y se instaló una nueva cerca de privacidad de vinilo blanco con detalles decorativos de celosía en la parte superior y un portón a juego. Una solución limpia y sin mantenimiento que transformó el patio trasero.',
    category: 'Fencing',
    description: 'Complete fence replacement in Bowie, MD — Removed deteriorating wooden privacy fence and installed new white vinyl privacy fencing with decorative lattice top accents and matching gate. Clean, maintenance-free solution that transformed the backyard.',
    featured: true,
    completedDate: 'January 2025',
    beforeImages: [
      `${BASE_FENCE_BOWIE}/fence-before-01.png`,
    ],
    images: [
      `${BASE_FENCE_BOWIE}/fence-after-01.png`,
      `${BASE_FENCE_BOWIE}/fence-after-02.png`,
      `${BASE_FENCE_BOWIE}/fence-after-03.png`,
      `${BASE_FENCE_BOWIE}/fence-after-04.png`,
    ],
  },

  // ===== BASEMENT PROJECTS =====
  {
    id: 'basement-remodel-greenbelt',
    title: 'Basement Remodel — Flooring & Painting',
    titleEs: 'Remodelación de Sótano — Pisos y Pintura',
    descriptionEs: 'Remodelación completa de sótano en Greenbelt, MD — Se instaló un hermoso piso de porcelanato imitación madera en todo el espacio, paredes de acento color lavanda recién pintadas, iluminación LED empotrada y techo y molduras en blanco limpio. Transformamos un sótano anticuado en un espacio habitable luminoso y moderno.',
    category: 'Basement',
    description: 'Full basement remodel in Greenbelt, MD — Installed beautiful wood-look porcelain tile flooring throughout, fresh lavender accent walls, recessed LED lighting, and clean white ceiling and trim. Transformed a dated basement into a bright, modern living space.',
    featured: true,
    completedDate: 'January 2025',
    beforeImages: [
      `${BASE_BASEMENT_GREENBELT}/basement-before-01.png`,
    ],
    images: [
      `${BASE_BASEMENT_GREENBELT}/basement-after-01.png`,
      `${BASE_BASEMENT_GREENBELT}/basement-after-02.png`,
    ],
  },
]

export const GALLERY_CATEGORIES = [
  'All',
  'Kitchen',
  'Bathroom',
  'Basement',
  'Complete Renovation',
  'Fencing',
  'Concrete',
  'Roofing',
  'Deck',
  'Painting',
] as const

export type GalleryCategory = typeof GALLERY_CATEGORIES[number]

// Spanish display names for the category values above (values stay in English)
export const GALLERY_CATEGORY_LABELS_ES: Record<GalleryCategory, string> = {
  'All': 'Todos',
  'Kitchen': 'Cocina',
  'Bathroom': 'Baño',
  'Basement': 'Sótano',
  'Complete Renovation': 'Renovación Completa',
  'Fencing': 'Cercas',
  'Concrete': 'Concreto',
  'Roofing': 'Techos',
  'Deck': 'Terrazas',
  'Painting': 'Pintura',
}

// Display label for a category in the given locale
export function getGalleryCategoryLabel(category: string, locale: string): string {
  if (locale !== 'es') return category
  return GALLERY_CATEGORY_LABELS_ES[category as GalleryCategory] ?? category
}

// Helper function to get all images for a category
export function getImagesByCategory(category: GalleryCategory): GalleryProject[] {
  if (category === 'All') return GALLERY_PROJECTS
  return GALLERY_PROJECTS.filter(p => p.category === category)
}

// Helper function to get featured projects
export function getFeaturedProjects(): GalleryProject[] {
  return GALLERY_PROJECTS.filter(p => p.featured)
}

// Get total image count
export function getTotalImageCount(): number {
  return GALLERY_PROJECTS.reduce((acc, p) => acc + p.images.length, 0)
}
