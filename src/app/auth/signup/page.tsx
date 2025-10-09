'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, User, MapPin, Briefcase, Users, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useUser } from '@/context/userContext';

// ----------------- Interfaces -----------------
interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'entrepreneur';
  location: Location;
  businessType?: string;
  companyName?: string;
  companyDescription?: string;
  website?: string;
  industry?: string;
}

type FormErrors = Partial<Record<keyof FormData | keyof Location, string>>;

interface Status {
  type: 'success' | 'error' | '';
  message: string;
}

const businessOptions = [
  { value: 'Handicrafts', label: 'Handicrafts & Art' },
  { value: 'FoodProcessing', label: 'Food Processing & Edibles' },
  { value: 'Textiles', label: 'Textiles & Apparel' },
  { value: 'Agriculture', label: 'Agriculture Products' },
  { value: 'Services', label: 'Local Services' },
  { value: 'Other', label: 'Other' },
];

const roleOptions = [
  { value: 'user', label: 'User (Marketplace Access)' },
  { value: 'entrepreneur', label: 'Entrepreneur (Sell & Manage Business)' },
];

// ----------------- Reusable Field Component -----------------
const FormField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  icon?: React.FC<{ size?: number; className?: string }>;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
}> = ({ label, name, value, onChange, error, type = 'text', icon: Icon, isSelect = false, options = [] }) => (
  <div>
    <label className="text-gray-700 font-medium mb-1 flex items-center">
      {Icon && <Icon size={16} className="mr-2" />}
      {label} <span className="text-red-500 ml-1">*</span>
    </label>
    {isSelect ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    )}
    {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
  </div>
);

// ----------------- Main Component -----------------
const SignupPage: React.FC = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    businessType: 'Handicrafts',
    companyName: '',
    companyDescription: '',
    website: '',
    industry: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>({ type: '', message: '' });

  // --------------- Handlers ---------------
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested location keys
    if (['address', 'city', 'state', 'zipCode', 'country'].includes(name)) {
      setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    const loc = formData.location;
    ['address', 'city', 'state', 'zipCode', 'country'].forEach((key) => {
      if (!loc[key as keyof Location]?.trim()) newErrors[key as keyof Location] = 'Required';
    });

    if (formData.role === 'entrepreneur') {
      if (!formData.companyName?.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.industry?.trim()) newErrors.industry = 'Industry is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please fix the errors and try again.' });
      return;
    }

    try {
      const endpoint =
        formData.role === 'entrepreneur'
          ? '/api/auth/signup-entrepreneur'
          : '/api/auth/signup-user';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Signup failed');

      setStatus({ type: 'success', message: 'Signup successful! Redirecting...' });

      const userRes = await fetch('/api/user', { credentials: 'include' });
      const userData = await userRes.json();
      if (userRes.ok) {
        setUser(userData);
        router.push('/main/dashboard');
      } else {
        router.push('/auth/login');
      }

    } catch (err) {
      setStatus({ type: 'error', message: (err as Error).message });
    }
  };

  // --------------- JSX ---------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg border border-green-400 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Create Your Account</h1>

        {status.message && (
          <div className={`p-3 rounded-lg font-medium flex items-center ${status.type === 'success' ? 'bg-green-100 text-green-700 border border-green-500' : 'bg-red-100 text-red-700 border border-red-500'}`}>
            {status.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={User} error={errors.name} />
            <FormField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} icon={Mail} error={errors.email} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} icon={Lock} error={errors.password} />
            <FormField label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} icon={Lock} error={errors.confirmPassword} />
          </div>

          {/* Role */}
          <FormField label="Signup as" name="role" value={formData.role} onChange={handleChange} icon={Users} isSelect options={roleOptions} />

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Address" name="address" value={formData.location.address} onChange={handleChange} icon={MapPin} error={errors.address} />
            <FormField label="City" name="city" value={formData.location.city} onChange={handleChange} error={errors.city} />
            <FormField label="State" name="state" value={formData.location.state} onChange={handleChange} error={errors.state} />
            <FormField label="ZIP Code" name="zipCode" value={formData.location.zipCode} onChange={handleChange} error={errors.zipCode} />
            <FormField label="Country" name="country" value={formData.location.country} onChange={handleChange} error={errors.country} />
          </div>

          {/* Entrepreneur-specific */}
          {formData.role === 'entrepreneur' && (
            <div className="border-t pt-4 space-y-4">
              <FormField label="Business Type" name="businessType" value={formData.businessType || ''} onChange={handleChange} icon={Briefcase} isSelect options={businessOptions} />
              <FormField label="Company Name" name="companyName" value={formData.companyName || ''} onChange={handleChange} icon={Briefcase} error={errors.companyName} />
              <FormField label="Industry" name="industry" value={formData.industry || ''} onChange={handleChange} error={errors.industry} />
              <FormField label="Company Description" name="companyDescription" value={formData.companyDescription || ''} onChange={handleChange} />
              <FormField label="Website" name="website" value={formData.website || ''} onChange={handleChange} />
            </div>
          )}

          <button type="submit" className="w-full py-3 mt-4 font-bold text-lg rounded-xl bg-green-500 text-white hover:shadow-xl transition transform hover:scale-[1.02]">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/auth/login" className="text-blue-600 font-semibold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
