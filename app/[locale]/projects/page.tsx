'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GALLERY_PROJECTS as RAW_PROJECTS, GALLERY_CATEGORIES, type GalleryCategory } from '@/lib/gallery-data'
import { resolveProjectImages } from '@/lib/resolve-images'
import { BeforeAfterSlider } from '@/components/ui/BeforeAfterSlider'

// Resolve image URLs — uses Firebase Storage when configured, local paths otherwise
const GALLERY_PROJECTS = RAW_PROJECTS.map(resolveProjectImages)

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All')
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())
  const [lightboxImage, setLightboxImage] = useState<{ src: string; projectId: string; index: number } | null>(null)

  // Auto-expand projects on mount based on screen size
  useEffect(() => {
    const handleInitialExpand = () => {
      const isDesktop = window.innerWidth >= 1024
      const projectsToExpand = isDesktop 
        ? GALLERY_PROJECTS.map(p => p.id)
        : GALLERY_PROJECTS.slice(0, 3).map(p => p.id)
      setExpandedProjects(new Set(projectsToExpand))
    }
    handleInitialExpand()
    window.addEventListener('resize', handleInitialExpand)
    return () => window.removeEventListener('resize', handleInitialExpand)
  }, [])

  const filteredProjects = activeCategory === 'All' 
    ? GALLERY_PROJECTS 
    : GALLERY_PROJECTS.filter(p => p.category === activeCategory)

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectId)) {
        newSet.delete(projectId)
      } else {
        newSet.add(projectId)
      }
      return newSet
    })
  }

  const isProjectExpanded = (projectId: string) => expandedProjects.has(projectId)

  const openLightbox = (src: string, projectId: string, index: number) => {
    setLightboxImage({ src, projectId, index })
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxImage) return
    const project = GALLERY_PROJECTS.find(p => p.id === lightboxImage.projectId)
    if (!project) return
    
    let newIndex = direction === 'next' 
      ? (lightboxImage.index + 1) % project.images.length
      : (lightboxImage.index - 1 + project.images.length) % project.images.length
    
    setLightboxImage({
      src: project.images[newIndex],
      projectId: lightboxImage.projectId,
      index: newIndex
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-dark-900 via-primary-900 to-dark-950">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-gold-400 tracking-wider uppercase mb-4">
              Our Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              Project{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                Gallery
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Browse our completed projects and see the quality craftsmanship we bring to every home.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-4">
                  Categories
                </h3>
                <nav className="space-y-1">
                  {GALLERY_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        'w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                        activeCategory === cat
                          ? 'bg-primary-800 text-white'
                          : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Gallery Content */}
            <div className="flex-1">
              <div className="space-y-6">
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="border border-dark-200 rounded-xl overflow-hidden bg-white"
                  >
                    {/* Project Header (Accordion Trigger) */}
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-dark-50 transition-colors"
                    >
                      <div className="text-left">
                        <h3 className="text-lg md:text-xl font-display font-semibold text-dark-900">
                          {project.title}
                        </h3>
                        <p className="text-sm text-dark-500 mt-1">
                          {project.category} • {project.images.length} photos
                        </p>
                        {project.description && (
                          <p className="text-sm text-dark-600 mt-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>
                      {isProjectExpanded(project.id) ? (
                        <ChevronUp className="w-5 h-5 text-dark-400 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-dark-400 flex-shrink-0 ml-4" />
                      )}
                    </button>

                    {/* Project Images (Accordion Content) */}
                    {isProjectExpanded(project.id) && (
                      <div className="p-4 md:p-6 pt-0 border-t border-dark-100">
                        {/* Before/After Slider (if project has before images) */}
                        {project.beforeImages && project.beforeImages.length > 0 && (
                          <div className="mb-6">
                            <div className="text-sm font-semibold text-dark-500 uppercase tracking-wider mb-3">Before &amp; After</div>
                            <BeforeAfterSlider
                              beforeImage={project.beforeImages[0]}
                              afterImage={project.images[0]}
                              className="shadow-md"
                            />
                          </div>
                        )}

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                          {project.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => openLightbox(img, project.id, idx)}
                              className="aspect-square relative rounded-lg overflow-hidden group bg-dark-100"
                            >
                              <Image
                                src={img}
                                alt={`${project.title} - Image ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                unoptimized={img.includes('firebasestorage')}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-dark-400 text-xs">Photo unavailable</div>'
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            </button>
                          ))}
                        </div>

                        {/* Featured Image (first image larger) */}
                        <div 
                          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-dark-100"
                          onClick={() => openLightbox(project.images[0], project.id, 0)}
                        >
                          <Image
                            src={project.images[0]}
                            alt={`${project.title} - Featured`}
                            fill
                            className="object-cover"
                            unoptimized={project.images[0].includes('firebasestorage')}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-12 bg-dark-50 rounded-xl">
                  <p className="text-dark-500">No projects found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Buttons */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
          >
            <ChevronRight className="w-10 h-10" />
          </button>

          {/* Image */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.src}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {lightboxImage.index + 1} / {GALLERY_PROJECTS.find(p => p.id === lightboxImage.projectId)?.images.length}
          </div>
        </div>
      )}
    </>
  )
}
