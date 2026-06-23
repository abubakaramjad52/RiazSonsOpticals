import React from 'react';

interface CategoryListProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  const categories = [
    { id: 'blue-cut', title: 'Screen Glasses', image: '/images/blue_cut_glasses.png' },
    { id: 'sunglasses', title: 'Sunglasses', image: '/images/fashion_sunglasses.png' },
    { id: 'transition', title: 'Transition Glasses', image: '/images/transition_glasses.png' },
    { id: 'rimless', title: 'Rimless Glasses', image: '/images/blue_cut_glasses.png' },
    { id: 'kids-eyewear', title: 'Kids Eyewear', image: '/images/kids_glasses.png' },
    { id: 'contact-lenses', title: 'Contact Lenses', image: '/images/contact_lenses.png' },
    { id: 'men', title: "Men Glasses", image: '/images/banner_men.png' },
    { id: 'women', title: "Female Glasses", image: '/images/banner_women.png' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-obsidian">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-light">
            Browse our premium Riaz Sons Opticals eyewear collections. Select a category to browse.
          </p>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
        </div>

        {/* Circular Categories Grid (Responsive wrapping flex) */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onCategorySelect(cat.id)}
                className="flex flex-col items-center cursor-pointer group w-[90px] sm:w-[120px] transition-transform duration-300 hover:scale-105"
              >
                {/* Circle Frame */}
                <div
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-50 relative ${
                    isSelected
                      ? 'border-primary ring-4 ring-primary/10 shadow-lg'
                      : 'border-slate-100 hover:border-primary/40 shadow-sm hover:shadow-md'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-[1px]" />
                  )}
                </div>

                {/* Category Label */}
                <span className={`text-[10px] sm:text-xs font-extrabold tracking-tight mt-3 text-center transition-colors group-hover:text-primary ${
                  isSelected ? 'text-primary' : 'text-slate-700'
                }`}>
                  {cat.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
