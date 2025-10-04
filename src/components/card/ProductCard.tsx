"use client";

import Image from "next/image";
import React from "react";

// Simple product type
type Product = {
  _id?: string;
  owner: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  status: "active" | "draft" | "soldout";
};

// Props for the card component
interface ProductCardProps {
  product: Product;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ProductCard({ product, onUpdate, onDelete }: ProductCardProps) {
  // Simple status color mapping
  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "draft") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700"; // soldout
  };

  return (
    <div className="rounded shadow bg-white border p-0 overflow-hidden">
      {/* Product image */}
      <div className="relative w-full h-40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="300px"
        />
      </div>

      {/* Product details */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">{product.name}</h2>
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(product.status)}`}>
            {product.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-500">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={onUpdate}
            className="py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Update
          </button>
          <button
            onClick={onDelete}
            className="py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
