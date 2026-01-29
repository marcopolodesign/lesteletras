import React from 'react'
import { Container } from '../components/ui'

export const Events = () => {
  return (
    <div className="bg-sand">
      {/* Header */}
      <section className="py-20 lg:py-24">
        <Container>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-ink mb-6 tracking-tight">
            Events & news
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Stay updated on the latest happenings at Leste.
          </p>
        </Container>
      </section>

      {/* Events List */}
      <section className="py-20 border-t border-stone/80 bg-cream">
        <Container>
          <div className="space-y-10">
            {/* Event 1 */}
            <div className="border-b border-stone/80 pb-8 last:border-b-0">
              <div className="mb-3">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">March 15, 2025</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3 tracking-tight">
                Spring collection launch
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Join us for the exclusive launch of our Spring Collection featuring new arrivals from emerging designers and artisans.
              </p>
              <a href="#" className="text-ink font-medium hover:text-muted no-underline text-sm">
                Learn more →
              </a>
            </div>

            {/* Event 2 */}
            <div className="border-b border-stone/80 pb-8 last:border-b-0">
              <div className="mb-3">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">February 28, 2025</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3 tracking-tight">
                Designer Q&A session
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Meet with our featured designers in an exclusive online Q&A. Learn about their creative process and inspiration.
              </p>
              <a href="#" className="text-ink font-medium hover:text-muted no-underline text-sm">
                Register now →
              </a>
            </div>

            {/* Event 3 */}
            <div className="pb-8">
              <div className="mb-3">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">February 10, 2025</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-ink mb-3 tracking-tight">
                Winter sale
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Up to 40% off select items from our Winter Collection. Limited time offer while supplies last.
              </p>
              <a href="/products" className="text-ink font-medium hover:text-muted no-underline text-sm">
                Shop sale →
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter */}
      <section className="py-20 border-t border-stone/80 bg-sand">
        <Container>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-4 text-center tracking-tight">
            Stay updated
          </h2>
          <p className="text-muted text-sm text-center mb-8 leading-relaxed">
            Subscribe to our newsletter for new arrivals, events, and exclusive offers.
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-stone bg-cream rounded-sm focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink text-ink placeholder:text-muted/70 text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-ink text-cream font-medium rounded-sm hover:bg-ink/90 transition-colors text-sm"
            >
              Subscribe
            </button>
          </form>
        </Container>
      </section>
    </div>
  )
}
