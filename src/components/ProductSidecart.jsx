import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useProduct } from '../context/ProductContext'
import { XMarkIcon } from '@heroicons/react/24/outline'

export const ProductSidecart = () => {
  const { selectedProduct, isSidecartOpen, closeSidecart } = useProduct()
  const sidecartRef = useRef(null)
  const backdropRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (isSidecartOpen && sidecartRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.fromTo(
        sidecartRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      )
    } else if (!isSidecartOpen && sidecartRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
      gsap.to(sidecartRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
      })
    }
  }, [isSidecartOpen])

  if (!selectedProduct) return null

  const images = selectedProduct.images || []
  const hasMultipleImages = images.length > 1

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] opacity-0 cursor-pointer"
        onClick={closeSidecart}
        aria-hidden="true"
      />

      {/* Sidecart */}
      <div
        ref={sidecartRef}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-cream border-l border-stone/80 z-[101] flex flex-col translate-x-full overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone/80 sticky top-0 bg-cream">
          <h2 className="font-serif text-xl font-semibold text-ink tracking-tight">Product details</h2>
          <button
            onClick={closeSidecart}
            className="p-2 hover:bg-stone/40 rounded transition-colors"
            aria-label="Close sidecart"
          >
            <XMarkIcon className="w-5 h-5 text-ink" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Gallery */}
          <div className="bg-stone/20 relative">
            <div className="aspect-square overflow-hidden">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  No image available
                </div>
              )}
            </div>

            {/* Image Navigation */}
            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <button
                  onClick={handlePrevImage}
                  className="pointer-events-auto bg-cream/90 hover:bg-cream p-2 rounded-full transition-colors text-ink border border-stone/60"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={handleNextImage}
                  className="pointer-events-auto bg-cream/90 hover:bg-cream p-2 rounded-full transition-colors text-ink border border-stone/60"
                  aria-label="Next image"
                >
                  →
                </button>
              </div>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-4 bg-ink/70 text-cream px-3 py-1 rounded text-xs">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="font-serif text-2xl font-semibold text-ink mb-2 tracking-tight">
                {selectedProduct.name}
              </h1>
              {selectedProduct.series && (
                <p className="text-muted text-sm uppercase tracking-wider">{selectedProduct.series}</p>
              )}
            </div>

            {selectedProduct.price && (
              <div className="py-4 border-y border-stone/80">
                <p className="text-muted text-xs uppercase tracking-wider mb-2">Price</p>
                <p className="font-serif text-xl font-semibold text-ink">
                  {typeof selectedProduct.price === 'string'
                    ? selectedProduct.price
                    : `$${selectedProduct.price?.toFixed(2)}`}
                </p>
              </div>
            )}

            {selectedProduct.stock !== undefined && (
              <div>
                <p className="text-muted text-xs uppercase tracking-wider mb-2">Availability</p>
                <p className={`text-sm font-medium ${selectedProduct.stock > 0 ? 'text-muted' : 'text-red-600/90'}`}>
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} in stock`
                    : 'Out of stock'}
                </p>
              </div>
            )}

            {selectedProduct.description && (
              <div>
                <h3 className="font-serif text-sm font-semibold text-ink mb-3 uppercase tracking-wider text-muted">
                  Description
                </h3>
                <p className="text-ink text-sm leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>
            )}

            {selectedProduct.details && (
              <div>
                <h3 className="font-serif text-sm font-semibold text-ink mb-3 uppercase tracking-wider text-muted">
                  Details
                </h3>
                <ul className="space-y-2">
                  {Object.entries(selectedProduct.details).map(([key, value]) => (
                    <li key={key} className="text-ink text-sm flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="text-muted">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="border-t border-stone/80 p-6 bg-cream sticky bottom-0">
          <button className="w-full bg-ink text-cream font-medium py-4 rounded-sm hover:bg-ink/90 transition-colors duration-300 text-sm">
            Add to cart
          </button>
          <button
            onClick={closeSidecart}
            className="w-full mt-3 border border-stone text-ink font-medium py-4 rounded-sm hover:border-muted/50 hover:bg-stone/30 transition-colors duration-300 text-sm"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </>
  )
}
