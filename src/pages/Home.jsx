import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button } from '../components/ui'
import { BookShowcase } from '../components/BookShowcase'

export const Home = () => {
  const [books, setBooks] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/books.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setBooks(Array.isArray(data) ? data : []))
      .catch(() => setBooks([]))

    fetch('/products.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
  }, [])

  // Gallery images from public/img
  const galleryImages = [
    '/img/dfuns 2024-06-29 222803.160.jpg',
    '/img/dfuns 2024-06-29 222804.730.jpg',
    '/img/dfuns 2024-06-29 222813.390.jpg',
    '/img/dfuns 2024-06-29 222814.908.jpg',
    '/img/dfuns 2024-06-29 222848.819.jpg',
    '/img/dfuns 2024-06-29 222905.931.jpg',
    '/img/dfuns 2024-06-29 222906.245.jpg',
    '/img/dfuns 2024-06-29 222906.630.jpg',
    '/img/dfuns 2024-06-29 222906.985.jpg',
    '/img/dfuns 2024-06-29 222907.352.jpg',
    '/img/dfuns 2024-06-29 222908.085.jpg',
    '/img/dfuns 2024-06-29 222919.484.jpg',
    '/img/dfuns 2024-06-29 222920.193.jpg',
    '/img/dfuns 2024-06-29 222921.518.jpg',
    '/img/dfuns 2024-06-29 223010.908.jpg',
  ]

  // Featured product IDs with custom image overrides
  const featuredConfig = [
    { id: 'naipes', customImage: '/products/naipes.jpg' },
    { id: 'rompecabezas-paisaje', customImage: '/products/fitz-roy.jpg' },
    { id: 'planner-mensual-iman-floral', imageIndex: 1 }
  ]

  const featuredProducts = featuredConfig
    .map(config => {
      const product = products.find(p => p.id === config.id)
      if (!product) return null
      return {
        ...product,
        featuredImage: config.customImage || product.images?.[config.imageIndex || 0] || product.images?.[0]
      }
    })
    .filter(Boolean)

  return (
    <div>
      {/* First section: Books showcase — iTunes disc–style horizontal scroll */}
      <BookShowcase books={books} />

      {/* Info Section */}
      <section className="py-16 lg:py-20 bg-sand">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="font-canopee font-normal text-xl lg:text-2xl text-ink mb-3 uppercase">
                Títulos argentinos independientes
              </h3>
              <p className="font-sans text-sm lg:text-base text-muted leading-relaxed">
                Descubrí una selección cuidada de libros de editoriales independientes argentinas. Cada título es elegido por su calidad literaria y editorial, apoyando la producción cultural local.
              </p>
            </div>
            <div>
              <h3 className="font-canopee font-normal text-xl lg:text-2xl text-ink mb-3 uppercase">
                Tienda física ubicada en Pilar
              </h3>
              <p className="font-sans text-sm lg:text-base text-muted leading-relaxed">
                Visitanos en nuestro espacio en Almendro, Herbarium. Un lugar pensado para explorar, hojear y descubrir nuevas lecturas en un ambiente acogedor.
              </p>
            </div>
            <div>
              <h3 className="font-canopee font-normal text-xl lg:text-2xl text-ink mb-3 uppercase">
                Envíos a todo el país en 48hs
              </h3>
              <p className="font-sans text-sm lg:text-base text-muted leading-relaxed">
                Comprá online y recibí tus libros en tu casa. Trabajamos con envíos rápidos y seguros para que tu pedido llegue en tiempo y forma.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 lg:py-20 bg-cream">
        <Container>
          <h2 className="font-canopee font-normal text-3xl lg:text-4xl text-ink uppercase mb-12 lg:mb-16">
            Otros productos increíbles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-square bg-stone/30 rounded-lg overflow-hidden mb-4">
                  {product.featuredImage && (
                    <img 
                      src={product.featuredImage} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <h4 className="font-sans text-base lg:text-lg text-ink font-medium mb-1">
                  {product.name}
                </h4>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Continuous Scrolling Gallery - Eventos Literarios */}
      <section className="py-16 lg:py-20 bg-sand overflow-hidden">
        <Container className="mb-12 lg:mb-16">
          <h2 className="font-canopee font-normal text-3xl lg:text-4xl text-ink uppercase mb-4">
            Eventos Literarios
          </h2>
          <p className="font-sans text-base lg:text-lg text-muted leading-relaxed">
            Organizamos encuentros, presentaciones de libros y charlas con autores. Un espacio para compartir lecturas, descubrir nuevas voces y conectar con la comunidad literaria.
          </p>
        </Container>
        <div className="gallery-scroll">
          <div className="gallery-track">
            {[...galleryImages, ...galleryImages].map((img, index) => (
              <div key={index} className="gallery-item">
                <img 
                  src={img} 
                  alt={`Evento literario ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
