import React, { useState, useEffect } from "react";

const words = [
  "Full-Stack Developer.",
  "Passionate Learner.",
  "Software Engineer.",
];

const TypingAnimation = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];

    if (isDeleting) {
      if (letterIndex === 0) {
        if (wordIndex < words.length - 1) {
          setIsDeleting(false);
          setWordIndex(wordIndex + 1);
        }
      }
    } else {
      if (letterIndex === word.length) {
        if (wordIndex < words.length - 1) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }
    }
  }, [isDeleting, letterIndex, wordIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLetterIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, [isDeleting]);

  return (
    <div className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 break-normal mix-blend-difference">
      {words[wordIndex].substring(0, letterIndex)}
    </div>
  );
};

export default TypingAnimation;
