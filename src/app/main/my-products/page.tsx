"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/context/userContext";
import ProductCard from "@/components/card/ProductCard";
import ProductForm from "@/components/shared/ProductForm";

// Product type definition
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Fetch user's products
  const fetchProducts = async () => {
    if (!user?._id) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/product?owner=${user._id}`);
      
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load products when user is available
  useEffect(() => {
    if (user?._id) fetchProducts();
  }, [user?._id]);

  // Open form for creating new product
  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  // Open form for updating existing product
  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };
  
  // Handle product deletion
  const handleDelete = async (productId: string) => {
    if (!productId || !confirm("Are you sure you want to delete this product?")) {
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`/api/product?id=${productId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error("Failed to delete product");
      
      // Refresh products after successful deletion
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button
          onClick={handleCreate}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Loading state */}
      {loading && <p>Loading products...</p>}

      {/* Products grid */}
      {!loading && products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onUpdate={() => handleUpdate(product)}
              onDelete={() => handleDelete(product._id as string)}
            />
          ))}
        </div>
      ) : (
        !loading && <p>No products found.</p>
      )}

      {/* Product form modal */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          onClose={() => setIsFormOpen(false)}
          refreshProducts={fetchProducts}
        />
      )}
    </div>
  );
}
