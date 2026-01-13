import React from 'react';
import { FiTarget, FiHeart, FiUsers, FiAward } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To empower job seekers worldwide with professional tools to create stunning resumes that help them land their dream jobs.',
    },
    {
      icon: FiHeart,
      title: 'User First',
      description: 'Everything we build is designed with our users in mind. Simple, intuitive, and effective.',
    },
    {
      icon: FiUsers,
      title: 'Accessibility',
      description: 'We believe everyone deserves access to professional resume tools, which is why CV Maker is free.',
    },
    {
      icon: FiAward,
      title: 'Quality',
      description: 'Our templates are crafted by professional designers to ensure your resume stands out.',
    },
  ];

  const team = [
    { name: 'Rahul Sharma', role: 'Founder & CEO', avatar: 'RS' },
    { name: 'Priya Patel', role: 'Head of Design', avatar: 'PP' },
    { name: 'Amit Kumar', role: 'Lead Developer', avatar: 'AK' },
    { name: 'Neha Gupta', role: 'Product Manager', avatar: 'NG' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">CV Maker</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              We're on a mission to help job seekers create professional resumes that open doors
              to new opportunities. Our platform is designed to be simple, powerful, and completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  CV Maker was born from a simple observation: creating a professional resume shouldn't
                  be complicated or expensive. Too many talented individuals miss out on opportunities
                  because they don't have access to professional resume tools.
                </p>
                <p>
                  We started with a vision to democratize resume creation. Our team of designers and
                  developers worked tirelessly to create a platform that combines beautiful design with
                  ease of use.
                </p>
                <p>
                  Today, CV Maker has helped thousands of job seekers create stunning resumes that
                  have landed them interviews and jobs at top companies worldwide.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-indigo-600">50K+</div>
                    <div className="text-slate-600 mt-1">Resumes Created</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-purple-600">10+</div>
                    <div className="text-slate-600 mt-1">Templates</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-indigo-600">100%</div>
                    <div className="text-slate-600 mt-1">Free</div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl font-bold text-purple-600">4.9</div>
                    <div className="text-slate-600 mt-1">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do at CV Maker.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The passionate people behind CV Maker who work tirelessly to help you succeed.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <span className="text-3xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                <p className="text-slate-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Create Your Resume?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of job seekers who have created their perfect resume with CV Maker.
          </p>
          <a
            href="/templates"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Started Free
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
