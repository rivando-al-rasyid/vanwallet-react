// Footer.jsx
import Brand from "../components/Brand";
import { Phone, Mail } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebookF,
  faInstagram,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-blue-600 px-6 pb-10 pt-16 text-white lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-4">
        <div>
          <Brand />
          <p className="mt-6 max-w-xs text-sm leading-7 text-white/80">
            Clarity gives you the blocks and components you need to create a
            truly professional website.
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Get In Touch
          </h4>
          <div className="space-y-4 text-sm text-white/90">
            <div className="flex items-center gap-3">
              <Phone size={16} />
              <span>+62 5637 8882 9901</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} />
              <span>contact@zwallet.com</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Social Media
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Twitter"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-base" />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-base" />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-base" />
            </a>

            <a
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="GitHub"
            >
              <FontAwesomeIcon icon={faGithub} className="text-base" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
            Newsletter
          </h4>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-sm text-gray-800 outline-none"
            />
            <button className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-white/20 pt-6 text-center text-sm text-white/70">
        © Copyright 2022. All Rights Reserved by ClarityUI
      </div>
    </footer>
  );
}
