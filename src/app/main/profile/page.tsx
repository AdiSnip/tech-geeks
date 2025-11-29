"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/userContext"; 
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface Location {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface ProfileFormData {
  name?: string;
  email?: string;
  location?: Location;
  profileImage?: string; // frontend state
  role?: string;
  companyName?: string;
  businessType?: string;
  industry?: string;
  website?: string;
  companyDescription?: string;
}

declare global {
  interface Window {
    cloudinary: {
      createUploadWidget: (
        options: {
          cloudName: string;
          uploadSignature?: string;
          uploadSignatureTimestamp?: number;
          apiKey?: string;
          folder?: string;
          cropping?: boolean;
          sources?: string[];
        },
        callback: (err: Error | null, result: { event?: string; info?: { secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({});

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
        setFormData({
          ...data,
          profileImage: data.profilePicture || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Unable to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setFormData({
        ...user,
        profileImage: user.profilePicture || "",
      });
      setLoading(false);
    } else {
      fetchUser();
    }
  }, [user, setUser]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1] as keyof Location;
      setFormData((prev) => ({
        ...prev,
        location: { ...(prev.location || {}), [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload profile image
  const handleImageUpload = async () => {
    if (!window.cloudinary) return toast.error("Cloudinary script not loaded.");

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const folderName = "profile_pics";

      const res = await fetch("/api/sign-cloudinary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paramsToSign: {
            folder: folderName,
            timestamp: timestamp.toString(),
            source: "uw",
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to get signature");
      }

      const { signature } = await res.json();

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          folder: folderName,
          cropping: true,
          sources: ["local", "url", "camera"],
          uploadSignature: signature,
          uploadSignatureTimestamp: timestamp,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
        },
        (err, result) => {
          if (err) return toast.error("Upload failed: " + err.message);

          if (result?.event === "success") {
            const imageUrl = result.info?.secure_url || "";
            setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
            toast.success("Profile picture uploaded!");
          }
        }
      );

      widget.open();
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as Error).message || "Error initializing upload.");
    }
  };

  // Submit profile (image + other fields)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload = {
        ...formData,
        profilePicture: formData.profileImage, // map frontend state to backend
      };

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, profileImage: updatedUser.profilePicture }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
      </div>
    );

  if (!user)
    return (
      <div className="p-8 text-center text-gray-500">
        No user data available.
      </div>
    );

  return (
    <div className="p-8 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow-md rounded-2xl"
      >
        {/* PROFILE PICTURE */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border">
            <Image
              src={formData.profileImage || "/image/user.png"}
              alt="Profile picture"
              fill
              className="object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleImageUpload}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <Upload className="w-4 h-4" /> Upload Picture
          </button>
        </div>

        {/* BASIC INFO */}
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email || ""}
              className="w-full border rounded-lg p-2 bg-gray-100"
              disabled
            />
          </div>
        </div>

        {/* LOCATION */}
        <div>
          <h2 className="text-xl font-semibold border-b pb-2 mt-6 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["address", "city", "state", "zipCode", "country"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  name={`location.${field}`}
                  value={formData.location?.[field as keyof Location] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ENTREPRENEUR/BUSINESS INFO */}
        {(user.role === "entrepreneur" || user.role === "admin") && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2 mt-6 mb-4">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["companyName", "businessType", "industry", "website"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    name={field}
                    value={(formData[field as keyof ProfileFormData] as string) || ""}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium">Company Description</label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                rows={4}
              />
            </div>
          </>
        )}

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={updating}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
