import React from 'react'
import { Container } from '../ui'

export const Footer = () => {
  return (
    <footer className="border-t border-stone/80 bg-cream mt-20">
      <Container className="py-14">
        <div className="grid grid-cols-3 gap-10 mb-12">
          <div>
            <h4 className="font-serif text-lg font-semibold text-ink mb-4">Leste</h4>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              Curated collection of premium products for modern living.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-ink mb-4">Links</h4>
            <ul className="space-y-3 list-none">
              <li>
                <a href="/" className="text-muted hover:text-ink text-sm no-underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-muted hover:text-ink text-sm no-underline">
                  Products
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted hover:text-ink text-sm no-underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg font-semibold text-ink mb-4">Get in Touch</h4>
            <p className="text-muted text-sm leading-relaxed">
              Email: hello@leste.com
              <br />
              Phone: +1 (555) 000-0000
            </p>
          </div>
        </div>
        <div className="border-t border-stone/80 pt-8">
          <p className="text-muted text-sm text-center">
            © 2025 Leste. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
