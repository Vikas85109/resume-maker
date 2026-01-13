import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiZap, FiShield, FiDownload, FiLayout, FiEdit3, FiStar } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: FiLayout,
      title: 'Professional Templates',
      description: 'Choose from 10+ beautifully designed templates crafted by experts for every industry.',
    },
    {
      icon: FiEdit3,
      title: 'Easy to Customize',
      description: 'Simply fill in your details and watch your resume come to life in real-time.',
    },
    {
      icon: FiZap,
      title: 'ATS Optimized',
      description: 'Our templates are designed to pass Applicant Tracking Systems with flying colors.',
    },
    {
      icon: FiDownload,
      title: 'PDF Export',
      description: 'Download your polished resume as a high-quality PDF ready for applications.',
    },
    {
      icon: FiShield,
      title: 'Data Privacy',
      description: 'Your data stays on your device. We never store your personal information.',
    },
    {
      icon: FiStar,
      title: '100% Free',
      description: 'Create unlimited resumes without any hidden costs or credit card required.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose a Template',
      description: 'Browse our collection of professional templates and pick the one that suits your style.',
    },
    {
      number: '02',
      title: 'Fill Your Details',
      description: 'Enter your information using our intuitive step-by-step form with real-time preview.',
    },
    {
      number: '03',
      title: 'Download PDF',
      description: 'Export your polished resume as a high-quality PDF and start applying for jobs.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Developer',
      content: 'CV Maker helped me create a stunning resume in just 10 minutes. I got 3 interview calls within a week!',
      avatar: 'PS',
    },
    {
      name: 'Rahul Patel',
      role: 'Marketing Manager',
      content: 'The templates are modern and ATS-friendly. Best free resume builder I have ever used.',
      avatar: 'RP',
    },
    {
      name: 'Anjali Verma',
      role: 'Fresh Graduate',
      content: 'As a fresher, I was struggling with my resume. This tool made it so easy and professional!',
      avatar: 'AV',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Resumes Created' },
    { value: '10+', label: 'Templates' },
    { value: '100%', label: 'Free Forever' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Free Forever - No Sign Up Required
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Create Your Perfect
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Resume in Minutes
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Build a professional resume that gets you noticed. Choose from stunning templates,
                customize easily, and download as PDF - all for free.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/templates"
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Create My Resume
                </Link>
                <Link
                  to="/templates"
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300"
                >
                  View Templates
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FiCheck className="text-green-500" />
                  <span>No Sign Up</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FiCheck className="text-green-500" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FiCheck className="text-green-500" />
                  <span>ATS Friendly</span>
                </div>
              </div>
            </div>

            {/* Right Content - Resume Preview */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-72 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl transform -rotate-6"></div>
                <div className="absolute -bottom-4 -right-4 w-72 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl transform rotate-6"></div>

                {/* Main Preview Card */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="space-y-4">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-48 bg-slate-100 rounded"></div>
                    <div className="border-t border-slate-100 pt-4">
                      <div className="h-3 w-20 bg-indigo-100 rounded mb-2"></div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-slate-100 rounded"></div>
                        <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                        <div className="h-2 w-4/6 bg-slate-100 rounded"></div>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <div className="h-3 w-24 bg-indigo-100 rounded mb-2"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-6 w-16 bg-indigo-50 rounded-full"></div>
                        <div className="h-6 w-20 bg-indigo-50 rounded-full"></div>
                        <div className="h-6 w-14 bg-indigo-50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Build a Great Resume
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our powerful features make it easy to create professional resumes that stand out.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Create Your Resume in 3 Simple Steps
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our streamlined process makes resume creation quick and effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200"></div>
                )}

                <div className="relative bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-indigo-200 transition-colors duration-300 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Started Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by Job Seekers
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See what our users have to say about their experience with CV Maker.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Create a professional resume that gets you noticed. It's free and takes just minutes.
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Create My Resume Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
