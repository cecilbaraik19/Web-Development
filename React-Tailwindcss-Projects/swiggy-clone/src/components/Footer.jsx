import React from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";

const SwiggyFooter = () => {
  return (
    <footer className="bg-white">
      {/* Top Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand & Logo Column */}
        <div>
          <div className="text-3xl font-extrabold text-orange-500">
            S
          </div>

          <h3 className="mt-2 text-xl font-bold text-gray-900">
            Swiggy
          </h3>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 Swiggy Limited
          </p>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Company
          </h4>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                About Us
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Swiggy Corporate
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Careers
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Team
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Swiggy One
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Swiggy Instamart
              </button>
            </li>
          </ul>
        </div>

        {/* Contact & Legal Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Contact us
          </h4>

          <ul className="space-y-3 text-sm text-gray-600 mb-6">
            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Help & Support
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Partner With Us
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Ride With Us
              </button>
            </li>
          </ul>

          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Legal
          </h4>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Terms & Conditions
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Cookie Policy
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        {/* Available Cities Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Available in:
          </h4>

          <ul className="space-y-3 text-sm text-gray-600 mb-4">
            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Bangalore
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Gurgaon
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Hyderabad
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Delhi
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Mumbai
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Pune
              </button>
            </li>
          </ul>

          <button
            type="button"
            className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-600 hover:border-gray-400"
          >
            <span>685 cities</span>
            <HiChevronDown className="text-sm text-gray-500" />
          </button>
        </div>

        {/* Life at Swiggy & Social Links */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Life at Swiggy
          </h4>

          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Explore With Swiggy
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Swiggy News
              </button>
            </li>

            <li>
              <button
                type="button"
                className="hover:text-gray-900 text-left"
              >
                Snackables
              </button>
            </li>
          </ul>

          <h4 className="font-bold text-gray-900 mb-4 text-base">
            Social Links
          </h4>

          <div className="flex space-x-5 text-gray-700">

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gray-900 transition-colors"
            >
              <FaLinkedin className="text-xl" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-900 transition-colors"
            >
              <FaInstagram className="text-xl" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gray-900 transition-colors"
            >
              <FaFacebookF className="text-xl" />
            </a>

            {/* Pinterest */}
            <a
              href="https://www.pinterest.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="hover:text-gray-900 transition-colors"
            >
              <FaPinterestP className="text-xl" />
            </a>

            {/* Twitter / X */}
            <a
              href="https://x.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-gray-900 transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Download Banner Section */}
      <div className="bg-gray-100 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

          <span className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
            For better experience, download the Swiggy app now
          </span>

          <div className="flex space-x-4">

            {/* App Store Button */}
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="bg-black text-white flex items-center px-4 py-2 rounded-xl border border-gray-800 hover:bg-gray-900 w-44 transition-colors"
            >
              <FaApple className="text-2xl mr-3" />

              <div className="text-left">
                <p className="text-[10px] uppercase font-semibold text-gray-400 leading-tight">
                  Download on the
                </p>

                <p className="text-sm font-bold leading-tight">
                  App Store
                </p>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="bg-black text-white flex items-center px-4 py-2 rounded-xl border border-gray-800 hover:bg-gray-900 w-44 transition-colors"
            >
              <FaGooglePlay className="text-xl mr-3" />

              <div className="text-left">
                <p className="text-[10px] uppercase font-semibold text-gray-400 leading-tight">
                  GET IT ON
                </p>

                <p className="text-sm font-bold leading-tight">
                  Google Play
                </p>
              </div>
            </a>

          </div>
        </div>
      </div>

      {/* Portfolio Disclaimer */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 text-center">
        <p className="text-lg font-semibold text-gray-900">
          © {new Date().getFullYear()} FoodieHub
        </p>

        <p className="text-sm text-gray-500 mt-3 max-w-3xl mx-auto">
          This is a{" "}
          <span className="font-medium">
            Swiggy-inspired clone
          </span>{" "}
          created for educational and portfolio purposes. It is not
          affiliated with{" "}
          <span className="font-medium">
            Swiggy
          </span>.
        </p>
      </div>
    </footer>
  );
};

export default SwiggyFooter;