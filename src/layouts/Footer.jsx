import { memo } from "react";
import Brand from "../components/Brand";
import { Icon } from "@iconify/react";

const CONTACT_ITEMS = [
  { icon: "lucide:phone", text: "+62 5637 8882 9901" },
  { icon: "lucide:mail", text: "contact@zwallet.com" },
];

const SOCIAL_LINKS = [
  { icon: "simple-icons:twitter", label: "Twitter", href: "#" },
  { icon: "simple-icons:facebook", label: "Facebook", href: "#" },
  { icon: "simple-icons:instagram", label: "Instagram", href: "#" },
  { icon: "simple-icons:github", label: "GitHub", href: "#" },
];

const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-600 px-6 pb-10 pt-16 text-white lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Brand isWhite />
          <p className="mt-6 max-w-xs text-sm leading-7 text-white/80">
            Clarity gives you the blocks and components you need to create a
            truly professional website.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider">
            Get In Touch
          </h4>
          <ul className="space-y-4 text-sm text-white/90">
            {CONTACT_ITEMS.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <Icon icon={icon} width={16} height={16} aria-hidden="true" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider">
            Social Media
          </h4>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 transition hover:bg-gray-100"
              >
                <Icon icon={icon} width={16} height={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider">
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
              className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-sm text-white/70">
        © {currentYear} All Rights Reserved by ClarityUI
      </div>
    </footer>
  );
});

export default Footer;
