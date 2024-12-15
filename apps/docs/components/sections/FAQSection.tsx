import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How is Next2App different from React Native?",
    answer:
      "Next2App allows you to use your existing Next.js knowledge without learning a new framework. It provides native app functionality while maintaining the familiar Next.js development experience.",
  },
  {
    question: "Do I need iOS/Android development experience?",
    answer:
      "No, you don't need any mobile development experience. If you know Next.js, you can build mobile apps with Next2App.",
  },
  {
    question: "Can I use my existing Next.js components?",
    answer:
      "Yes, most Next.js components will work out of the box. Some might need minor adjustments for mobile optimization.",
  },
  {
    question:
      "What do I need to do to deploy my app to App Store and Play Store?",
    answer:
      "To deploy an app, there are inevitable steps you need to follow due to Apple and Google policies. After building your app with a command we provides, you'll just need to follow our documentation for app store submission guidelines and requirements.",
  },
];

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="py-6 w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </button>
      {isOpen && <div className="pb-6 text-gray-600">{answer}</div>}
    </div>
  );
};

const FAQSection = () => {
  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-2">
        <h2 className="text-3xl font-bold text-center mb-16">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQ key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
