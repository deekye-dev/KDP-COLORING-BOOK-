'use client';

import { useState } from 'react';
import BookSetupForm from '@/components/BookSetupForm';
import PromptEditor from '@/components/PromptEditor';
import GenerationProgress from '@/components/GenerationProgress';
import { BookConfig, BookMetadata, generatePrompts, generateMetadata } from '@/lib/promptBuilder';
import { GeneratedPage } from '@/lib/pdfExporter';
import { generateImage } from '@/lib/imageGenerator';
import { exportProject } from '@/lib/zipExporter';
import { Download, ChevronRight, Wand2, BookOpen, Tags, LayoutList, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'setup' | 'prompts' | 'generation';

export default function Home() {
  const [step, setStep] = useState<Step>('setup');
  const [config, setConfig] = useState<BookConfig | null>(null);
  const [metadata, setMetadata] = useState<BookMetadata | null>(null);
  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleGeneratePrompts = async (newConfig: BookConfig) => {
    setConfig(newConfig);
    setIsGeneratingPrompts(true);
    try {
      const [prompts, generatedMetadata] = await Promise.all([
        generatePrompts(newConfig),
        generateMetadata(newConfig)
      ]);
      setPages(prompts.map(p => ({ ...p, status: 'pending' })));
      setMetadata(generatedMetadata);
      setStep('prompts');
    } catch (error) {
      console.error(error);
      alert('Failed to generate prompts and metadata. Please try again.');
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handleUpdatePage = (id: string, updates: Partial<GeneratedPage>) => {
    setPages(pages.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const generateSingleImage = async (page: GeneratedPage) => {
    setPages(current => current.map(p => p.id === page.id ? { ...p, status: 'generating', error: undefined } : p));
    try {
      const imageUrl = await generateImage(page.prompt);
      setPages(current => current.map(p => p.id === page.id ? { ...p, status: 'completed', imageUrl } : p));
    } catch (error: any) {
      console.error(`Failed to generate image for page ${page.pageNumber}`, error);
      setPages(current => current.map(p => p.id === page.id ? { ...p, status: 'error', error: error.message || 'Generation failed' } : p));
    }
  };

  const handleStartGeneration = async () => {
    setStep('generation');
    // Generate images sequentially to avoid rate limits, or in small batches
    for (const page of pages) {
      if (page.status === 'pending' || page.status === 'error') {
        await generateSingleImage(page);
      }
    }
  };

  const handleRegenerate = (id: string) => {
    const page = pages.find(p => p.id === id);
    if (page) {
      generateSingleImage(page);
    }
  };

  const handleExport = async () => {
    if (!config) return;
    setIsExporting(true);
    try {
      await exportProject(config, pages, metadata);
    } catch (error) {
      console.error(error);
      alert('Failed to export project.');
    } finally {
      setIsExporting(false);
    }
  };

  const isAllCompleted = pages.length > 0 && pages.every(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-violet-200 selection:text-violet-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              KDP Creator
            </h1>
          </div>
          
          {/* Stepper */}
          <div className="hidden md:flex items-center gap-3 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === 'setup' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'setup' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>1</span>
              Setup
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === 'prompts' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'prompts' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>2</span>
              Prompts
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${step === 'generation' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'generation' ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-500'}`}>3</span>
              Generation
            </div>
          </div>

          <div className="w-32 flex justify-end">
            {step === 'generation' && isAllCompleted && (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 disabled:opacity-50 disabled:transform-none shadow-lg shadow-slate-900/20"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export ZIP'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                  Create your coloring book 🎨
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                  Define your theme and let AI generate a complete, KDP-ready coloring book with consistent, beautiful line art.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <BookSetupForm onGeneratePrompts={handleGeneratePrompts} isGenerating={isGeneratingPrompts} />
              </div>
            </motion.div>
          )}

          {step === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <PromptEditor 
                pages={pages} 
                onUpdatePage={handleUpdatePage} 
                onStartGeneration={handleStartGeneration} 
              />
            </motion.div>
          )}

          {step === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <GenerationProgress pages={pages} onRegenerate={handleRegenerate} />
              
              {metadata && (
                <div className="mt-12 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-violet-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-br from-fuchsia-100 to-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 relative z-10 flex items-center gap-3">
                    <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-2xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    KDP Listing Details
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <LayoutList className="w-4 h-4" /> Description
                        </h3>
                        <div className="text-slate-700 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                          {metadata.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold text-fuchsia-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Tags className="w-4 h-4" /> Keywords (7)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {metadata.keywords.map((k, i) => (
                            <span key={i} className="px-3.5 py-1.5 bg-fuchsia-50 text-fuchsia-700 rounded-xl text-sm font-bold border border-fuchsia-100">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-bold text-violet-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <LayoutList className="w-4 h-4" /> Categories
                        </h3>
                        <ul className="space-y-2">
                          {metadata.categories.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 text-sm font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="text-violet-500 mt-0.5">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-bold text-fuchsia-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Megaphone className="w-4 h-4" /> Marketing Summary
                        </h3>
                        <p className="text-slate-700 text-sm bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 rounded-2xl border border-violet-100/50 italic font-medium leading-relaxed">
                          &quot;{metadata.marketingSummary}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
