export interface RecommendationLetter {
  id: string
  author: string
  service: string
  serviceEs: string
  quote: string
  quoteEs: string
  fullText: string
  fullTextEs: string
  pdfPath?: string
}

export const RECOMMENDATION_LETTERS: RecommendationLetter[] = [
  {
    id: 'elizabeth-amed',
    author: 'Elizabeth Amed',
    service: 'Retaining Wall & Fence',
    serviceEs: 'Muro de Contención y Cerca',
    quote: 'You and your staff have renewed our faith in the right way of conducting business by a professional company.',
    quoteEs: 'Usted y su personal han renovado nuestra fe en la forma correcta de hacer negocios por parte de una empresa profesional.',
    fullText: 'Your company CR Home Pros recently re constructed a retaining wall and also replaced a wooden fence for us. I would like to thank you and your employees for the good job my husband and I are really happy with the work done by your crew and we would like to express our appreciation to you and your staff. Four years ago, we had a bad experience with a roofing contractor, thanks to a friend your company was recommended to us. You and your staff have renewed our faith in the right way of conducting business by a professional company. Again, thank you very much for a job well done.',
    fullTextEs: 'Su empresa CR Home Pros recientemente reconstruyó un muro de contención y también reemplazó una cerca de madera para nosotros. Me gustaría agradecerle a usted y a sus empleados por el buen trabajo, mi esposo y yo estamos muy contentos con el trabajo realizado por su equipo. Hace cuatro años tuvimos una mala experiencia con un contratista de techos, gracias a un amigo nos recomendaron su empresa. Usted y su personal han renovado nuestra fe en la forma correcta de hacer negocios.',
    pdfPath: '/docs/recommendation-elizabeth-amed.pdf',
  },
  // Add more letters here as Carlos provides them
]
