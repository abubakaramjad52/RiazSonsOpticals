import React from 'react';

interface GenderBannersProps {
  onGenderSelect: (gender: string) => void;
}

export const GenderBanners: React.FC<GenderBannersProps> = ({ onGenderSelect }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8 md:mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-obsidian">
          Shop by Category
        </h2>
        <p className="text-sm text-slate-500 font-light max-w-lg mx-auto">
          Riaz Sons Opticals offers premium, budget-friendly eyeglasses and sunglasses curated for your lifestyle.
        </p>
        <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:gap-8">
        
        {/* Men's Banner */}
        <div className="relative h-[180px] xs:h-[240px] sm:h-[320px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl group transition-all duration-500 border border-slate-100 flex items-end">
          {/* Background Image */}
          <img
            src="/images/banner_men.png"
            alt="Men's Eyewear"
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-7000 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

          {/* Banner Content */}
          <div className="relative z-20 p-3 xs:p-5 sm:p-8 space-y-1.5 xs:space-y-3 text-left w-full">
            <span className="inline-block text-[7px] xs:text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest text-secondary bg-secondary/15 border border-secondary/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Men's Collection
            </span>
            <h3 className="text-xs xs:text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
              Men's Eyewear
            </h3>
            <p className="hidden sm:block text-slate-200 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
              Explore sleek metal frames, classic aviators, and bold rectangular designs crafted for the modern man.
            </p>
            <div className="pt-0.5 xs:pt-2">
              <button
                onClick={() => onGenderSelect('men')}
                className="bg-white hover:bg-slate-100 text-dark-obsidian font-bold text-[8px] xs:text-[10px] sm:text-xs md:text-sm px-3 xs:px-5 sm:px-6 py-1.5 xs:py-2.5 sm:py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Shop Men's
              </button>
            </div>
          </div>
        </div>

        {/* Women's Banner */}
        <div className="relative h-[180px] xs:h-[240px] sm:h-[320px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl group transition-all duration-500 border border-slate-100 flex items-end">
          {/* Background Image */}
          <img
            src="/images/banner_women.png"
            alt="Women's Eyewear"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-7000 ease-out"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

          {/* Banner Content */}
          <div className="relative z-20 p-3 xs:p-5 sm:p-8 space-y-1.5 xs:space-y-3 text-left w-full">
            <span className="inline-block text-[7px] xs:text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest text-primary bg-primary/15 border border-primary/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
              Women's Collection
            </span>
            <h3 className="text-xs xs:text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
              Female Glasses
            </h3>
            <p className="hidden sm:block text-slate-200 text-xs sm:text-sm font-light max-w-sm leading-relaxed">
              Discover elegant cat-eye silhouettes, vintage round acetates, and trendy translucent designs for women.
            </p>
            <div className="pt-0.5 xs:pt-2">
              <button
                onClick={() => onGenderSelect('women')}
                className="bg-white hover:bg-slate-100 text-dark-obsidian font-bold text-[8px] xs:text-[10px] sm:text-xs md:text-sm px-3 xs:px-5 sm:px-6 py-1.5 xs:py-2.5 sm:py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Shop Female
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
