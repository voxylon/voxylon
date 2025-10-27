import { useEffect, useMemo, useState } from 'react';

const TARGET_DATE = new Date('2025-12-31T23:59:59Z');

const formatTime = (diff) => {
  if (diff <= 0) {
    return { label: 'Launch window reached', segments: [] };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    label: 'Countdown to validator deadline',
    segments: [
      { label: 'Days', value: days.toString().padStart(2, '0') },
      { label: 'Hours', value: hours.toString().padStart(2, '0') },
      { label: 'Minutes', value: minutes.toString().padStart(2, '0') },
      { label: 'Seconds', value: seconds.toString().padStart(2, '0') }
    ]
  };
};

function Countdown() {
  const initialDiff = useMemo(() => TARGET_DATE.getTime() - Date.now(), []);
  const [diffMs, setDiffMs] = useState(initialDiff);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDiffMs(TARGET_DATE.getTime() - Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const { label, segments } = formatTime(diffMs);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-300">{label}</p>
      {segments.length === 0 ? (
        <p className="mt-4 text-2xl font-semibold text-white">The countdown has completed.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {segments.map((segment) => (
            <div key={segment.label} className="rounded-xl bg-slate-950/70 p-4 text-center shadow-inner">
              <div className="text-3xl font-semibold text-white md:text-4xl">{segment.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">{segment.label}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-slate-300">
        Deadline: <span className="font-semibold text-white">31 Dec 2025 23:59 UTC</span>
      </p>
    </div>
  );
}

export default Countdown;
