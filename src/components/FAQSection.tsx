import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Search, CheckCircle2 } from 'lucide-react';
import { STATIC_FAQS, StaticFAQItem } from '../data/staticFaqs';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs?: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  // Use provided faqs or fallback to static AI-generated FAQs
  const items: StaticFAQItem[] = useMemo(() => {
    if (faqs && faqs.length > 0) {
      return faqs.map((f, idx) => ({
        id: f.id || `faq-${idx}`,
        category: 'General',
        question: f.question,
        answer: f.answer,
      }));
    }
    return STATIC_FAQS;
  }, [faqs]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ['All', ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  return (
    <section className="w-full my-16 max-w-4xl mx-auto px-4 animate-fade-in" id="faq-section">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>HELP & FREQUENT QUESTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about playing free HTML5 browser games, developer submissions, orientation, browser performance, and platform policies on GAMES TONIC.
        </p>

        {/* Live Search & Filter Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-2xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g., HTML5, controls, DMCA, mobile)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0e18] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400/60 placeholder-slate-500 shadow-inner"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-[#0c0e18] text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center p-10 rounded-2xl bg-[#0a0c14] border border-white/10 space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No matching questions found</h3>
          <p className="text-xs text-slate-400">Try searching for different keywords or select "All" categories.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#121422] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-[#0a0c14]/80 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isOpen ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'
                      }`}
                    />
                    <div>
                      <span className="font-bold text-sm sm:text-base text-white block">
                        {item.question}
                      </span>
                      {item.category && (
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-purple-300 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-1.5 rounded-lg shrink-0 transition-all ${
                      isOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400 group-hover:bg-white/10'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 bg-black/20 animate-fade-in space-y-2">
                    <p>{item.answer}</p>
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-cyan-400/80 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Verified Static Policy Item • Built-in Zero Latency</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

