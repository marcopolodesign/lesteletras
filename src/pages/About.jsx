import React from 'react'
import { Container } from '../components/ui'

export const About = () => {
  return (
    <div className="bg-sand">
      {/* Hero */}
      <section className="py-20 lg:py-24">
        <Container>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink mb-6 tracking-tight">
            About Leste
          </h1>
          <p className="text-muted max-w-2xl leading-relaxed text-sm">
            Leste is a curated marketplace for premium products that celebrate quality, design, and thoughtful craftsmanship.
          </p>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-24 border-t border-stone/80 bg-cream">
        <Container>
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold text-ink mb-6 tracking-tight">
              Our story
            </h2>
            <p className="text-muted mb-4 leading-relaxed text-sm">
              Founded with a passion for quality and design, Leste brings together carefully selected products from artisans and makers around the world. Each item in our collection has been chosen for its exceptional craftsmanship and design excellence.
            </p>
            <p className="text-muted mb-4 leading-relaxed text-sm">
              We believe that the products we choose should enhance our daily lives, inspire us, and tell a story. That's why every item in our collection is thoughtfully selected and vetted for quality.
            </p>
            <p className="text-muted leading-relaxed text-sm">
              Our mission is to make premium, well-designed products accessible and to celebrate the makers and artisans who create them.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-24 border-t border-stone/80 bg-sand">
        <Container>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-12 tracking-tight">
            Our values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink mb-3 tracking-tight">Quality</h3>
              <p className="text-muted text-sm leading-relaxed">
                We never compromise on quality. Every product is selected for its durability and craftsmanship.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink mb-3 tracking-tight">Design</h3>
              <p className="text-muted text-sm leading-relaxed">
                Great design is timeless. We seek out products that are both beautiful and functional.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-ink mb-3 tracking-tight">Sustainability</h3>
              <p className="text-muted text-sm leading-relaxed">
                We care about our impact on the environment and prioritize sustainable practices.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
