import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTelegram } from 'react-icons/si';

const iconProps = {
  className: 'h-5 w-5',
  'aria-hidden': 'true',
  focusable: 'false'
};

const socialLinks = [
  {
    name: 'Telegram',
    href: 'https://t.me/voxylon',
    icon: <SiTelegram {...iconProps} />
  },
  {
    name: 'X',
    href: 'https://x.com/projectvoxylon',
    icon: <FaXTwitter {...iconProps} />
  },
  {
    name: 'GitHub',
    href: 'https://github.com/voxylon',
    icon: <FaGithub {...iconProps} />
  }
];

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-center sm:text-left">© {new Date().getFullYear()} Voxylon. Community owned. Radically fair.</p>
        <div className="flex items-center justify-center gap-3 text-slate-400 sm:justify-end">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 p-2 transition hover:-translate-y-0.5 hover:border-voxylon-purple/50 hover:text-white"
              aria-label={link.name}
            >
              {link.icon}
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
