import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import litepaperContent from '../../content/litepaper.md?raw';

const components = {
  h1: (props) => <h1 className="text-4xl font-semibold text-white" {...props} />,
  h2: (props) => <h2 className="mt-12 text-3xl font-semibold text-white" {...props} />,
  h3: (props) => <h3 className="mt-8 text-2xl font-semibold text-white" {...props} />,
  p: (props) => <p className="mt-4 text-base leading-relaxed text-slate-200" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6 text-base text-slate-200" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-6 text-base text-slate-200" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-4 border-voxylon-purple/60 bg-white/5 p-4 text-base italic text-slate-200"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
      <table className="min-w-full border-collapse bg-slate-900/60 text-sm text-slate-100" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-white/10 text-left" {...props} />,
  th: (props) => <th className="px-4 py-3 font-semibold" {...props} />,
  td: (props) => <td className="border-t border-white/10 px-4 py-3 text-slate-200" {...props} />,
  code: (props) => (
    <code className="rounded-md bg-slate-900/80 px-1.5 py-0.5 text-sm text-emerald-300" {...props} />
  ),
  a: (props) => (
    <a className="text-voxylon-blue underline decoration-dashed underline-offset-4" target="_blank" rel="noreferrer" {...props} />
  )
};

function Litepaper() {
  return (
    <div className="px-4 pb-24 pt-16 sm:px-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl sm:p-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {litepaperContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Litepaper;
