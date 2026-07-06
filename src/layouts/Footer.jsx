import { memo } from "react";
import { Mail, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faGithub,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
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
    <footer className="bg-neutral text-neutral-content px-4 pt-14 pb-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
        <div>
          <Brand isWhite />
          <p className="text-neutral-content/70 mt-6 max-w-xs text-sm leading-7">
            A modern e-wallet interface for transfers, top ups, and real-time
            transaction visibility.
          </p>
        </div>
        <div>
          <h4 className="text-neutral-content mb-5 text-sm font-black tracking-wider uppercase">
            Get In Touch
          </h4>
          <ul className="text-neutral-content/70 space-y-4 text-sm">
            {CONTACT_ITEMS.map(({ Icon, text }) => (
              <li key={text} className="flex min-w-0 items-center gap-3">
                <Icon size={16} className="shrink-0" aria-hidden="true" />
                <span className="break-all">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-neutral-content mb-5 text-sm font-black tracking-wider uppercase">
            Social Media
          </h4>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="border-neutral-content/20 bg-neutral-content/10 text-neutral-content hover:bg-primary flex h-10 w-10 items-center justify-center rounded-2xl border transition hover:-translate-y-0.5"
              >
                <FontAwesomeIcon icon={icon} className="text-base" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-neutral-content mb-5 text-sm font-black tracking-wider uppercase">
            Newsletter
          </h4>
          <form
            className="space-y-3"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Enter Your Email"
              autoComplete="email"
              required
              className="border-neutral-content/20 bg-neutral-content/10 text-neutral-content placeholder:text-neutral-content/50 focus:border-primary/60 focus:ring-primary/20 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-4"
            />
            <button
              type="submit"
              className="from-primary to-secondary text-neutral-content hover:from-primary/90 hover:to-secondary/90 w-full rounded-2xl bg-gradient-to-r px-4 py-3 text-sm font-black transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-base-300/40 text-neutral-content/60 mx-auto mt-12 max-w-7xl border-t pt-6 text-center text-sm">
        © {currentYear} All Rights Reserved by E-Wallet
      </div>
    </footer>
  );
});

export default Footer;
