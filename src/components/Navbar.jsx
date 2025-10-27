import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import logoMark from '../assets/logo.jpg';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Litepaper', to: '/litepaper' },
  { name: 'Register', to: '/register' }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleToggle = () => setOpen((current) => !current);
  const handleClose = () => setOpen(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl shadow-[0_12px_28px_rgba(122,60,255,0.35)]">
            <img src={logoMark} alt="Voxylon logomark" className="h-full w-full object-cover" />
          </span>
          <span className="hidden sm:inline tracking-tight">Voxylon</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 sm:gap-2 md:flex">
            <LayoutGroup id="desktop-nav">
              <div className="flex items-center gap-1 sm:gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="relative whitespace-nowrap px-2 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white sm:px-3"
                  >
                    {isActive(link.to) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                ))}
              </div>
            </LayoutGroup>
          </nav>
          <button
            type="button"
            className="relative z-50 flex flex-col items-center justify-center gap-1 rounded-md border border-white/10 p-2 text-slate-200 md:hidden"
            onClick={handleToggle}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">Toggle navigation</span>
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white"
            />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[45] bg-slate-950/80 backdrop-blur md:hidden"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-24 w-full max-w-sm px-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl ring-1 ring-white/10">
                <nav id="mobile-nav" className="space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.to);
                    return (
                      <Link
                        key={link.name}
                        to={link.to}
                        onClick={handleClose}
                        className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                          active ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
