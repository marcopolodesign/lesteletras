import React from 'react'
import { useProduct } from '../context/ProductContext'

export const ProductCard = ({ product }) => {
  const { openSidecart } = useProduct()

  return (
    <button
      onClick={() => openSidecart(product)}
      className="group bg-cream rounded-sm overflow-hidden hover:shadow-md transition-all duration-300 text-left border border-stone/80 hover:border-stone"
    >
      <div className="aspect-square bg-stone/30 overflow-hidden">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No image
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-ink mb-1 line-clamp-2 tracking-tight">
          {product.name}
        </h3>
        {product.series && (
          <p className="text-muted text-xs mb-2 uppercase tracking-wider">{product.series}</p>
        )}
        {product.price && (
          <p className="font-medium text-ink text-sm">
            {typeof product.price === 'string'
              ? product.price
              : `$${product.price?.toFixed(2)}`}
          </p>
        )}
        {product.stock !== undefined && (
          <p className={`text-xs mt-2 ${product.stock > 0 ? 'text-muted' : 'text-red-600/90'}`}>
            {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
          </p>
        )}
      </div>
    </button>
  )
}
