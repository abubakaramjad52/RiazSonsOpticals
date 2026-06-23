import React from 'react';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onTryOn: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onTryOn,
}) => {
  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );

  const isTransitionProduct = product.category === 'transition';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-primary/25 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between transform hover:-translate-y-1 relative text-left">
      
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-red-500 text-white font-extrabold text-[8px] sm:text-[10px] px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded uppercase tracking-wider shadow-sm">
          -{discountPercent}%
        </span>
      )}

      {/* Card Image Area with Overlay controls */}
      <div 
        className={`relative w-full bg-slate-50 overflow-hidden cursor-pointer ${
          isTransitionProduct ? 'aspect-[4/3] border-b border-slate-100' : 'aspect-square'
        }`} 
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
          loading="lazy"
        />
        {/* Hover overlay with button */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white hover:bg-slate-100 text-dark-obsidian font-bold text-xs px-4 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 duration-300"
          >
            <Eye size={14} />
            Quick View
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Title */}
          <h3 
            className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => onQuickView(product)}
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                className={`${i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'} w-3 h-3`}
              />
            ))}
          </div>

          {/* Pricing: original price with line-through followed by current price in primary color */}
          <div className="flex items-baseline gap-2 pt-0.5">
            {product.originalPrice > product.currentPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                Rs {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-primary">
              Rs {product.currentPrice.toLocaleString()}
            </span>
          </div>

          {/* Size */}
          <div className="text-[10px] sm:text-xs text-slate-500 font-light">
            Size: {product.size}
          </div>
        </div>

        {/* Pricing & Actions Drawer */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-600 uppercase tracking-wider">
            Cash on Delivery
          </span>

          <div className="flex items-center gap-1.5">
            {product.category !== 'contact-lenses' && product.category !== 'accessories' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTryOn(product);
                }}
                className="bg-secondary hover:bg-secondary/90 text-dark-obsidian font-extrabold text-[9px] sm:text-xs px-2 py-1.5 sm:px-3 sm:py-2 rounded transition-all duration-300 shadow-md shadow-secondary/15 hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                title="Virtual Try-On"
              >
                🕶️ <span className="hidden xs:inline">Try On</span>
              </button>
            )}

            <button
              onClick={() => onAddToCart(product)}
              className="bg-primary hover:bg-primary-hover text-white p-1.5 sm:p-2 rounded transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/25 hover:scale-105 active:scale-95 group/btn cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingCart size={13} className="sm:w-3.5 sm:h-3.5 group-hover/btn:rotate-6 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
