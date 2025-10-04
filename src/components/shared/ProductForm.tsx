"use client";

import React, { useState, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useUser } from "@/context/userContext";
import Image from "next/image";

// Simple Product type
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

// Props for the form
interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  refreshProducts: () => void;
}

export default function ProductForm({
  product,
  onClose,
  refreshProducts,
}: ProductFormProps) {
  const { user } = useUser();
  
  // Form state with default values
  const [form, setForm] = useState<Product>({
    _id: product?._id,
    owner: product?.owner || user?._id || "", // Get owner from user context
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    imageUrl: product?.imageUrl || "",
    status: product?.status || "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        _id: product._id,
        owner: product.owner,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        status: product.status,
      });
    }
  }, [product]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle image upload
  const handleUpload = (result: { info?: { secure_url?: string } }) => {
    if (result?.info?.secure_url) {
      setForm((prev) => ({ ...prev, imageUrl: result.info?.secure_url || "" }));
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const method = form._id ? "PUT" : "POST";
      const res = await fetch("/api/product", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      refreshProducts();
      onClose();
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {product ? "Update Product" : "Create New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2 h-20"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium">Price ($)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
              min={0}
              step="0.01"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium">Category</label>
            <input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Image Upload */}
          <div className="border border-dashed p-3 rounded">
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <CldUploadWidget
              uploadPreset="product"
              signatureEndpoint="/api/sign-cloudinary"
              onSuccess={(results) => {
                const info = results?.info;
                if (info && typeof info !== 'string' && 'secure_url' in info) {
                  setForm((prev) => ({ ...prev, imageUrl: info.secure_url || "" }));
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {form.imageUrl ? "Change Image" : "Upload Image"}
                </button>
              )}
            </CldUploadWidget>

            {form.imageUrl && (
              <div className="mt-2 h-32 rounded overflow-hidden relative">
                <Image
                  src={form.imageUrl}
                  alt="Product"
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="soldout">Sold Out</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}