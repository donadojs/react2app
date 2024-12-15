import React from "react";
import { Check } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
}

interface FeatureProps {
  title: string;
  description: string;
  features: FeatureItem[];
  codeSnippet?: string;
  leftSide?: JSX.Element;
  rightSide?: boolean;
}

const Feature = ({
  title,
  description,
  features,
  codeSnippet,
  leftSide,
  rightSide = false,
}: FeatureProps) => {
  const content = (
    <div className="text-left">
      <h2 className="text-4xl font-bold mb-8 text-gray-900">{title}</h2>

      {codeSnippet && (
        <div className="rounded-lg mb-8 font-mono text-sm overflow-x-auto">
          <pre className="whitespace-pre bg-black text-white p-4 rounded-lg">
            <code
              className="leading-loose"
              dangerouslySetInnerHTML={{ __html: codeSnippet }}
            />
          </pre>
        </div>
      )}

      <p className="text-gray-600 mb-8 text-lg">{description}</p>

      <ul className="space-y-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="flex-shrink-0 p-1">
              <Check className="w-6 h-6 text-black" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 my-20 md:my-60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {rightSide ? (
          <>
            {content}
            {leftSide}
          </>
        ) : (
          <>
            {leftSide}
            {content}
          </>
        )}
      </div>
    </div>
  );
};

export default Feature;
