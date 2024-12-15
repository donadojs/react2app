import React from "react";
import { Check } from "lucide-react";

const features = {
  community: [
    "CLI tools provided",
    "Basic templates (DIY)",
    "Development server support",
    "Team sharing features",
  ],
  standard: [
    "All Community features",
    "Rocket Kit templates",
    "Onboarding pages",
    "Social login (Apple, Google)",
    "Payment system integration",
    "Bottom sheets, modals, toasts",
    "Screen transition animations",
  ],
  business: [
    "All Standard features",
    "One-on-one technical support",
    "Custom template creation",
    "Priority bug fixes",
    "Dedicated Slack channel",
    "Direct access to development team",
  ],
};

const Pricing = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-600">Choose the plan that fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Community Plan */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Community</h3>
            <p className="text-gray-600 mb-6">
              Perfect for individual projects
            </p>
            <p className="text-4xl font-bold mb-8">
              $0{" "}
              <span className="text-lg font-normal text-gray-600">
                /forever
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.community.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 mr-3" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Standard Plan */}
          <div className="bg-white p-8 rounded-lg border-2 border-black relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-black text-white px-4 py-1 text-sm rounded-full">
                POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Standard</h3>
            <p className="text-gray-600 mb-6">For startups and small teams</p>
            <p className="text-4xl font-bold mb-8">
              $199{" "}
              <span className="text-lg font-normal text-gray-600">
                /one-time
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.standard.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 mr-3" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>

          {/* Business Plan */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-4">Business</h3>
            <p className="text-gray-600 mb-6">
              For larger teams and enterprises
            </p>
            <p className="text-4xl font-bold mb-8">
              $999{" "}
              <span className="text-lg font-normal text-gray-600">
                /one-time
              </span>
            </p>
            <ul className="space-y-4 mb-8">
              {features.business.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 mr-3" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
