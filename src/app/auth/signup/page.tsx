'use client';

// Import necessary React components and icons
import React, { useState, ChangeEvent, FormEvent} from 'react';
import { 
  Mail,      // Email icon
  Lock,      // Password icon
  User,      // User icon
  MapPin,    // Location icon
  Briefcase, // Business icon
  Users,     // Role icon
  CheckCircle,// Success icon
  AlertTriangle // Error icon
} from 'lucide-react';


// Define the structure of our form data
interface FormData {
  name: string;            // User's full name
  email: string;          // User's email address
  password: string;       // User's password
  confirmPassword: string;// Password confirmation
  location: string;      // User's location
  businessType: string;  // Type of business
  role: 'entrepreneur' | 'mentor'; // User role - either entrepreneur or mentor
}

// Define possible form validation errors
interface FormErrors {
  name?: string;         // Name field error message
  email?: string;       // Email field error message
  password?: string;    // Password field error message
  confirmPassword?: string; // Confirm password field error message
  location?: string;    // Location field error message
  businessType?: string;// Business type field error message
  role?: string;       // Role field error message
}

// Define the status message structure
interface Status {
  type: 'success' | 'error' | ''; // Type of status message
  message: string;               // The actual message to display
}

// --- Form Field Component ---
const FormField: React.FC<{
  label: string;
  name: keyof FormData;
  value: string | 'entrepreneur' | 'mentor';
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
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition text-gray-800 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
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
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 transition text-gray-800 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
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

  // Available business types that users can select from
  const businessOptions = [
    { value: 'Handicrafts', label: 'Handicrafts & Art' },          // For artisans and craftspeople
    { value: 'FoodProcessing', label: 'Food Processing & Edibles' },// For food-based businesses
    { value: 'Textiles', label: 'Textiles & Apparel' },           // For clothing and fabric businesses
    { value: 'Agriculture', label: 'Agriculture Products' },       // For farming and agriculture
    { value: 'Services', label: 'Local Services' },               // For service-based businesses
    { value: 'Other', label: 'Other' },                          // For other business types
  ];

  // User role options - entrepreneur or mentor
  const roleOptions = [
    { 
      value: 'entrepreneur', 
      label: 'Entrepreneur (Selling products & seeking help)' // For those who want to sell products
    },
    { 
      value: 'mentor', 
      label: 'Mentor (Offering advice & guidance)' // For those who want to help others
    },
  ];

  // Handle changes in form fields
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update the form data with the new value
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any previous error for this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
    
    // Clear any previous status message
    setStatus({ type: '', message: '' });
  };

    // Validate form data and return true if all fields are valid
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Check if name is provided
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    
    // Check if email is valid using a simple regex pattern
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formData.email.match(emailPattern)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
    }
    
    // Check password requirements
    if (formData.password.length < 8) {
      newErrors.password = 'Password should be at least 8 characters long';
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'The passwords you entered do not match';
    }
    
    // Check if location is provided
    if (!formData.location.trim()) {
      newErrors.location = 'Please enter your location';
    }

    // Update the errors state with any validation errors
    setErrors(newErrors);
    
    // Return true if there are no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignup = async (e: FormEvent) => {

    // Prevent the form from submitting normally
    e.preventDefault();
    
    // Clear any previous status message
    setStatus({ type: '', message: '' });

    // Validate all form fields
    if (!validate()) {
      setStatus({ 
        type: 'error', 
        message: 'Please check the form for errors and try again'
      });
      return;
    }

    try {
      // Send signup request to the server
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // Parse the response data
      const data = await response.json();

      // Check if the request was successful
      if (!response.ok) {
        setStatus({ 
          type: 'error', 
          message: data.error || 'Failed to create account'
        });
        return;
      }

      // Show success message
      setStatus({ 
        type: 'success', 
        message: data.message || 'Your account has been created successfully!'
      });
      
      // Clear sensitive data from the form
      setFormData(prev => ({ 
        ...prev, 
        password: '', 
        confirmPassword: '' 
      }));

      // Redirect to login page after successful signup
      // Navigate to the dashboard after successful signup
      window.location.href = '/auth/login';
      
    } catch {
      // Show error message if something goes wrong
      setStatus({ 
        type: 'error', 
        message: 'Sorry, we couldn\'t create your account. Please try again.'
      });
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
          <div
            className={`flex items-center p-3 rounded-lg font-medium ${
              status.type === 'success' ? 'bg-teal-100 text-teal-700 border border-teal-500' : 'bg-red-100 text-red-700 border border-red-500'
            }`}
          >
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
            <FormField label="Business Type" name="businessType" icon={Briefcase} isSelect options={businessOptions} value={formData.businessType} onChange={handleChange} error={errors.businessType} />
          </div>
          <FormField label="I am signing up as" name="role" icon={Users} isSelect options={roleOptions} description="Select 'Mentor' if offering expertise" value={formData.role} onChange={handleChange} error={errors.role} />

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
