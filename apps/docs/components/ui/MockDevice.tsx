import React from "react";

const MockDevice = () => {
  return (
    <div className="relative">
      {/* Mock Device Frame */}
      <div className="relative w-[280px] h-[580px] mx-auto bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
        {/* Screen Content */}
        <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
          <div className="flex justify-center items-center mt-3 gap-1">
            <div className="bg-black rounded-full relative w-2/5 h-6" />
          </div>
          {/* Mock App Interface */}
          <div className="h-14 bg-gray-50 border-b flex items-center px-4">
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
          <div className="p-4 space-y-4">
            <div className="w-full h-32 bg-gray-100 rounded-lg" />
            <div className="space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
              <div className="w-1/2 h-4 bg-gray-200 rounded" />
            </div>
            <div className="flex space-x-2 pt-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t px-6 flex justify-between items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDevice;
