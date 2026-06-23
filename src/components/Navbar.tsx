import React, { useState } from 'react';
import { Search, ShoppingBag, UserCheck, Menu, Truck, ChevronRight } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  isAdmin: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onTrackOrderClick: () => void;
  onAboutClick: () => void;
  onReturnPolicyClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onCartClick,
  onAdminClick,
  isAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onTrackOrderClick,
  onAboutClick,
  onReturnPolicyClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const menuItems = [
    {
      id: 'rimless',
      label: 'Rimless Glasses',
      type: 'dropdown',
      subItems: [
        { id: 'rimless', label: 'All Rimless' },
        { id: 'rimless-men', label: 'Men Rimless' },
        { id: 'rimless-women', label: 'Female Rimless' },
      ],
    },
    {
      id: 'blue-cut',
      label: 'Screen Glasses',
      type: 'dropdown',
      subItems: [
        { id: 'blue-cut', label: 'All Screen Glasses' },
        { id: 'blue-cut-men', label: 'Men Screen Glasses' },
        { id: 'blue-cut-women', label: 'Female Screen Glasses' },
      ],
    },
    {
      id: 'transition',
      label: 'Intelligent Glasses',
      type: 'dropdown',
      subItems: [
        { id: 'transition', label: 'All Intelligent Glasses' },
        { id: 'transition-men', label: 'Men Intelligent' },
        { id: 'transition-women', label: 'Female Intelligent' },
      ],
    },
    {
      id: 'sunglasses',
      label: 'Sunglasses',
      type: 'dropdown',
      subItems: [
        { id: 'sunglasses', label: 'All Sunglasses' },
        { id: 'sunglasses-men', label: "Men's Sunglasses" },
        { id: 'sunglasses-women', label: 'Ladies Sunglasses' },
      ],
    },
    { id: 'kids-eyewear', label: 'Kids Eyewear', type: 'category' },
    { id: 'contact-lenses', label: 'Contact Lenses', type: 'category' },
    { id: 'accessories', label: 'Accessories', type: 'category' },
  ];

  const mobileScrollItems = [
    { id: 'rimless', label: 'Rimless Glasses' },
    { id: 'blue-cut', label: 'Screen Glasses' },
    { id: 'transition', label: 'Intelligent Glasses' },
    { id: 'sunglasses', label: 'Sunglasses' },
    { id: 'kids-eyewear', label: 'Kids Eyewear' },
    { id: 'contact-lenses', label: 'Contact Lenses' },
    { id: 'accessories', label: 'Accessories' },
  ];

  const drawerItems = [
    { id: 'rimless-header', label: 'Rimless Glasses 💎', type: 'header' },
    { id: 'rimless', label: 'Rimless Glasses', hasChevron: true, type: 'category' },
    { id: 'rimless-men', label: '↳ Men Rimless', hasChevron: false, type: 'category' },
    { id: 'rimless-women', label: '↳ Female Rimless', hasChevron: false, type: 'category' },

    { id: 'other-header', label: 'Other Collections 🌟', type: 'header' },
    { id: 'blue-cut', label: 'Screen Glasses', hasChevron: true, type: 'category' },
    { id: 'blue-cut-men', label: '↳ Men Screen Glasses', hasChevron: false, type: 'category' },
    { id: 'blue-cut-women', label: '↳ Female Screen Glasses', hasChevron: false, type: 'category' },

    { id: 'transition', label: 'Intelligent Glasses', hasChevron: true, type: 'category' },
    { id: 'transition-men', label: '↳ Men Intelligent Glasses', hasChevron: false, type: 'category' },
    { id: 'transition-women', label: '↳ Female Intelligent Glasses', hasChevron: false, type: 'category' },

    { id: 'sunglasses', label: 'Sunglasses', hasChevron: true, type: 'category' },
    { id: 'sunglasses-men', label: "↳ Men's Sunglasses", hasChevron: false, type: 'category' },
    { id: 'sunglasses-women', label: '↳ Ladies Sunglasses', hasChevron: false, type: 'category' },

    { id: 'kids-eyewear', label: 'Kids Eyewear', hasChevron: false, type: 'category' },
    { id: 'contact-lenses', label: 'Contact Lenses', hasChevron: false, type: 'category' },
    { id: 'accessories', label: 'Accessories', hasChevron: false, type: 'category' },

    { id: 'info-header', label: 'Information ℹ️', type: 'header' },
    { id: 'about-us', label: 'About Us', hasChevron: false, type: 'modal' },
    { id: 'return-policy', label: 'Return Policy', hasChevron: false, type: 'modal' },
    { id: 'track-order', label: 'Track Order', hasChevron: false, type: 'modal' },
  ];

  const handleItemClick = (item: { id: string; label: string; type: string }) => {
    if (item.type === 'category') {
      setSelectedCategory(item.id);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-[60] w-full glass-nav shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 xl:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24 gap-4 lg:gap-1.5 xl:gap-4">
            {/* Mobile Hamburger Menu Trigger (Left side on mobile) */}
            <div className="flex lg:hidden items-center justify-start flex-1">
              <button
                className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                onClick={() => setMobileMenuOpen(true)}
                title="Open Menu"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Logo: Centered on mobile, left-aligned on desktop */}
            <div
              className="flex items-center justify-center lg:justify-start cursor-pointer shrink-0 select-none hover:scale-[1.02] transition-transform duration-300 flex-1 lg:flex-none py-1"
              onClick={() => setSelectedCategory('all')}
            >
              <img
                src="/images/RiazSons.png"
                className="h-[44px] sm:h-[48px] lg:h-[64px] xl:h-[76px] w-auto object-contain"
                alt="Riaz Sons Logo"
              />
            </div>
            {/* Desktop Navigation Category Tabs (Left-aligned next to logo, removing the empty space) */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 flex-nowrap py-2 lg:ml-2 xl:ml-6 lg:mr-auto">
              {menuItems.map((item) => {
                if (item.type === 'dropdown') {
                  const isSelected = selectedCategory === item.id || selectedCategory.startsWith(item.id + '-');
                  return (
                    <div key={item.id} className="relative group py-2">
                      <button
                        onClick={() => setSelectedCategory(item.id)}
                        className={`px-1.5 lg:px-1 xl:px-2.5 2xl:px-3 py-2 rounded-full text-xs lg:text-[10px] xl:text-[12px] 2xl:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-1 ${isSelected
                          ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                          : 'text-slate-700 hover:text-primary hover:bg-slate-100'
                          }`}
                      >
                        {item.label}
                        <svg className="w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-[100] text-left">
                        {item.subItems?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedCategory(sub.id)}
                            className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold transition-colors ${selectedCategory === sub.id ? 'text-primary bg-primary/5' : 'text-slate-700 hover:text-primary hover:bg-slate-50'
                              }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isSelected = selectedCategory === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`px-1.5 lg:px-1 xl:px-2.5 2xl:px-3 py-2 rounded-full text-xs lg:text-[10px] xl:text-[12px] 2xl:text-sm font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap ${isSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'text-slate-700 hover:text-primary hover:bg-slate-100'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Side: Search, Admin, Cart (No mobile hamburger menu trigger here) */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-1 xl:gap-2 justify-end shrink-0 -mr-1.5 flex-1 lg:flex-none">
              {/* Search Icon Button (Mobile & Tablet Screens Only) */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-300 cursor-pointer"
                title="Search"
              >
                <Search size={20} />
              </button>

              {/* Search Input Box (Responsive expand-on-focus) */}
              <div className="relative hidden lg:block lg:w-20 xl:w-36 2xl:w-44 transition-all duration-300 focus-within:lg:w-28 focus-within:xl:w-48 focus-within:2xl:w-56">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-1.5 border border-slate-200 rounded-full bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white focus:border-primary transition-all duration-300 font-medium placeholder-slate-400"
                />
                <Search className="absolute left-3 top-2 text-slate-400 w-3.5 h-3.5" />
              </div>

              {/* Admin Toggle Mode Button */}
              <div className="relative group flex items-center">
                <button
                  onClick={onAdminClick}
                  className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 relative cursor-pointer ${isAdmin
                    ? 'bg-secondary text-dark-obsidian font-bold hover:bg-secondary/80 scale-105 shadow-md shadow-secondary/20'
                    : 'text-slate-600 hover:text-secondary hover:bg-slate-100'
                    }`}
                >
                  <UserCheck size={20} />
                  {isAdmin && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] text-white px-1 rounded-full font-extrabold animate-pulse">
                      ON
                    </span>
                  )}
                </button>
                {/* Tooltip */}
                <span className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-extrabold py-1.5 px-2.5 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 hidden md:block">
                  {isAdmin ? "Exit Admin Panel" : "Admin Panel"}
                </span>
              </div>

              {/* Track Order Trigger Icon Button (Desktop Only) */}
              <div className="relative group lg:flex items-center hidden">
                <button
                  onClick={onTrackOrderClick}
                  className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-300 relative cursor-pointer"
                >
                  <Truck size={20} />
                </button>
                {/* Tooltip */}
                <span className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-extrabold py-1.5 px-2.5 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 hidden md:block">
                  Track Order
                </span>
              </div>

              {/* Shopping Cart Trigger */}
              <div className="relative group flex items-center">
                <button
                  onClick={onCartClick}
                  className="p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-300 relative cursor-pointer"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scale-up">
                      {cartCount}
                    </span>
                  )}
                </button>
                {/* Tooltip */}
                <span className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-extrabold py-1.5 px-2.5 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 whitespace-nowrap z-50 hidden md:block">
                  View Cart
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Horizontal Category Scroll Bar */}
        <div className="lg:hidden w-full border-t border-slate-100/80 bg-white/95 overflow-x-auto no-scrollbar py-2.5 px-4">
          <div className="flex items-center space-x-2 flex-nowrap">
            {mobileScrollItems.map((item) => {
              const isSelected = selectedCategory === item.id || (item.id === 'sunglasses' && selectedCategory.startsWith('sunglasses-'));
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 ${isSelected
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-100 bg-slate-50 border border-slate-100'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="lg:hidden w-full bg-white border-b border-slate-150 p-3 flex items-center justify-between gap-2 animate-fade-in relative z-30 shadow-inner">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search glasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-full bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-left"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400 w-3.5 h-3.5" />
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setMobileSearchOpen(false);
              }}
              className="px-3 py-2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* MOBILE LEFT NAVIGATION DRAWER */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Backdrop shade */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer content pane (slides from left) */}
        <div
          className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[100] flex flex-col transition-transform duration-300 ease-out transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
          {/* Drawer Search Field */}
          <div className="pt-4 px-4 pb-3 border-b border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium placeholder-slate-400"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Drawer Body (Vertical items list with border separators) */}
          <div className="flex-1 overflow-y-auto bg-white">
            {drawerItems.map((item) => {
              if (item.type === 'header') {
                return (
                  <div key={item.id} className="bg-slate-50 px-5 py-2.5 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-left">
                    {item.label}
                  </div>
                );
              }

              const isSelected = selectedCategory === item.id;
              const isSubItem = item.id.endsWith('-men') || item.id.endsWith('-women');
              return (
                <div key={item.id} className="flex items-stretch border-b border-slate-100 bg-white">
                  <button
                    onClick={() => {
                      if (item.type === 'category') {
                        setSelectedCategory(item.id);
                      } else if (item.id === 'about-us') {
                        onAboutClick();
                      } else if (item.id === 'return-policy') {
                        onReturnPolicyClick();
                      } else if (item.id === 'track-order') {
                        onTrackOrderClick();
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-grow text-left px-5 py-4.5 text-[14px] font-semibold transition-all cursor-pointer ${isSubItem ? 'pl-9 text-xs text-slate-500 bg-slate-50/10' : 'text-slate-800'
                      } ${isSelected
                        ? 'text-primary bg-slate-50/50'
                        : 'hover:text-primary hover:bg-slate-50/50'
                      }`}
                  >
                    {item.label}
                  </button>
                  {item.hasChevron && (
                    <button
                      onClick={() => {
                        if (item.type === 'category') {
                          setSelectedCategory(item.id);
                        } else if (item.id === 'about-us') {
                          onAboutClick();
                        } else if (item.id === 'return-policy') {
                          onReturnPolicyClick();
                        } else if (item.id === 'track-order') {
                          onTrackOrderClick();
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="w-14 flex items-center justify-center border-l border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
