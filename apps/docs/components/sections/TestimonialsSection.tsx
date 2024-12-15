import React from "react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechStart",
    content:
      "Next2App cut our app development time in half. We were able to launch on both iOS and Android within weeks.",
    company: "TechStart Inc.",
  },
  {
    name: "Michael Brown",
    role: "Lead Developer",
    content:
      "The development experience is seamless. It's exactly what web developers need for building mobile apps.",
    company: "Digital Solutions",
  },
  {
    name: "Emma Wilson",
    role: "Founder",
    content:
      "This tool saved our startup countless hours and resources. The templates are professional and customizable.",
    company: "AppWorks",
  },
];

const Testimonials = () => {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <h2 className="text-3xl font-bold text-center mb-16">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 p-8 rounded-lg">
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-gray-600">{testimonial.role}</p>
                <p className="text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
