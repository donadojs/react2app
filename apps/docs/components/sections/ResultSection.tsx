import React from "react";
import ThoughtBubble from "../ui/ThoughtBubble/ThoughtBubble";

const Result = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 bg-gray-50">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="relative mx-auto w-80 h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-4">📦</div>
              <div className="text-2xl font-bold">
                Meanwhile, your product...
              </div>
              <div className="mt-8 space-y-3">
                <div className="text-md text-gray-600 hover:text-gray-500 transition-colors duration-200">
                  I'm not for Auth feature....
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
      <div className="space-y-8">
        <ThoughtBubble
          title="When to grow MAU....?"
          description="iOS, Android, React Native, Expo, Flutter... just when you think you've learned enough, there's always more."
          emoji="😫"
          dotCurve="down"
          dotDirection="left"
        />

        <ThoughtBubble
          title="When to do marketing.. instead of fixing endless bugs? "
          description="Build... test... fix... build again... test again... and the cycle never ends. Even small changes take forever."
          emoji="🔄"
          dotDirection="left"
        />

        <ThoughtBubble
          title="When does `REAL killer feature` are delivered instead of boring basic stuff?"
          description="Different codebases for iOS and Android. Double the work, double the bugs, double the headaches."
          emoji="🤯"
          dotDirection="left"
        />

        <ThoughtBubble
          title="..."
          description="Months of development before seeing the first result. Deadlines approaching while you're still fighting with native APIs."
          emoji="⏰"
          dotDirection="left"
        />
      </div>
    </div>
  </div>
);

export default Result;
