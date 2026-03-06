import { GeneratedPage } from '@/lib/pdfExporter';
import { Edit2, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Props {
  pages: GeneratedPage[];
  onUpdatePage: (id: string, updates: Partial<GeneratedPage>) => void;
  onStartGeneration: () => void;
}

export default function PromptEditor({ pages, onUpdatePage, onStartGeneration }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-xl shadow-violet-900/5 border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Review Prompts</h2>
          <p className="text-slate-500 mt-1 font-medium">Edit the generated prompts before creating images.</p>
        </div>
        <button
          onClick={onStartGeneration}
          className="py-3.5 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 whitespace-nowrap"
        >
          <Sparkles className="w-5 h-5" />
          Generate Images
        </button>
      </div>

      <div className="grid gap-5">
        {pages.map((page) => (
          <div key={page.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-200/20 hover:shadow-lg hover:shadow-violet-500/10 transition-shadow">
            <div className="flex items-start justify-between gap-5">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 font-bold text-lg shadow-inner">
                    {page.pageNumber}
                  </span>
                  {editingId === page.id ? (
                    <input
                      type="text"
                      value={page.subject}
                      onChange={(e) => onUpdatePage(page.id, { subject: e.target.value })}
                      className="font-bold text-lg text-slate-900 border-b-2 border-violet-200 focus:border-violet-500 outline-none px-2 py-1 bg-violet-50/50 rounded-t-lg w-full max-w-md transition-colors"
                    />
                  ) : (
                    <h3 className="font-bold text-lg text-slate-900">{page.subject}</h3>
                  )}
                </div>
                
                {editingId === page.id ? (
                  <textarea
                    value={page.prompt}
                    onChange={(e) => onUpdatePage(page.id, { prompt: e.target.value })}
                    className="w-full text-slate-700 p-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none min-h-[100px] font-medium bg-white transition-all resize-y"
                  />
                ) : (
                  <p className="text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                    {page.prompt}
                  </p>
                )}
              </div>

              <button
                onClick={() => setEditingId(editingId === page.id ? null : page.id)}
                className={`p-3 rounded-xl transition-all ${editingId === page.id ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-slate-50 text-slate-400 hover:text-violet-600 hover:bg-violet-100'}`}
                title={editingId === page.id ? "Done" : "Edit"}
              >
                {editingId === page.id ? <Check className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
