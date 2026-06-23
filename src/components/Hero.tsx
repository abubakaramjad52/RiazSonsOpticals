import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Premium Eyeglasses',
      description: 'Handcrafted prescription frames with state-of-the-art blue-cut and anti-glare vision clarity.',
      ctaCategory: 'blue-cut',
      buttonText: 'Shop Eyeglasses',
      bgGradient: 'from-slate-950/80 via-slate-900/40 to-transparent',
      image: '/images/hero_glasses.png',
    },
    {
      title: 'Precision Optical & Contact Lenses',
      description: 'Advanced contact lens technology engineered for crystal clear sight and premium ocular comfort.',
      ctaCategory: 'contact-lenses',
      buttonText: 'Shop Lenses',
      bgGradient: 'from-slate-950/80 via-slate-900/40 to-transparent',
      image: '/images/hero_lenses.png',
    },
    {
      title: 'Polarized Designer Sunglasses',
      description: 'Ultimate UV400 sun protection coupled with contemporary, high-fashion styling.',
      ctaCategory: 'sunglasses',
      buttonText: 'Shop Sunglasses',
      bgGradient: 'from-slate-950/80 via-slate-900/40 to-transparent',
      image: '/images/hero_sunglasses.png',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 h-[480px] md:h-[560px] flex items-center">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center ${
            index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0 pointer-events-none'
          }`}
        >
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} z-10`} />
          
          {/* Background image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-all duration-7000 ease-out"
          />

          {/* Slide Content */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-20 text-white flex justify-start items-center">
            {/* Elegant simplified overlay container */}
            <div className="max-w-xl text-left bg-slate-950/65 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-4">
              
              {/* Slide Name/Title */}
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {slide.title}
              </h2>

              {/* Description */}
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => onExploreClick(slide.ctaCategory)}
                  className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105"
                >
                  {slide.buttonText}
                </button>
                <a
                  href="https://wa.me/923003544108?text=Hey%20Riaz%20Sons%20team%2C%20I%20want%20to%20inquire%20about%20ordering%20glasses%20online!"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/25 px-5 py-3 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 flex items-center gap-1.5 backdrop-blur-sm"
                >
                  WhatsApp Order
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-8' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
