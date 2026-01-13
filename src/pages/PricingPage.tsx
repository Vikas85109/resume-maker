import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Everything you need to create a professional resume',
      features: [
        { text: 'Access to all 10+ templates', included: true },
        { text: 'Real-time preview', included: true },
        { text: 'PDF download', included: true },
        { text: 'Auto-save to browser', included: true },
        { text: 'ATS-optimized templates', included: true },
        { text: 'Unlimited resumes', included: true },
        { text: 'No watermarks', included: true },
        { text: 'Mobile responsive editor', included: true },
      ],
      cta: 'Get Started Free',
      popular: true,
    },
    {
      name: 'Pro',
      price: '0',
      originalPrice: '499',
      description: 'Premium features for power users',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'AI content suggestions', included: true },
        { text: 'Custom color themes', included: true },
        { text: 'Multiple export formats', included: true },
        { text: 'Priority support', included: true },
        { text: 'Cover letter builder', included: true },
        { text: 'LinkedIn integration', included: true },
        { text: 'Analytics & tracking', included: true },
      ],
      cta: 'Coming Soon',
      comingSoon: true,
    },
  ];

  const faqs = [
    {
      question: 'Is CV Maker really free?',
      answer: 'Yes! CV Maker is completely free to use. You can create unlimited resumes, access all templates, and download PDFs without paying anything.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account required! Your data is stored locally in your browser. Simply start creating your resume right away.',
    },
    {
      question: 'Will there be watermarks on my resume?',
      answer: 'No watermarks ever. Your downloaded PDF will be clean and professional, ready for job applications.',
    },
    {
      question: 'Is my data safe?',
      answer: 'Your data never leaves your device. We use local storage to save your progress, ensuring complete privacy.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              100% Free - No Hidden Charges
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Simple, Transparent{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-lg text-slate-600">
              Create professional resumes without spending a penny. All features are completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-3xl p-8 ${
                  plan.popular
                    ? 'border-2 border-indigo-500 shadow-xl shadow-indigo-500/10'
                    : 'border border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-slate-800 text-white text-sm font-semibold px-4 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-slate-900">₹{plan.price}</span>
                    <span className="text-slate-500">/forever</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-slate-400 line-through text-sm mt-1">
                      ₹{plan.originalPrice}/month
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiCheck className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FiX className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.comingSoon ? (
                  <button
                    disabled
                    className="w-full py-4 bg-slate-100 text-slate-400 font-semibold rounded-xl cursor-not-allowed"
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link
                    to="/templates"
                    className="block w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-center shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-300"
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Everything you need to know about our pricing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Building Your Resume Today
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            No credit card required. No hidden fees. Just a beautiful resume.
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Create Resume Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
