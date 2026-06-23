import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface FooterProps {
  onCategoryClick: (category: string) => void;
  onAboutClick: () => void;
  onReturnPolicyClick: () => void;
  onTrackOrderClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onCategoryClick,
  onAboutClick,
  onReturnPolicyClick,
  onTrackOrderClick,
}) => {
  return (
    <footer className="bg-dark-obsidian text-slate-400 border-t border-slate-800">
      
      {/* Upper features banners */}
      <div className="border-b border-slate-800 py-10 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 bg-primary/15 rounded-full text-primary shrink-0 border border-primary/20">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase">Free Shipping</h4>
              <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                Enjoy complimentary shipping on all orders over Rs 3,000 nationwide.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 bg-secondary/15 rounded-full text-secondary shrink-0 border border-secondary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase">Cash on Delivery</h4>
              <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                Pay only when you receive your glasses at your doorstep. Safe & reliable.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3.5 bg-teal-500/15 rounded-full text-teal-400 shrink-0 border border-teal-500/20">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase">100% Money Back</h4>
              <p className="text-xs text-slate-500 mt-1 font-light leading-relaxed">
                Not satisfied with the frame size or lens power? Returns accepted within 7 days.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Middle Footer links grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onCategoryClick('all')}
          >
            {/* Custom PNG Logo */}
            <img 
              src="/images/RiazSons.png" 
              className="h-12 sm:h-14 w-auto object-contain" 
              alt="Riaz Sons Logo"
            />
          </div>
          <p className="text-xs font-light text-slate-500 leading-relaxed">
            Riaz Sons Opticals is Pakistan’s online destination for premium-quality prescription glasses, computer lenses, photochromic transitions, and fashion sunglasses.
          </p>
          <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex flex-col gap-0.5">
            <span>Phone Orders: 0300-3544108</span>
            <span>Phone Orders: 0300-3544105</span>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
            Categories
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onCategoryClick('blue-cut')} className="hover:text-primary transition-colors">
                Screen / Blue Cut Glasses
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryClick('sunglasses')} className="hover:text-primary transition-colors">
                Fashion Sunglasses
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryClick('transition')} className="hover:text-primary transition-colors">
                Transition Photochromic Glasses
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryClick('kids-eyewear')} className="hover:text-primary transition-colors">
                Kids Eyewear Collection
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryClick('rimless')} className="hover:text-primary transition-colors">
                Rimless Premium Glasses
              </button>
            </li>
            <li>
              <button onClick={() => onCategoryClick('contact-lenses')} className="hover:text-primary transition-colors">
                Cosmetic Contact Lenses
              </button>
            </li>
          </ul>
        </div>

        {/* Useful links Column */}
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
            Useful Info
          </h4>
          <ul className="space-y-2 text-xs text-left">
            <li>
              <button onClick={onAboutClick} className="hover:text-primary transition-colors cursor-pointer text-left">
                About Us & Lab Tech
              </button>
            </li>
            <li>
              <button onClick={onReturnPolicyClick} className="hover:text-primary transition-colors cursor-pointer text-left">
                Refund & Return Policy
              </button>
            </li>
            <li>
              <button onClick={onTrackOrderClick} className="hover:text-primary transition-colors cursor-pointer text-left">
                Track Delivery Order
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info Column */}
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-2">
            Store Contact
          </h4>
          <ul className="space-y-3.5 text-xs font-light">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <a
                  href="https://www.google.com/maps?q=32.2613056,75.1693611"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors text-white font-medium"
                >
                  Ikhlaspur road shakargarh
                </a>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Location: 32°15'40.7"N 75°10'09.7"E
                </span>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="text-secondary shrink-0 mt-0.5" />
              <div className="flex flex-col text-left">
                <span>0300-3544108</span>
                <span>0300-3544105</span>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-primary shrink-0" />
              <span>info@riazopticals.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Lower Copyright & Whatsapp floating */}
      <div className="bg-slate-950 py-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>
            © {new Date().getFullYear()} Riaz Sons Opticals. All Rights Reserved. Built with React & Tailwind CSS.
          </span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

    </footer>
  );
};

