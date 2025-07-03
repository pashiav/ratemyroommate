"use client";

import React from "react";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Loading" }: LoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-darkBlue text-2xl font-lazyDog flex">
        {text}
        <span className="dot ml-1">.</span>
        <span className="dot ml-1" style={{ animationDelay: '0.2s' }}>.</span>
        <span className="dot ml-1" style={{ animationDelay: '0.4s' }}>.</span>
      </p>

      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite both;
        }

        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
