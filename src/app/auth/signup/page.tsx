'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mail, Lock, User, MapPin, Briefcase, Users, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useUser } from '@/context/userContext';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
  businessType: string;
  role: 'entrepreneur' | 'mentor';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
  businessType?: string;
  role?: string;
}

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
  { value: 'entrepreneur', label: 'Entrepreneur (Selling products & seeking help)' },
  { value: 'mentor', label: 'Mentor (Offering advice & guidance)' },
];

// --- FormField Component ---
const FormField: React.FC<{
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  type?: string;
  icon?: React.FC<{ size?: number; className?: string }>;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  description?: string;
}> = ({ label, name, value, onChange, error, type = 'text', icon: Icon, isSelect = false, options = [], description }) => (
  <div className="mb-4">
    <label className="text-gray-700 font-medium mb-1 flex items-center">
      {Icon && <Icon size={16} className="mr-2" />}
      {label} <span className="text-red-500 ml-1">*</span>
    </label>

    {isSelect ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition text-gray-800 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition text-gray-800 ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    )}

    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
  </div>
);

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    businessType: 'Handicrafts',
    role: 'entrepreneur',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>({ type: '', message: '' });
  const { setUser } = useUser();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setStatus({ type: '', message: '' });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Please enter your full name';
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formData.email.match(emailPattern)) newErrors.email = 'Please enter a valid email address';
    if (formData.password.length < 8) newErrors.password = 'Password should be at least 8 characters long';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.location.trim()) newErrors.location = 'Please enter your location';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ type: 'error', message: 'Please check the form for errors and try again' });
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include', // ✅ Send and receive cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || 'Signup failed' });
        return;
      }

      // Optional: auto-login by fetching user
      const userRes = await fetch('/api/user', { credentials: 'include' });
      const userData = await userRes.json();

      if (userRes.ok && userData) {
        setUser(userData);
        router.push('/main/dashboard');
      } else {
        router.push('/auth/login');
      }

    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg p-6 sm:p-10 bg-white rounded-xl shadow-lg space-y-6 border border-green-500">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Join the Network</h1>
          <p className="text-gray-500">Create your account to access the marketplace, mentorship, and learning modules.</p>
        </div>

        {status.message && (
          <div className={`flex items-center p-3 rounded-lg font-medium ${status.type === 'success' ? 'bg-teal-100 text-teal-700 border border-teal-500' : 'bg-red-100 text-red-700 border border-red-500'}`}>
            {status.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" name="name" icon={User} value={formData.name} onChange={handleChange} error={errors.name} />
            <FormField label="Email" name="email" icon={Mail} type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Password" name="password" icon={Lock} type="password" description="Minimum 8 characters" value={formData.password} onChange={handleChange} error={errors.password} />
            <FormField label="Confirm Password" name="confirmPassword" icon={Lock} type="password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Location" name="location" icon={MapPin} value={formData.location} onChange={handleChange} error={errors.location} />
            <FormField label="Business Type" name="businessType" icon={Briefcase} isSelect options={businessOptions} value={formData.businessType} onChange={handleChange} />
          </div>
          <FormField label="I am signing up as" name="role" icon={Users} isSelect options={roleOptions} value={formData.role} onChange={handleChange} description="Select 'Mentor' if offering expertise" />

          <button type="submit" className="w-full py-3 mt-4 font-bold text-lg rounded-xl bg-green-500 text-white shadow-lg hover:shadow-xl transition transform hover:scale-[1.01]">
            Start Your Journey
          </button>
        </form>

        <div className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{' '}
          <a href="/auth/login" className="font-semibold text-blue-600">Log in here</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
