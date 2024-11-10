import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import { Menu, X, Terminal, CheckCircle2 } from "lucide-react";

const TypewriterText = ({ text, delay, onComplete }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, delay, text, onComplete]);

  return <span>{currentText}</span>;
};

const CommandTerminal = () => {
  const [activeCommand, setActiveCommand] = useState(0);
  const [completedCommands, setCompletedCommands] = useState([]);
  const [visibleCommands, setVisibleCommands] = useState([]);

  const commands = [
    {
      cmd: "npx react2app dev",
      response: ["🚀 Server running at http://localhost:3000"],
    },
    {
      cmd: "npx react2app build",
      response: ["📦 Build completed successfully!(aab, ipa)"],
    },
    {
      cmd: "npx react2app deploy",
      response: ["🎉 Submitted to AppStore, PlayStore!"],
    },
  ];

  const resetAnimation = () => {
    // Clear all commands with a fade out effect
    setVisibleCommands([]);
    setCompletedCommands([]);

    // Start new cycle after a short delay
    setTimeout(() => {
      setActiveCommand(0);
      setVisibleCommands([0]);
    }, 500);
  };

  const handleCommandComplete = (index) => {
    setTimeout(() => {
      setCompletedCommands((prev) => [...prev, index]);
      setActiveCommand(index + 1);
      setVisibleCommands((prev) => [...prev, index + 1]);
      if (index === commands.length - 1) {
        setTimeout(resetAnimation, 2000);
      }
    }, 800);
  };

  useEffect(() => {
    // Initialize first command
    setVisibleCommands([0]);
  }, []);

  return (
    <div className="bg-black rounded-xl shadow-2xl overflow-hidden border border-gray-800 min-h-[300px]">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
      </div>
      <div className="p-4 font-mono text-sm ">
        {commands.map(
          (command, index) =>
            visibleCommands.includes(index) && (
              <div
                key={index}
                className="mb-4 last:mb-0 transition-all duration-500"
              >
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
                      {completedCommands.includes(index) && (
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      )}
                    </span>
                  )}
                </div>
                {completedCommands.includes(index) && (
                  <div className="mt-1 text-gray-500 text-sm">
                    {command.response.map((res) => (
                      <div key={res}>{res}</div>
                    ))}
                  </div>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="overflow-hidden flex flex-col h-[calc(100%_-_4rem)]">
      <nav className="w-full z-50">
        <div className="max-w-4xl mx-auto px-4">
          {" "}
          {/* Reduced from max-w-5xl to match content width */}
          <div className="flex items-center justify-between h-20 lg:mt-4">
            <a href="/">
              <Logo />
            </a>

            <div className="hidden md:flex items-center space-x-8">
              <a href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </a>
              <a
                href="https://github.com"
                className="text-gray-600 hover:text-gray-900"
              >
                Blog
              </a>
              <button type="button">
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="3 3 18 18"
                >
                  <title>GitHub</title>
                  <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"></path>
                </svg>
              </button>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/80 backdrop-blur-lg">
            <div className="px-4 py-2 space-y-1">
              <a href="/docs" className="block py-2 text-gray-600">
                Docs
              </a>
              <a href="https://github.com" className="block py-2 text-gray-600">
                GitHub
              </a>
              <button className="w-full mt-2 bg-black text-white px-4 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="grid grid-cols-1 gap-12">
            <div className="text-center">
              <h1 className="text-4xl mt-8 md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
                React to App in 3 commands
              </h1>
              <p className="text-gray-600 max-w-lg mx-auto mb-0 text-lg">
                Transform your React.js, Next.js project <br /> into IOS,
                Android apps with just 3 commands
              </p>
            </div>
            <div className="w-full max-w-2xl mx-auto">
              <CommandTerminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
