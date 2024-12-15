import React from "react";
import ThoughtBubble from "../ui/ThoughtBubble/ThoughtBubble";

const PainPoints = () => (
  <div className="py-40 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
      <div className="text-center max-w-3xl mx-auto mb-32">
        <h2 className="text-5xl font-bold tracking-normal text-black mb-8 mt-64">
          <br /> Because.... <br />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <ThoughtBubble
            title="The Never-ending Learning Curve"
            description="Too many mobile frameworks to learn! iOS, Android, React Native and more."
            emoji="😩"
            dotCurve="down"
          />

          <ThoughtBubble
            title="Build, Test, Repeat... Forever"
            description="Endless cycle of building and testing. Small changes take ages."
            emoji="🔄"
          />

          <ThoughtBubble
            title="Platform Fragmentation"
            description="Separate iOS and Android codebases mean double the work and bugs."
            emoji="🤯"
          />

          <ThoughtBubble
            title="Time is Never Enough"
            description="Long development cycles while battling native APIs and deadlines."
            emoji="⏰"
          />
        </div>

        <div className="relative">
          <div className="relative mx-auto w-80 h-80">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-4">😩</div>
                <div className="text-2xl font-bold">
                  Meanwhile, developers...
                </div>
                <div className="mt-8 space-y-3">
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Reading documentation... 📚
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Debugging endlessly... 🔍
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Building and rebuilding... 🏗️
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Stack Overflow searching... 🔎
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Coffee overdosing... ☕
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Missing deadlines... ⏰
                  </div>
                  <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                    Starting over... 🔄
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PainPoints;
