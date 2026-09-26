import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(false);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate frontend submission response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Hero Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold border border-[#2E7D32]/10">
          <Sparkles className="w-3.5 h-3.5" /> Customer Care & Support
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
          Get in Touch 🌱
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
          We’re here to help. Have a question about your order, products, or GreenBasket? Send us a message.
        </p>
      </div>

      {/* Main Content Grid: Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">
        
        {/* Contact Information Section (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#2E7D32]" />
              Contact Information
            </h2>

            <div className="space-y-5 text-xs sm:text-sm">
              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937]">Email Us</h3>
                  <a 
                    href="mailto:support@greenbasket.com" 
                    className="text-[#2E7D32] font-semibold hover:underline mt-0.5 block"
                  >
                    dharshuu2507@gmail.com
                  </a>
                  <p className="text-[11px] text-gray-400">Response within 24 hours</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937]">Call Us</h3>
                  <a 
                    href="tel:+919876543210" 
                    className="text-[#2E7D32] font-semibold hover:underline mt-0.5 block"
                  >
                    +91 9994411370
                  </a>
                  <p className="text-[11px] text-gray-400">Toll-free demo hotline</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937]">Location</h3>
                  <p className="text-gray-600 font-medium mt-0.5">
                    Coimbatore, Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1F2937]">Support Hours</h3>
                  <p className="text-gray-600 font-medium mt-0.5">
                    Monday – Saturday
                  </p>
                  <p className="text-[#2E7D32] font-semibold text-xs">
                    9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Micro Eco Banner */}
            <div className="p-4 rounded-2xl bg-[#1B4332] text-white space-y-1">
              <span className="text-xs font-bold text-[#8BC34A] flex items-center gap-1">
                🌱 Fast & Eco-Friendly Assistance
              </span>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Our support team is dedicated to helping you make sustainable choices.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Section (Right 3 Columns) */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">Send Us a Message</h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill out the form below and our eco support team will get back to you promptly.
              </p>
            </div>

            {/* Success Toast / Alert Banner */}
            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#2E7D32]/30 text-[#1B4332] text-xs font-bold flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-extrabold text-[#2E7D32]">Message sent successfully! 🌱</p>
                  <p className="font-medium text-gray-600 mt-0.5">We’ll get back to you soon.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className={`w-full px-4 py-3 bg-[#F8FAF8] border rounded-xl focus:outline-none transition-colors ${
                    errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#2E7D32]'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aarav@example.com"
                  className={`w-full px-4 py-3 bg-[#F8FAF8] border rounded-xl focus:outline-none transition-colors ${
                    errors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#2E7D32]'
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Question about my sustainable order"
                  className={`w-full px-4 py-3 bg-[#F8FAF8] border rounded-xl focus:outline-none transition-colors ${
                    errors.subject ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#2E7D32]'
                  }`}
                />
                {errors.subject && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className={`w-full px-4 py-3 bg-[#F8FAF8] border rounded-xl focus:outline-none transition-colors resize-y ${
                    errors.message ? 'border-red-400 bg-red-50/20' : 'border-gray-200 focus:border-[#2E7D32]'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-xs sm:text-sm font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
