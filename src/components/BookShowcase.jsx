import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const SPINE_WIDTH = 72
const OPEN_WIDTH = 400
const BOOK_HEIGHT = 680
const GAP = 12
const AUTO_SLIDE_INTERVAL = 5000 // 5 seconds

const SPINE_COLORS = [
  '#5b6b95', // blue
  '#6b8f71', // green
  '#a67c52', // brown
  '#8b6b7a', // mauve
  '#6b7a8b', // slate
  '#7a6b5c', // tan
]

export function BookShowcase({ books = [] }) {
  const [activeIndex, setActiveIndex] = useState(4)
  const containerRef = useRef(null)
  const booksContainerRef = useRef(null)
  const wheelTimeoutRef = useRef(null)
  const accumulatedDeltaRef = useRef(0)
  const autoSlideTimeoutRef = useRef(null)
  const scrollAnimationRef = useRef(null)

  // Continuous scroll animation from right to left
  useEffect(() => {
    const booksContainer = booksContainerRef.current
    if (!booksContainer || books.length === 0) return

    // Kill any existing animation
    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.kill()
    }

    // Set initial position explicitly
    gsap.set(booksContainer, { x: '0%' })

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Continuous animation moving left (20 seconds for full cycle)
      // Using modifiers to create seamless loop without yoyo
      scrollAnimationRef.current = gsap.to(booksContainer, {
        x: '-20%',
        duration: 20,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % 20) // Loop back seamlessly
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current.kill()
      }
    }
  }, [books.length])

  // Auto-slide effect: advance to next book every 5 seconds
  useEffect(() => {
    if (books.length === 0) return

    const startAutoSlide = () => {
      autoSlideTimeoutRef.current = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % books.length)
      }, AUTO_SLIDE_INTERVAL)
    }

    startAutoSlide()

    return () => {
      if (autoSlideTimeoutRef.current) {
        clearTimeout(autoSlideTimeoutRef.current)
      }
    }
  }, [activeIndex, books.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      // Only respond to horizontal scroll or trackpad horizontal swipe
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault()
        
        accumulatedDeltaRef.current += e.deltaX

        // Clear existing timeout
        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current)
        }

        // Wait for scroll to settle before changing active book
        wheelTimeoutRef.current = setTimeout(() => {
          const delta = accumulatedDeltaRef.current
          accumulatedDeltaRef.current = 0

          // Reduced threshold for easier scrolling
          if (Math.abs(delta) > 15) {
            if (delta > 0 && activeIndex < books.length - 1) {
              setActiveIndex(activeIndex + 1)
            } else if (delta < 0 && activeIndex > 0) {
              setActiveIndex(activeIndex - 1)
            }
          }
        }, 100)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current)
    }
  }, [activeIndex, books.length])

  if (!books.length) return null

  return (
    <section className="bg-stone/40 overflow-hidden" aria-label="Books showcase">
      {/* Header Section */}
      <div className="container mx-auto px-8 py-12 lg:py-16 pb-6 lg:pb-8 flex items-start justify-between">
        <div className="flex-1 pr-8">
          <h1 className="font-canopee font-normal text-4xl lg:text-5xl xl:text-6xl text-ink uppercase leading-none mb-0">
            Lesté es una librería independiente ubicada en Almendro, Herbarium. Dirigida por la gran cumpleañera Delfi Quetto.
          </h1>
        </div>
        <div className="flex-shrink-0">
          <img 
            src="/assets/SVG/logo.svg" 
            alt="Leste Logo" 
            className="w-32 h-32 lg:w-40 lg:h-40"
          />
        </div>
      </div>

      {/* Books Showcase */}
      <div 
        ref={containerRef}
        className="w-full overflow-x-hidden overflow-y-hidden py-8 lg:py-12"
      >
        <div
          ref={booksContainerRef}
          className="flex items-stretch justify-start transition-all duration-500 ease-out"
          style={{
            gap: `${GAP}px`,
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
        >
          {books.map((book, index) => {
            const isActive = index === activeIndex
            const width = isActive ? OPEN_WIDTH : SPINE_WIDTH
            const color = SPINE_COLORS[index % SPINE_COLORS.length]

            return (
              <div
                key={`${book.name}-${book.author}-${index}`}
                className={`flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden ${!isActive ? 'cursor-pointer hover:-translate-y-2 hover:scale-[1.01]' : ''}`}
                style={{
                  width: width,
                  minWidth: width,
                  height: BOOK_HEIGHT,
                  backgroundColor: color,
                  transition: 'width 0.5s ease-out, min-width 0.5s ease-out',
                  willChange: 'width',
                }}
                onClick={() => !isActive && setActiveIndex(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (!isActive) setActiveIndex(index)
                  }
                  if (e.key === 'ArrowRight' && activeIndex < books.length - 1) {
                    e.preventDefault()
                    setActiveIndex(activeIndex + 1)
                  }
                  if (e.key === 'ArrowLeft' && activeIndex > 0) {
                    e.preventDefault()
                    setActiveIndex(activeIndex - 1)
                  }
                }}
                aria-label={isActive ? `Open: ${book.name} by ${book.author}` : `Book: ${book.name}, click to open`}
              >
                {isActive ? (
                  <div className="w-full h-full flex flex-col justify-between p-10 lg:p-12 text-white text-left">
                    <div>
                      <h3 className="font-canopee font-normal text-4xl lg:text-5xl xl:text-6xl leading-tight mb-5 lg:mb-6">
                        {book.name}
                      </h3>
                      <p className="font-canopee font-normal text-xl lg:text-2xl xl:text-3xl opacity-90">{book.author}</p>
                    </div>
                    <p className="font-canopee font-normal text-lg lg:text-xl xl:text-2xl opacity-80">{book.editorial || '—'}</p>
                  </div>
                ) : (
                  <div
                    className="flex flex-row justify-between items-center px-4 py-8 w-full h-full text-white"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                  >
                    <span className="font-canopee font-normal text-lg lg:text-xl [text-orientation:mixed] text-center">
                      {book.name}
                    </span>
                    <span className="font-canopee font-normal text-base lg:text-lg uppercase tracking-wider opacity-90 [text-orientation:mixed]">
                      {book.author}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
