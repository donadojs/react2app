import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import TypewriterText from "./TypewriterText";

const commands = [
  {
    cmd: "npx next2app dev",
    response: ["🚀 Server running at http://localhost:3000"],
  },
  {
    cmd: "npx next2app build",
    response: ["📦 Build completed successfully!(aab, ipa)"],
  },
  {
    cmd: "npx next2app deploy",
    response: ["🎉 Submitted to AppStore, PlayStore!"],
  },
];

const CommandTerminal = () => {
  const [activeCommand, setActiveCommand] = useState(0);
  const [completedCommands, setCompletedCommands] = useState([]);
  const [visibleCommands, setVisibleCommands] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const resetAnimation = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setVisibleCommands([]);
    setCompletedCommands([]);

    setTimeout(() => {
      setActiveCommand(0);
      setVisibleCommands([0]);
      setIsProcessing(false);
    }, 200);
  };

  const handleCommandComplete = (index: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      setCompletedCommands((prev) => [...prev, index]);

      setTimeout(() => {
        setActiveCommand(index + 1);
        setVisibleCommands((prev) => [...prev, index + 1]);

        if (index === commands.length - 1) {
          setTimeout(resetAnimation, 2000);
        }
        setIsProcessing(false);
      }, 1000);
    }, 500);
  };

  useEffect(() => {
    setVisibleCommands([0]);
  }, []);

  return (
    <div className="bg-black rounded-xl shadow-2xl overflow-hidden border border-gray-800 min-h-[320px]">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
      </div>
      <div className="p-4 font-mono text-sm">
        {commands.map(
          (command, index) =>
            visibleCommands.includes(index) && (
              <div key={index} className="mb-4 last:mb-0">
                <div className="flex items-center space-x-2 text-gray-300">
                  <span className="text-purple-400">$</span>
                  {index === activeCommand ? (
                    <TypewriterText
                      text={command.cmd}
                      delay={50}
                      onComplete={() => handleCommandComplete(index)}
                    />
                  ) : (
                    <span className="flex items-center gap-2">
                      {command.cmd}
                    </span>
                  )}
                  <Check
                    className={`
                      w-4 h-4 text-green-400 transition-opacity duration-300
                      ${completedCommands.includes(index) ? "opacity-100" : "opacity-0"}
                    `}
                  />
                </div>

                <div className="mt-1 text-gray-500 text-sm transition-all duration-1000">
                  {command.response.map((res) => (
                    <div
                      className={`transition-opacity duration-200 ${completedCommands.includes(index) ? "opacity-100" : "opacity-0"}`}
                      key={res}
                    >
                      {res}
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default CommandTerminal;
