"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Loader } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  url: string;
  title: string;
  onClose: () => void;
}

export default function PreviewModal({ isOpen, url, title, onClose }: PreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      document.body.style.overflow = "hidden"; // lock page scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, url]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Browser Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="w-full max-w-5xl h-[75vh] md:h-[80vh] bg-bg border border-border-custom flex flex-col shadow-2xl relative z-10 overflow-hidden"
          >
            {/* Header / Address Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-custom bg-bg2 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>

              <div className="flex-grow max-w-md mx-4 flex items-center justify-center bg-bg border border-border-custom px-4 py-1 rounded text-[10px] font-mono text-text-custom2 tracking-wide overflow-hidden truncate">
                <span className="opacity-40 mr-0.5">https://</span>
                <span className="truncate">{url.replace(/^https?:\/\//, "")}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-bg text-text-custom2 hover:text-text-custom transition-all"
                  title="Open site in new tab"
                >
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-bg text-text-custom2 hover:text-text-custom transition-all"
                  title="Close Preview"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Viewport container */}
            <div className="flex-grow w-full h-full relative bg-[#0b0b0b]">
              {/* Spinner overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-[#0b0b0b] flex flex-col items-center justify-center gap-3.5 z-20">
                  <Loader className="w-7 h-7 text-mono animate-spin" />
                  <span className="font-mono text-[9px] text-text-custom3 uppercase tracking-[0.25em]">
                    Connecting to {title.split(" — ")[0]}...
                  </span>
                </div>
              )}

              {/* Website content */}
              <iframe
                src={url}
                title={title}
                onLoad={() => setIsLoading(false)}
                className="w-full h-full border-none bg-white relative z-10"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
