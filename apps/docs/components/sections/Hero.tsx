import React from "react";
import CommandTerminal from "../ui/CommandTerminal";

const HeroSection = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-12 md:mt-16">
          <div className="text-center">
            <h1 className="xs:leading-tight text-4xl mt-8 md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text sm:leading-[1.2] dark:text-gray-300">
              The fastest way <br className="lg:hidden" />
              to build apps
              <br className="" /> for Next.js developer
            </h1>
            <p className="text-gray-700 mx-auto mb-0 text-lg lg:text-2xl lg:font-light">
              No more endless bugs and documentation
            </p>
          </div>

          <div className="w-full max-w-[400px] md:max-w-xl mx-auto">
            <CommandTerminal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
