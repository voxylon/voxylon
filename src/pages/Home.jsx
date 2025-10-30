import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Countdown from '../components/Countdown.jsx';

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

const faqData = [
  {
    q: 'Can I join using a new Ethereum account?',
    a: 'Yes, but your account must have paid at least 0.004 ETH in transaction fees by December 31, 2025, to be included in the genesis block.'
  },
  {
    q: 'How do I check if I’m eligible?',
    a: 'Use an Ethereum block explorer like Etherscan to view your address’s total gas fees paid. If you’ve paid at least 0.004 ETH in gas, you qualify.'
  },
  {
    q: 'Can I use multiple accounts?',
    a: 'Yes. If you have multiple eligible Ethereum accounts, each one can register separately to become a validator.'
  },
  {
    q: 'What is a validator key?',
    a: 'A BLS12-381 public key that identifies your validator on the Voxylon network. You can generate this key using our secure key generation tool.'
  },
  {
    q: 'Do I need technical knowledge?',
    a: 'Basic understanding helps. You’ll need to generate keys and later run validator software, but detailed guides will be provided.'
  },
  {
    q: 'What hardware do I need?',
    a: 'Similar to Ethereum: 4–8 GB RAM, SSD storage, and a stable internet connection. Full requirements will be published before the mainnet launch.'
  },
  {
    q: 'Is Voxylon EVM-compatible?',
    a: 'Yes. Voxylon is fully EVM-compatible, meaning Ethereum smart contracts and tools work without modification.'
  },
  {
    q: 'How much VXN will I receive?',
    a: 'Each validator receives exactly 100 VXN at genesis.'
  },
  {
    q: 'Are there any team or VC allocations?',
    a: 'No. There are no team allocations, VC investments, or private sales — Voxylon is 100% community-owned.'
  },
  {
    q: 'How does slashing work?',
    a: 'Similar to Ethereum’s Proof of Stake. Validators who act maliciously or remain offline for extended periods will have their stake reduced.'
  },
  {
    q: 'What is the value of VXN?',
    a: 'The value of VXN will be determined entirely by the community. Voxylon is a 100% community-driven project.'
  },
  {
    q: 'Can registrations be audited?',
    a: 'Yes. After registration closes, we will publish the final validator list and all associated signatures for public verification.'
  },
  {
    q: 'What happens after I register?',
    a: 'Your registration will be securely stored. Before mainnet launch, you’ll receive detailed instructions on setting up and running your validator node.'
  },
  {
    q: 'Who controls Voxylon?',
    a: 'After genesis, the network will be governed entirely by its validators. We’re simply organizing the decentralized launch as volunteers and community members.'
  },
  {
    q: 'What is the purpose of Voxylon?',
    a: 'Voxylon is a general-purpose smart contract platform open to everyone. It has no predefined purpose — its direction and meaning will emerge from the community and individual builders who contribute to it.'
  },
  {
    q: 'Why should I join this project?',
    a: 'If you have to ask, it might not be for you. Those who see its value need no convincing — and those who don’t, no amount of convincing will be enough.'
  }
];

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition"
      >
        <h3 className="text-base font-semibold text-white">{question}</h3>
        <span className="text-2xl text-slate-400 flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-sm text-slate-300 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate px-4 pt-24 pb-20 sm:px-6 md:pt-28">
        <div className="absolute inset-0 -z-10 bg-grid-lines bg-[size:50px_50px] opacity-40" aria-hidden="true" />
        <div className="absolute inset-0 -z-20 bg-grid-radial opacity-70" aria-hidden="true" />
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
          >
            The Fairest Blockchain Launch in Crypto History
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-slate-300 sm:text-xl max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={1}
          >
            Voxylon unites Bitcoin's resistance to control and Ethereum's programmability with a radically fair and highly decentralized launch.
          </motion.p>
          <motion.p
            className="mt-6 text-lg text-slate-300 sm:text-xl max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={1}
          >
            We're inviting more than 60 million verified Ethereum users to become validators and help build a truly community-owned Layer 1 blockchain.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={2}
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-8 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(122,60,255,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Register as Validator
            </Link>
            <Link
              to="/litepaper"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white/80 transition hover:bg-white/10"
            >
              Read Litepaper
            </Link>
          </motion.div>
          <motion.div
            className="mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={3}
          >
            <Countdown />
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="text-3xl font-semibold text-white text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            What is Voxylon?
          </motion.h2>
          <div className="mt-12 space-y-8">
            <motion.div
              className="card-glass rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={0}
            >
              <h3 className="text-xl font-semibold text-white">A community-owned blockchain</h3>
              <p className="mt-3 text-base text-slate-300 leading-relaxed">
                Voxylon is an Ethereum-compatible Proof-of-Stake Layer 1 blockchain launching with all the initial supply staked to genesis validators. 
              </p>
            </motion.div>

            <motion.div
              className="card-glass rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={1}
            >
              <h3 className="text-xl font-semibold text-white">Radically fair</h3>
              <p className="mt-3 text-base text-slate-300 leading-relaxed">
                Unlike typical crypto launches dominated by VCs and insiders, Voxylon bootstraps from Ethereum's existing user base. 
                Anyone who paid at least 0.004 ETH in gas fees by December 31, 2025 can become a genesis validator. 
                At least 60 million Ethereum accounts are qualified to join.
              </p>
            </motion.div>

            <motion.div
              className="card-glass rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={2}
            >
              <h3 className="text-xl font-semibold text-white">Easy to join</h3>
              <p className="mt-3 text-base text-slate-300 leading-relaxed">
                Just generate a validator key, sign it with your Ethereum wallet, and submit it before the deadline.
                If your Ethereum account paid at least 0.004 ETH in gas fees by December 31, 2025, 
                your validator key will be included in the genesis state. 
              </p>
            </motion.div>

            <motion.div
              className="card-glass rounded-3xl p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              custom={3}
            >
              <h3 className="text-xl font-semibold text-white">EVM-compatible</h3>
              <p className="mt-3 text-base text-slate-300 leading-relaxed">
                Voxylon is fully compatible with Ethereum tooling, smart contracts, and infrastructure. 
                Developers can deploy existing Ethereum applications without modification.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 bg-slate-950/30">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            className="text-3xl font-semibold text-white text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={sectionVariants}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.div
            className="mt-12 space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            {faqData.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openFAQ === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-r from-voxylon-blue/20 via-white/5 to-voxylon-purple/20 p-10 text-center shadow-2xl">
          <motion.h2
            className="text-3xl font-semibold text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
          >
            Ready to become a validator?
          </motion.h2>
          <motion.p
            className="mt-4 text-base text-slate-200"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={1}
          >
            Join the fairest blockchain launch ever. Register before December 31, 2025.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
