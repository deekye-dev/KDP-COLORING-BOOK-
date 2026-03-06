import { BookConfig } from '@/lib/promptBuilder';
import { useState } from 'react';
import { Book, Settings, Layout, Users, Palette, FileText } from 'lucide-react';

interface Props {
  onGeneratePrompts: (config: BookConfig) => void;
  isGenerating: boolean;
}

export default function BookSetupForm({ onGeneratePrompts, isGenerating }: Props) {
  const [config, setConfig] = useState<BookConfig>({
    title: '',
    theme: '',
    audience: 'kids',
    style: 'cute',
    numPages: 10,
    trimSize: '8.5x11',
    margins: 0.5,
    blankBacksides: true,
    pageNumbers: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePrompts(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-violet-900/5 border border-slate-100 relative overflow-hidden">
      {/* Decorative background blob */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="space-y-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-2xl">
              <Book className="w-6 h-6" />
            </div>
            Book Details
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Define the core concept of your coloring book.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Book Title</label>
            <input
              required
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="e.g., Magical Forest Adventures"
            />
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Theme / Niche</label>
            <input
              required
              type="text"
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
              placeholder="e.g., Woodland animals, fairies"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500" /> Target Audience
            </label>
            <select
              value={config.audience}
              onChange={(e) => setConfig({ ...config, audience: e.target.value })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
            >
              <option value="toddlers">Toddlers (Ages 1-3)</option>
              <option value="kids">Kids (Ages 4-8)</option>
              <option value="older kids">Older Kids (Ages 9-12)</option>
              <option value="teens">Teens</option>
              <option value="adults">Adults</option>
            </select>
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-violet-500" /> Art Style
            </label>
            <select
              value={config.style}
              onChange={(e) => setConfig({ ...config, style: e.target.value })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
            >
              <option value="cute and simple">Cute & Simple</option>
              <option value="bold and easy">Bold & Easy (Thick lines)</option>
              <option value="kawaii">Kawaii</option>
              <option value="mandala">Mandala / Geometric</option>
              <option value="realistic line art">Realistic Line Art</option>
              <option value="intricate zentangle">Intricate Zentangle</option>
            </select>
          </div>
        </div>
      </div>

      <div className="h-px bg-slate-100 my-8 relative z-10" />

      <div className="space-y-6 relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2.5 bg-fuchsia-100 text-fuchsia-600 rounded-2xl">
              <Layout className="w-6 h-6" />
            </div>
            Formatting & Layout
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Configure KDP print settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-fuchsia-500" /> Number of Pages
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={config.numPages}
              onChange={(e) => setConfig({ ...config, numPages: parseInt(e.target.value) || 1 })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
            />
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Settings className="w-4 h-4 text-fuchsia-500" /> Trim Size
            </label>
            <select
              value={config.trimSize}
              onChange={(e) => setConfig({ ...config, trimSize: e.target.value })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900 appearance-none cursor-pointer"
            >
              <option value="8.5x11">8.5&quot; x 11&quot; (Standard)</option>
              <option value="8.5x8.5">8.5&quot; x 8.5&quot; (Square)</option>
              <option value="6x9">6&quot; x 9&quot; (Trade)</option>
            </select>
          </div>
          <div className="space-y-2.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Margins (inches)</label>
            <input
              type="number"
              step="0.1"
              min="0.25"
              max="1"
              value={config.margins}
              onChange={(e) => setConfig({ ...config, margins: parseFloat(e.target.value) || 0.5 })}
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <label className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all flex-1 ${config.blankBacksides ? 'border-violet-500 bg-violet-50/50 shadow-sm shadow-violet-100' : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'}`}>
            <input
              type="checkbox"
              checked={config.blankBacksides}
              onChange={(e) => setConfig({ ...config, blankBacksides: e.target.checked })}
              className="w-5 h-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
            />
            <div>
              <div className="font-bold text-slate-900">Blank Backsides</div>
              <div className="text-sm text-slate-500 font-medium">Prevents bleed-through</div>
            </div>
          </label>
          <label className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all flex-1 ${config.pageNumbers ? 'border-violet-500 bg-violet-50/50 shadow-sm shadow-violet-100' : 'border-slate-100 hover:border-violet-200 hover:bg-slate-50'}`}>
            <input
              type="checkbox"
              checked={config.pageNumbers}
              onChange={(e) => setConfig({ ...config, pageNumbers: e.target.checked })}
              className="w-5 h-5 text-violet-600 rounded border-slate-300 focus:ring-violet-500"
            />
            <div>
              <div className="font-bold text-slate-900">Page Numbers</div>
              <div className="text-sm text-slate-500 font-medium">Add numbers to bottom</div>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-8 relative z-10">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-xl shadow-violet-500/25"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Dreaming up ideas...</span>
            </>
          ) : (
            'Generate Book Plan ✨'
          )}
        </button>
      </div>
    </form>
  );
}
