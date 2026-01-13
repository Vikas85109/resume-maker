import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create a resume?',
          answer: 'Creating a resume is simple! Click on "Create Resume Free" or go to Templates, select a template you like, fill in your details using our step-by-step form, and download your resume as a PDF.',
        },
        {
          question: 'Do I need to create an account?',
          answer: 'No! CV Maker works without any account or sign-up. Your data is stored locally in your browser, so you can start creating your resume immediately.',
        },
        {
          question: 'Is CV Maker really free?',
          answer: 'Yes, CV Maker is 100% free. You can access all templates, create unlimited resumes, and download PDFs without any charges or hidden fees.',
        },
      ],
    },
    {
      title: 'Templates & Design',
      faqs: [
        {
          question: 'How many templates are available?',
          answer: 'We offer 10+ professionally designed templates, including ATS-friendly, modern, creative, and classic styles suitable for various industries and experience levels.',
        },
        {
          question: 'Are the templates ATS-friendly?',
          answer: 'Yes! Most of our templates are optimized for Applicant Tracking Systems (ATS). We specifically mark ATS-friendly templates so you can make an informed choice.',
        },
        {
          question: 'Can I customize the templates?',
          answer: 'Currently, you can fill in your own content which updates in real-time. We are working on adding more customization options like colors and fonts in future updates.',
        },
      ],
    },
    {
      title: 'Data & Privacy',
      faqs: [
        {
          question: 'Where is my data stored?',
          answer: 'Your resume data is stored locally in your browser\'s localStorage. It never leaves your device, ensuring complete privacy and security.',
        },
        {
          question: 'Is my information secure?',
          answer: 'Absolutely. Since we don\'t have a backend server storing your data, there\'s no risk of data breaches. Everything stays on your local device.',
        },
        {
          question: 'Will my data be saved if I close the browser?',
          answer: 'Yes! Your progress is automatically saved to your browser\'s local storage. When you return, you can continue from where you left off.',
        },
        {
          question: 'How do I delete my data?',
          answer: 'You can clear your resume data by clicking the "Reset" button in the editor, or by clearing your browser\'s local storage for this site.',
        },
      ],
    },
    {
      title: 'Download & Export',
      faqs: [
        {
          question: 'What format can I download my resume in?',
          answer: 'Currently, you can download your resume as a high-quality PDF file, which is the most widely accepted format for job applications.',
        },
        {
          question: 'Will there be a watermark on my resume?',
          answer: 'No! Your downloaded PDF will be clean and professional, without any watermarks or branding.',
        },
        {
          question: 'Can I edit my resume after downloading?',
          answer: 'Yes! Your resume data stays in your browser. You can make changes anytime and download a new PDF.',
        },
      ],
    },
    {
      title: 'Technical Issues',
      faqs: [
        {
          question: 'The PDF download is not working. What should I do?',
          answer: 'Try refreshing the page and attempting the download again. Make sure you\'re using a modern browser like Chrome, Firefox, or Edge. If the issue persists, try clearing your browser cache.',
        },
        {
          question: 'My resume preview is not showing correctly.',
          answer: 'This might happen due to browser caching. Try refreshing the page (Ctrl+F5) or clearing your browser cache. If the issue continues, try using a different browser.',
        },
        {
          question: 'Which browsers are supported?',
          answer: 'CV Maker works best on modern browsers including Google Chrome, Mozilla Firefox, Microsoft Edge, and Safari. We recommend keeping your browser updated for the best experience.',
        },
      ],
    },
  ];

  const allFaqs = categories.flatMap((cat) => cat.faqs);
  const filteredFaqs = searchQuery
    ? allFaqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Find answers to common questions about CV Maker. Can't find what you're looking for?
              Contact our support team.
            </p>

            {/* Search Box */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs ? (
            // Search Results
            <div className="space-y-4">
              <p className="text-slate-600 mb-6">
                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-slate-50 p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600 mb-4">No results found. Try a different search term.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Category View
            <div className="space-y-12">
              {categories.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.title}</h2>
                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = categories
                        .slice(0, catIndex)
                        .reduce((acc, cat) => acc + cat.faqs.length, 0) + faqIndex;

                      return (
                        <div
                          key={faqIndex}
                          className="bg-slate-50 rounded-2xl overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                            className="w-full flex items-center justify-between p-6 text-left"
                          >
                            <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                            <FiChevronDown
                              className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-200 ${
                                openIndex === globalIndex ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                          {openIndex === globalIndex && (
                            <div className="px-6 pb-6">
                              <p className="text-slate-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h2>
          <p className="text-slate-600 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
          >
            Contact Support
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
