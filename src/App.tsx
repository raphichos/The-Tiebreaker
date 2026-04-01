/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Table, 
  LayoutGrid, 
  Send, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  History,
  Trash2,
  ChevronRight
} from 'lucide-react';
import Markdown from 'react-markdown';
import { analyzeDecision, AnalysisType } from './services/geminiService';
import { cn } from './lib/utils';

interface HistoryItem {
  id: string;
  decision: string;
  type: AnalysisType;
  result: string;
  timestamp: number;
}

export default function App() {
  const [decision, setDecision] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('pros-cons');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleAnalyze = async () => {
    if (!decision.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeDecision(decision, analysisType);
      setResult(analysis);
      
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        decision,
        type: analysisType,
        result: analysis,
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => setHistory([]);

  const loadFromHistory = (item: HistoryItem) => {
    setDecision(item.decision);
    setAnalysisType(item.type);
    setResult(item.result);
    setShowHistory(false);
  };

  const analysisOptions = [
    { id: 'pros-cons', label: 'Pros & Cons', icon: Scale, description: 'Balanced list of advantages and disadvantages' },
    { id: 'comparison', label: 'Comparison', icon: Table, description: 'Structured table comparing multiple options' },
    { id: 'swot', label: 'SWOT Analysis', icon: LayoutGrid, description: 'Deep dive into Strengths, Weaknesses, Opportunities, and Threats' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="text-white w-5 h-5" />
            </div>
            <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight">The Tiebreaker</h1>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
            title="History"
          >
            <History className="w-5 h-5 text-slate-600" />
            {history.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <section className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="decision" className="text-sm font-semibold text-slate-700 ml-1">
                  What's on your mind?
                </label>
                <textarea
                  id="decision"
                  placeholder="e.g., Should I buy a house or keep renting? Should I take the new job offer?"
                  className="w-full min-h-[120px] p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none shadow-sm"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700 ml-1">Analysis Type</p>
                <div className="grid grid-cols-1 gap-2">
                  {analysisOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setAnalysisType(option.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-left transition-all group",
                        analysisType === option.id 
                          ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200" 
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg shrink-0 transition-colors",
                        analysisType === option.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      )}>
                        <option.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={cn(
                          "text-sm font-semibold",
                          analysisType === option.id ? "text-indigo-900" : "text-slate-700"
                        )}>{option.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading || !decision.trim()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Get AI Breakdown
                  </>
                )}
              </button>
            </section>

            {/* History Sidebar (Mobile/Tablet) */}
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Recent Decisions
                    </h3>
                    {history.length > 0 && (
                      <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4 italic">No history yet</p>
                    ) : (
                      history.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => loadFromHistory(item)}
                          className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                        >
                          <p className="text-sm font-medium text-slate-700 line-clamp-1 group-hover:text-indigo-600">{item.decision}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.type.replace('-', ' ')}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-400" />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl min-h-[400px] flex flex-col shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Analysis Result</h2>
                {result && (
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    AI Generated
                  </div>
                )}
              </div>
              
              <div className="flex-1 p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-slate-800">Weighing the options...</p>
                        <p className="text-sm text-slate-500">Our AI is crunching the data for you.</p>
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-700 text-sm flex items-start gap-3"
                    >
                      <div className="p-1 bg-red-100 rounded-full shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <p>{error}</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="markdown-body"
                    >
                      <Markdown>{result}</Markdown>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <Scale className="w-10 h-10 text-slate-300" />
                      </div>
                      <div className="max-w-xs space-y-2">
                        <p className="text-lg font-semibold text-slate-800">Ready to decide?</p>
                        <p className="text-sm text-slate-500">
                          Enter your dilemma on the left and choose an analysis type to get started.
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Career', 'Finance', 'Life', 'Tech'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-slate-500 font-medium">
            The Tiebreaker — Helping you make better choices with AI.
          </p>
          <p className="text-xs text-slate-400">
            Powered by Gemini 3 Flash. Always use your own judgment for critical decisions.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}

