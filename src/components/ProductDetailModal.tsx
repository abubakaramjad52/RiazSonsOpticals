import React, { useState } from 'react';
import { X, ShieldCheck, ShoppingCart, Info, Star } from 'lucide-react';
import type { Product, PrescriptionDetails } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, prescription?: PrescriptionDetails, lensType?: 'eyesight' | 'no-eyesight') => void;
  onTryOn: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onTryOn,
}) => {
  const [lensType, setLensType] = useState<'eyesight' | 'no-eyesight'>('no-eyesight');

  const allImages = product.images && product.images.length > 0 ? product.images : [product.imageUrl];
  const [activeImage, setActiveImage] = useState(allImages[0]);
  
  // Prescription states
  const [rightSph, setRightSph] = useState('0.00');
  const [rightCyl, setRightCyl] = useState('0.00');
  const [rightAxis, setRightAxis] = useState('0');
  const [rightPd, setRightPd] = useState('63');
  
  const [leftSph, setLeftSph] = useState('0.00');
  const [leftCyl, setLeftCyl] = useState('0.00');
  const [leftAxis, setLeftAxis] = useState('0');
  const [leftPd, setLeftPd] = useState('63');
  
  const [remarks, setRemarks] = useState('');

  // Dropdown lists
  const sphOptions = [];
  for (let i = -8; i <= 6; i += 0.25) {
    const prefix = i > 0 ? '+' : '';
    sphOptions.push(i === 0 ? '0.00' : `${prefix}${i.toFixed(2)}`);
  }

  const cylOptions = [];
  for (let i = -4; i <= 0; i += 0.25) {
    cylOptions.push(i === 0 ? '0.00' : `${i.toFixed(2)}`);
  }

  const axisOptions = Array.from({ length: 37 }, (_, i) => (i * 5).toString());
  const pdOptions = Array.from({ length: 26 }, (_, i) => (55 + i).toString());

  const itemPrice = product.currentPrice + (lensType === 'eyesight' ? 1000 : 0);

  const handleAddToCart = () => {
    let prescription: PrescriptionDetails | undefined = undefined;

    if (lensType === 'eyesight') {
      prescription = {
        rightEye: { sph: rightSph, cyl: rightCyl, axis: rightAxis, pd: rightPd },
        leftEye: { sph: leftSph, cyl: leftCyl, axis: leftAxis, pd: leftPd },
        remarks: remarks.trim() || undefined,
      };
    }

    onAddToCart(product, prescription, lensType);
    onClose();
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative border border-slate-100 flex flex-col md:flex-row overflow-hidden my-8 max-h-[90vh] md:max-h-none md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {/* Left: Product Image Section */}
        <div className="w-full md:w-1/2 bg-slate-50 relative flex flex-col justify-between p-4 min-h-[350px] md:min-h-full">
          <div className="relative flex-1 min-h-[260px] md:min-h-[350px] overflow-hidden rounded-2xl bg-white border border-slate-100 flex items-center justify-center p-2">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-contain max-h-[300px] md:max-h-[400px]"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
              {allImages.map((imgUrl, index) => {
                const isActive = imgUrl === activeImage;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 bg-white shadow-xs transition-all cursor-pointer ${
                      isActive ? 'border-primary scale-105' : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <img src={imgUrl} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Info and Configuration */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[60vh] md:max-h-[85vh] flex flex-col justify-between">
          <div>
            {/* Category / Specifications */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-primary font-bold uppercase tracking-wider">
                {product.category.replace('-', ' ')}
              </span>
              <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full uppercase text-[10px]">
                Frame Size: {product.size}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-dark-obsidian leading-snug">
              {product.title}
            </h2>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-1.5 mt-2 mb-4">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.round(product.rating) ? 'text-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                {product.rating.toFixed(1)} / 5.0 ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-600 font-light text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Pricing Section */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between mb-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Store Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-dark-obsidian">
                    Rs {itemPrice.toLocaleString()}
                  </span>
                  {product.originalPrice > product.currentPrice && (
                    <span className="text-sm text-slate-400 line-through font-semibold">
                      Rs {(product.originalPrice + (lensType === 'eyesight' ? 1000 : 0)).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 block">
                  COD Available
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Delivered in 3-5 days</span>
              </div>
            </div>

            {/* Select Lens Type Selector */}
            {product.isPrescriptionCompatible && (
              <div className="mb-6 space-y-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  Select Lens Type
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLensType('no-eyesight')}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      lensType === 'no-eyesight'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-medium'
                    }`}
                  >
                    <span className="text-sm">No Eyesight</span>
                    <span className="text-[10px] opacity-75">Included (Zero Power)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLensType('eyesight')}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      lensType === 'eyesight'
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-medium'
                    }`}
                  >
                    <span className="text-sm">Eyesight Lens</span>
                    <span className="text-[10px] text-teal-600 font-bold">+ Rs 1,000</span>
                  </button>
                </div>
              </div>
            )}

            {/* Prescription Form Section */}
            {product.isPrescriptionCompatible && lensType === 'eyesight' && (
              <div className="border border-slate-150 rounded-2xl p-4 sm:p-5 mb-6 space-y-4 bg-slate-50/50 animate-fade-in">
                <div>
                  <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-teal-600" />
                    Enter Prescription Details
                  </span>
                  <span className="text-xs text-slate-500 block leading-relaxed font-light">
                    Custom-made premium prescription lenses. Free assembly in our optical lab.
                  </span>
                </div>
                
                <div className="pt-2 space-y-4">
                  {/* Prescription Table Grid */}
                  <div className="grid grid-cols-5 gap-2.5 text-center items-center text-xs">
                    <span className="font-bold text-slate-400 text-left">Eye</span>
                    <span className="font-extrabold text-slate-700 text-[10px] sm:text-xs">SPH (Power)</span>
                    <span className="font-extrabold text-slate-700 text-[10px] sm:text-xs">CYL (Cyl)</span>
                    <span className="font-extrabold text-slate-700 text-[10px] sm:text-xs">Axis</span>
                    <span className="font-extrabold text-slate-700 text-[10px] sm:text-xs">PD (mm)</span>

                    {/* Right Eye */}
                    <span className="font-extrabold text-slate-800 text-left text-xs bg-slate-100/80 p-1.5 rounded">R (OD)</span>
                    <select value={rightSph} onChange={(e) => setRightSph(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {sphOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={rightCyl} onChange={(e) => setRightCyl(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {cylOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={rightAxis} onChange={(e) => setRightAxis(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {axisOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={rightPd} onChange={(e) => setRightPd(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {pdOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>

                    {/* Left Eye */}
                    <span className="font-extrabold text-slate-800 text-left text-xs bg-slate-100/80 p-1.5 rounded">L (OS)</span>
                    <select value={leftSph} onChange={(e) => setLeftSph(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {sphOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={leftCyl} onChange={(e) => setLeftCyl(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {cylOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={leftAxis} onChange={(e) => setLeftAxis(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {axisOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={leftPd} onChange={(e) => setLeftPd(e.target.value)} className="p-1.5 border rounded-lg bg-white font-medium focus:ring-1 focus:ring-primary text-xs">
                      {pdOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>

                  {/* Remarks Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block">Extra instructions / Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. Add transition lenses, Bifocals, or custom prescription values"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quality assurance notice */}
            <div className="flex gap-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-6 font-light">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <span>
                Need help reading your prescription card? You can also complete your order, and our optical experts will contact you on WhatsApp to review your prescription.
              </span>
            </div>

          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-2 sm:gap-4 pt-4 border-t border-slate-100 mt-auto">
            {product.category !== 'contact-lenses' && (
              <button
                onClick={() => {
                  onTryOn(product);
                  onClose();
                }}
                className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-dark-obsidian rounded-xl font-extrabold shadow-md shadow-secondary/10 hover:shadow-secondary/20 transition-all text-sm flex items-center justify-center gap-1.5 hover:scale-102 active:scale-98 cursor-pointer"
              >
                🕶️ Try On
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-2 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all text-sm flex items-center justify-center gap-2 hover:scale-102 active:scale-98 cursor-pointer"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
