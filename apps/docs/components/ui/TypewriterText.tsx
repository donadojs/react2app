import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  delay: number;
  onComplete?: () => void;
}

const TypewriterText = ({ text, delay, onComplete }: TypewriterTextProps) => {
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

export default TypewriterText;
