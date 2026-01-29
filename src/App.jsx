import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProductProvider } from './context/ProductContext'
import { Header, Footer } from './components/layout'
import { ProductSidecart } from './components/ProductSidecart'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { About } from './pages/About'
import { Events } from './pages/Events'
import { Contact } from './pages/Contact'

function App() {
  return (
    <Router>
      <ProductProvider>
        <div className="flex flex-col min-h-screen bg-sand overflow-x-hidden">
          <main className="flex-1 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <ProductSidecart />
        </div>
      </ProductProvider>
    </Router>
  )
}

export default App
