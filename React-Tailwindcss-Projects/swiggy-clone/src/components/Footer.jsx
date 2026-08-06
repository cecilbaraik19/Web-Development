import React from 'react';
// Import the necessary icons from the Font Awesome library within react-icons
import { 
  FaLinkedin, 
  FaInstagram, 
  FaFacebookF, 
  FaPinterestP, 
  FaTwitter, 
  FaApple, 
  FaGooglePlay 
} from 'react-icons/fa';
// Import a chevron icon for the cities dropdown
import { HiChevronDown } from 'react-icons/hi';

const SwiggyFooter = () => {
  return (
    <footer className="w-full bg-white text-gray-700 font-sans border-t border-gray-200">
      {/* Top Main Footer Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Brand & Logo Column */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2 text-orange-500 font-black text-3xl tracking-wide">
            <span className="bg-orange-500 text-white rounded-2xl px-3 py-1 text-xl font-extrabold mr-1">S</span>
            <span className="text-orange-500 font-extrabold">Swiggy</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 Swiggy Limited</p>
        </div>

        {/* Company Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">Company</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-gray-900">About Us</a></li>
            <li><a href="#" className="hover:text-gray-900">Swiggy Corporate</a></li>
            <li><a href="#" className="hover:text-gray-900">Careers</a></li>
            <li><a href="#" className="hover:text-gray-900">Team</a></li>
            <li><a href="#" className="hover:text-gray-900">Swiggy One</a></li>
            <li><a href="#" className="hover:text-gray-900">Swiggy Instamart</a></li>
          </ul>
        </div>

        {/* Contact & Legal Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">Contact us</h4>
          <ul className="space-y-3 text-sm text-gray-600 mb-6">
            <li><a href="#" className="hover:text-gray-900">Help & Support</a></li>
            <li><a href="#" className="hover:text-gray-900">Partner With Us</a></li>
            <li><a href="#" className="hover:text-gray-900">Ride With Us</a></li>
          </ul>

          <h4 className="font-bold text-gray-900 mb-4 text-base">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-600">
            <li><a href="#" className="hover:text-gray-900">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-gray-900">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Available cities Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">Available in:</h4>
          <ul className="space-y-3 text-sm text-gray-600 mb-4">
            <li><a href="#" className="hover:text-gray-900">Bangalore</a></li>
            <li><a href="#" className="hover:text-gray-900">Gurgaon</a></li>
            <li><a href="#" className="hover:text-gray-900">Hyderabad</a></li>
            <li><a href="#" className="hover:text-gray-900">Delhi</a></li>
            <li><a href="#" className="hover:text-gray-900">Mumbai</a></li>
            <li><a href="#" className="hover:text-gray-900">Pune</a></li>
          </ul>
          <button className="flex items-center space-x-2 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-600 hover:border-gray-400">
            <span>685 cities</span>
            <HiChevronDown className="text-sm text-gray-500" />
          </button>
        </div>

        {/* Life at Swiggy & Social Links Column */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 text-base">Life at Swiggy</h4>
          <ul className="space-y-3 text-sm text-gray-600 mb-8">
            <li><a href="#" className="hover:text-gray-900">Explore With Swiggy</a></li>
            <li><a href="#" className="hover:text-gray-900">Swiggy News</a></li>
            <li><a href="#" className="hover:text-gray-900">Snackables</a></li>
          </ul>

          <h4 className="font-bold text-gray-900 mb-4 text-base">Social Links</h4>
          <div className="flex space-x-5 text-gray-700">
            <a href="#" className="hover:text-gray-900 transition-colors"><FaLinkedin className="text-xl" /></a>
            <a href="#" className="hover:text-gray-900 transition-colors"><FaInstagram className="text-xl" /></a>
            <a href="#" className="hover:text-gray-900 transition-colors"><FaFacebookF className="text-xl" /></a>
            <a href="#" className="hover:text-gray-900 transition-colors"><FaPinterestP className="text-xl" /></a>
            <a href="#" className="hover:text-gray-900 transition-colors"><FaTwitter className="text-xl" /></a>
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
            <a href="#" className="bg-black text-white flex items-center px-4 py-2 rounded-xl border border-gray-800 hover:bg-gray-900 w-44 transition-colors">
              <FaApple className="text-2xl mr-3" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-semibold text-gray-400 leading-tight">Download on the</p>
                <p className="text-sm font-bold leading-tight">App Store</p>
              </div>
            </a>
            {/* Google Play Button */}
            <a href="#" className="bg-black text-white flex items-center px-4 py-2 rounded-xl border border-gray-800 hover:bg-gray-900 w-44 transition-colors">
              <FaGooglePlay className="text-xl mr-3" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-semibold text-gray-400 leading-tight">GET IT ON</p>
                <p className="text-sm font-bold leading-tight">Google Play</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SwiggyFooter;
