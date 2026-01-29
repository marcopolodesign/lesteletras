import React, { useState, useEffect } from 'react'
import { Container } from '../components/ui'
import { ProductCard } from '../components/ProductCard'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load products from public/products.json
    const loadProducts = async () => {
      try {
        const response = await fetch('/products.json')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="bg-sand">
      {/* Header */}
      <section className="py-14 lg:py-16 border-b border-stone/80">
        <Container>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink mb-3 tracking-tight">
            Our collection
          </h1>
          <p className="text-muted text-sm">
            Explore our handpicked selection of premium products.
          </p>
        </Container>
      </section>

      {/* Products Grid */}
      <section className="py-14 lg:py-20">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-muted text-sm">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-24">
              <p className="text-muted text-sm">No products found. Please check back soon.</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
