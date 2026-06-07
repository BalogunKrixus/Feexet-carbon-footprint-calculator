"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchable?: boolean;
}

export function Dropdown({ value, onChange, options, placeholder = "Select…", searchable = false }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!open) setQuery("");
  }, [open, searchable]);

  const selected = options.find((o) => o.value === value);
  const filtered = searchable && query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full bg-white/5 border rounded-xl px-4 py-3.5 text-left font-body text-sm
          flex items-center justify-between gap-2 transition-all duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-teal
          ${open ? "border-teal/60" : "border-white/10 hover:border-white/25"}
        `}
      >
        <span className={selected ? "text-off-white" : "text-off-white/30"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          viewBox="0 0 12 12"
          className={`w-3 h-3 flex-shrink-0 text-off-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-[#04436A] border border-white/15 rounded-xl overflow-hidden z-50 shadow-2xl"
          >
            {searchable && (
              <div className="px-3 pt-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 bg-white/8 rounded-lg px-3 py-2">
                  <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-off-white/30 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                    <circle cx="6.5" cy="6.5" r="4.5" />
                    <path d="M10 10l3 3" />
                  </svg>
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type to search…"
                    className="flex-1 bg-transparent font-body text-sm text-off-white placeholder-off-white/30 outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-off-white/30 hover:text-off-white/60">
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="currentColor">
                        <path d="M8.5 3.5l-5 5M3.5 3.5l5 5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 font-body text-sm text-off-white/30 text-center">No results</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false); setQuery(""); }}
                    className={`
                      w-full text-left px-4 py-2.5 font-body text-sm transition-colors duration-100
                      ${opt.value === value
                        ? "bg-teal/20 text-teal font-medium"
                        : "text-off-white/80 hover:bg-white/8 hover:text-off-white"
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
