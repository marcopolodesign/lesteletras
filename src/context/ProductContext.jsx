import React, { createContext, useState, useContext } from 'react'

const ProductContext = createContext()

export const ProductProvider = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isSidecartOpen, setIsSidecartOpen] = useState(false)

  const openSidecart = (product) => {
    setSelectedProduct(product)
    setIsSidecartOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeSidecart = () => {
    setIsSidecartOpen(false)
    document.body.style.overflow = 'unset'
    setTimeout(() => setSelectedProduct(null), 300)
  }

  return (
    <ProductContext.Provider
      value={{
        selectedProduct,
        isSidecartOpen,
        openSidecart,
        closeSidecart,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProduct must be used within ProductProvider')
  }
  return context
}
