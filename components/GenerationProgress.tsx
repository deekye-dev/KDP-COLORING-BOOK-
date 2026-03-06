import { GeneratedPage } from '@/lib/pdfExporter';
import { CheckCircle2, Circle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface Props {
  pages: GeneratedPage[];
  onRegenerate: (id: string) => void;
}

export default function GenerationProgress({ pages, onRegenerate }: Props) {
  const completedCount = pages.filter(p => p.status === 'completed').length;
  const totalCount = pages.length;
  const progress = Math.round((completedCount / totalCount) * 100) || 0;

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-violet-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="flex items-end justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Generation Progress</h2>
            <p className="text-slate-500 font-medium mt-1">{completedCount} of {totalCount} pages completed</p>
          </div>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">
            {progress}%
          </div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 p-1 relative z-10">
          <div 
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-lg shadow-slate-200/40 flex flex-col hover:shadow-xl hover:shadow-violet-500/10 transition-shadow">
            <div className="aspect-[3/4] bg-slate-50 relative border-b border-slate-100 flex items-center justify-center p-6">
              {page.status === 'completed' && page.imageUrl ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-200/50 bg-white">
                  <Image 
                    src={page.imageUrl} 
                    alt={page.subject} 
                    fill 
                    className="object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : page.status === 'generating' ? (
                <div className="flex flex-col items-center text-violet-500 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <span className="font-bold tracking-wide">Drawing...</span>
                </div>
              ) : page.status === 'error' ? (
                <div className="flex flex-col items-center text-rose-500 gap-3 text-center px-4">
                  <AlertCircle className="w-10 h-10" />
                  <span className="font-bold">Oops!</span>
                  <p className="text-xs text-rose-400 font-medium line-clamp-3">{page.error}</p>
                </div>
              ) : (
                <div className="text-slate-200">
                  <Circle className="w-12 h-12" />
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">Page {page.pageNumber}</span>
                  {page.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                </div>
                <h3 className="font-bold text-slate-900 leading-snug line-clamp-2" title={page.subject}>{page.subject}</h3>
              </div>
              
              {(page.status === 'completed' || page.status === 'error') && (
                <button
                  onClick={() => onRegenerate(page.id)}
                  className="w-full py-3 px-4 bg-slate-50 hover:bg-violet-50 hover:text-violet-700 text-slate-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border-2 border-slate-100 hover:border-violet-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
