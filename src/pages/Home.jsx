import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown.jsx';
import Roadmap from '../components/Roadmap.jsx';

const heroVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.6, ease: 'easeOut' }
  })
};

const technologyPillars = [
  {
    title: 'EVM-Compatible',
    description:
      'Drop-in compatibility with existing Ethereum tooling, infrastructure, and developer workflows.'
  },
  {
    title: 'Deterministic Genesis',
    description: 'Open-source, reproducible tooling ensures a verifiable validator set at launch.'
  },
  {
    title: 'Proof-of-Stake Fairness',
    description: 'Equal stake allotments (100 VXN) and slashing tuned for a resilient, community-owned network.'
  }
];

const communityLinks = [
  {
    title: 'Telegram',
    description: 'Coordinate with organizers and future validators in real time.',
    href: 'https://t.me/voxylon'
  },
  {
    title: 'X (Twitter)',
    description: 'Follow launch updates, validator stats, and transparency threads.',
    href: 'https://x.com/projectvoxylon'
  },
  {
    title: 'GitHub',
    description: 'Contribute to the portal, eligibility tooling, and audit scripts.',
    href: 'https://github.com/voxylon'
  }
];

function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate px-4 pt-24 pb-20 sm:px-6 md:pt-28">
        <div className="absolute inset-0 -z-10 bg-grid-lines bg-[size:50px_50px] opacity-40" aria-hidden="true" />
        <div className="absolute inset-0 -z-20 bg-grid-radial opacity-70" aria-hidden="true" />
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:items-start">
          <motion.div
            className="flex-1 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Registration portal live — zero premine, zero insiders
            </span>
            <h1 className="text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-left">
              Launch the most decentralized validator network in crypto history.
            </h1>
            <p className="text-center text-base text-slate-300 sm:text-lg lg:text-left">
              Voxylon invites every eligible Ethereum account to become a genesis validator. No investors. No founders'
              allocations. Just a fair, transparent, community-owned Layer 1.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(122,60,255,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Register Now
              </Link>
              <Link
                to="/litepaper"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white/80 transition hover:bg-white/10"
              >
                Read the Litepaper
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="flex w-full max-w-xl flex-col gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Countdown />
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white">Radically fair by design</h2>
              <p className="mt-3 text-sm text-slate-300">
                Every validator begins with 100 VXN and the same rules. Registration is public, verifiable, and enforced by
                smart contracts and community audit tools.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>• Zero premine or private allocations</li>
                <li>• Eligibility based on Ethereum gas usage</li>
                <li>• Deterministic genesis artifacts</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            className="section-heading text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            The Voxylon Vision
          </motion.h2>
          <motion.p
            className="mt-4 section-subheading mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
            custom={1}
          >
            A Layer 1 owned entirely by its participants. No central team, no lockups, only transparent rules and open-source
            tooling. Voxylon is a protocol, not a product.
          </motion.p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          {technologyPillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              className="card-glass rounded-2xl p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={index}
            >
              <h3 className="text-xl font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="section-heading text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            Roadmap to Mainnet
          </motion.h2>
          <motion.p
            className="section-subheading mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
            custom={1}
          >
            Track every milestone from portal launch to mainnet activation. Each step is designed to maximize validator
            decentralization and transparency.
          </motion.p>
          <div className="mt-10">
            <Roadmap />
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            className="section-heading text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            Build with the Community
          </motion.h2>
          <motion.p
            className="section-subheading mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
            custom={1}
          >
            Join builders, auditors, and validators forging a fair launch. Jump into our open channels and ship alongside the
            community.
          </motion.p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {communityLinks.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="card-glass block h-full rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(122,60,255,0.35)]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
                custom={index}
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-300">{item.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-r from-voxylon-blue/20 via-white/5 to-voxylon-purple/20 p-10 text-center shadow-2xl">
          <motion.h2
            className="text-3xl font-semibold text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
          >
            Ready to stand up a Voxylon validator?
          </motion.h2>
          <motion.p
            className="mt-4 text-base text-slate-200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={1}
          >
            Register today to secure your validator slot before the December 31 deadline. Every signature pushes us toward the
            most decentralized chain launch ever.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={2}
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-8 py-3 text-base font-semibold text-white shadow-[0_20px_50px_rgba(122,60,255,0.35)] transition hover:-translate-y-0.5"
            >
              Register Now
            </Link>
            <a
              href="https://github.com/voxylon"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white/80 transition hover:bg-white/10"
            >
              Explore the Tooling
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
