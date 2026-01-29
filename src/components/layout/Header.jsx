import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../ui'

export const Header = () => {
  return (
    <header className="border-b border-stone/80 bg-cream sticky top-0 z-50 backdrop-blur-sm">
      <Container className="flex items-center justify-between py-5">
        <Link to="/" className="no-underline">
          <h1 className="font-serif text-2xl font-semibold text-ink tracking-tight">Leste</h1>
        </Link>
        <nav>
          <ul className="flex gap-8 list-none">
            <li>
              <Link
                to="/"
                className="text-ink hover:text-muted no-underline text-sm font-medium tracking-wide"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-ink hover:text-muted no-underline text-sm font-medium tracking-wide"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="text-ink hover:text-muted no-underline text-sm font-medium tracking-wide"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-ink hover:text-muted no-underline text-sm font-medium tracking-wide"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-ink hover:text-muted no-underline text-sm font-medium tracking-wide"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}
