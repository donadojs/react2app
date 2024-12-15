import React from "react";
import Feature1 from "./features/Feature1";
import Feature2 from "./features/Feature2";
import Feature3 from "./features/Feature3";
import Feature4 from "./features/Feature4";

const FeatureSection = () => {
  return (
    <div className="md:text-center mx-auto mt-[400px]">
      <h2 className="text-[72px] md:text-[100px] leading-[1] font-extrabold tracking-tight text-black md:mb-8 uppercase">
        These are <br />
        all you need:
      </h2>
      <Feature1 />
      <Feature2 />
      <Feature3 />
      <Feature4 />
    </div>
  );
};

export default FeatureSection;
