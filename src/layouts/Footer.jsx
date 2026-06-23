import { memo } from "react";
import { Mail, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGithub, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Brand from "../components/Brand";

const CONTACT_ITEMS = [
  { Icon: Phone, text: "+62 5637 8882 9901" },
  { Icon: Mail, text: "contact@zwallet.com" },
];
const SOCIAL_LINKS = [
  { icon: faTwitter, label: "Twitter", href: "#" },
  { icon: faFacebookF, label: "Facebook", href: "#" },
  { icon: faInstagram, label: "Instagram", href: "#" },
  { icon: faGithub, label: "GitHub", href: "#" },
];

const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-950 px-6 pt-16 pb-10 text-white lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <Brand isWhite />
          <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
            A modern e-wallet interface for transfers, top ups, and real-time transaction visibility.
          </p>
        </div>
        <div>
          <h4 className="mb-5 text-sm font-black tracking-wider uppercase text-white">Get In Touch</h4>
          <ul className="space-y-4 text-sm text-slate-300">
            {CONTACT_ITEMS.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3"><Icon size={16} aria-hidden="true" /><span>{text}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-5 text-sm font-black tracking-wider uppercase text-white">Social Media</h4>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-indigo-600">
                <FontAwesomeIcon icon={icon} className="text-base" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-5 text-sm font-black tracking-wider uppercase text-white">Newsletter</h4>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input id="newsletter-email" type="email" placeholder="Enter Your Email" autoComplete="email" required className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20" />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-black text-white transition hover:from-indigo-700 hover:to-violet-700">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-sm text-slate-500">
        © {currentYear} All Rights Reserved by E-Wallet
      </div>
    </footer>
  );
});

export default Footer;
