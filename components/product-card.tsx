"use client";

import { ProductData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";

export function ProductCard({ product }: { product: ProductData }) {
  return (
    <div className="bg-surface rounded-lg p-4 shadow-lg">
      <div className="flex gap-4">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-24 h-24 object-cover rounded"
          />
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
          <p className="text-sm text-gray-400 mb-2">{product.seller}</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-accent">{formatCurrency(product.price)}</span>
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            <span className="text-sm text-green-400">{product.discount}% OFF</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-sm text-gray-400">({product.ratingCount} ratings)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
