import { Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const socialTextLinks = ['Twitter', 'Instagram', 'LinkedIn', 'GitHub'];

  const quickLinks = [
    { label: 'Careers', href: '/careers' },
    { label: 'Roadmap', href: '/roadmap' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ];

  return (
    <footer className="border-t border-neutral-800 bg-[#0a0a0a] text-neutral-100">
      {/* Top content: three columns */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-16">
          {/* Left: Logo/Title + Year + tagline + socials */}
          <section className="flex flex-col space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="text-red-500">Next</span>Step
              </h2>
              <p className="mt-1 text-sm text-neutral-400">2025</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-300">
                Guiding students toward the careers they aspire to.
              </p>
            </div>

            <nav aria-label="Social links" className="mt-2">
              <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
                {socialTextLinks.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className="underline underline-offset-4 decoration-neutral-500 hover:text-white transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </nav>
          </section>

          {/* Middle: Quick Links */}
          <nav
            aria-label="Footer quick links"
            className="flex flex-col space-y-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={cn(
                      'text-sm text-neutral-400 transition-colors duration-200',
                      'hover:text-neutral-50'
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Contact */}
          <section className="flex flex-col space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              Contact
            </h3>
            <address className="flex flex-col space-y-3 not-italic">
              <div className="text-sm text-neutral-300">
                <p>Cochin, Kerala</p>
                <p>India</p>
              </div>
              <a
                href="mailto:contact@nextstep.ai"
                className={cn(
                  'inline-flex w-fit items-center gap-2 text-sm text-neutral-300 transition-colors duration-200',
                  'hover:text-red-500'
                )}
              >
                <Mail className="h-4 w-4" />
                <span>contact@nextstep.ai</span>
              </a>
            </address>
          </section>
        </div>
      </div>

      {/* Bottom strip: copyright + legal note */}
      <div className="border-t border-neutral-800 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col space-y-3 text-center md:flex-row md:items-center md:justify-between md:space-y-0">
            <p className="text-xs text-neutral-500">
              © 2025 NextStep – All Rights Reserved
            </p>
            <p className="text-xs text-neutral-600">
              This is a demo student project for a hackathon event.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

