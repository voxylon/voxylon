import { motion } from 'framer-motion';

const roadmapItems = [
  {
    title: 'Validator Portal Live',
    description: 'Registration interface opens for eligible Ethereum accounts to claim validator slots.',
    period: 'Q4 2025'
  },
  {
    title: 'Snapshot & Final Deadline',
    description: 'Eligibility snapshot taken and validator submissions locked in for genesis.',
    period: '31 Dec 2025'
  },
  {
    title: 'Audit & Transparency Release',
    description: 'Community releases open-source tooling, audit reports, and the final validator list.',
    period: 'Early Jan 2026'
  },
  {
    title: 'Voxylon Mainnet Launch',
    description: 'Genesis block finalized with a radically decentralized validator set.',
    period: '21 Jan 2026'
  },
  {
    title: 'Community Governance & Tooling',
    description: 'Post-launch proposals, client diversity initiatives, and ecosystem grants steered by the community.',
    period: 'Post-launch'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, type: 'spring', stiffness: 120, damping: 18 }
  })
};

function Roadmap() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-voxylon-blue via-white/20 to-voxylon-purple sm:block" />
      <div className="space-y-6 sm:space-y-0">
        {roadmapItems.map((item, index) => (
          <motion.article
            key={item.title}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="card-glass relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:ml-16"
          >
            <div className="absolute -left-9 top-6 hidden h-3 w-3 rounded-full bg-white shadow-[0_0_15px_rgba(122,60,255,0.75)] sm:block" />
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.period}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default Roadmap;
