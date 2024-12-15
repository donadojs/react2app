import React from "react";

const TextSection = () => {
  return (
    <div className="md:text-center mx-auto mt-[400px]">
      <h2 className="text-[72px] md:text-[100px] leading-[1] font-extrabold tracking-tight text-black mb-8 uppercase">
        Use Next.js <br />
        to build your app <br />
        <span className="text-[90px] md:text-[200px] text-slate-500 font-black">
          Faster
        </span>
      </h2>

      <p className="text-[18px] md:text-[24px] text-slate-500 italic mt-4 md:mt-10">
        * Skip the <span>"App-related"</span> headaches. Start building what
        matters.
      </p>
    </div>
  );
};

export default TextSection;
