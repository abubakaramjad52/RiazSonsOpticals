import React, { useState } from 'react';
import { PlusCircle, Trash2, ShieldAlert, Sparkles, ListFilter, Edit } from 'lucide-react';
import type { Product } from '../types';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'inStock'>) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateProduct: (product: Product) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onAddProduct,
  onRemoveProduct,
  onUpdateProduct,
  onClose,
  onLogout,
}) => {
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('blue-cut');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('unisex');
  const [currentPrice, setCurrentPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [size, setSize] = useState<'Medium' | 'Wide' | 'Extra Wide' | 'One Size'>('Medium');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isPrescriptionCompatible, setIsPrescriptionCompatible] = useState(true);
  const [frameMaterial, setFrameMaterial] = useState<'Metal' | 'Acetate' | 'Titanium' | 'TR90' | ''>('');
  
  // State for product update tracking
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Filter state for inventory deletion listing
  const [inventoryFilter, setInventoryFilter] = useState('');

  // Pre-configured elegant glasses images so the user can easily select presets
  const imagePresets = [
    { name: 'Modern Clear Glass', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=80' },
    { name: 'Premium Acetate', url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&auto=format&fit=crop&q=80' },
    { name: 'Dark Aviators', url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&auto=format&fit=crop&q=80' },
    { name: 'Classic Sunglasses', url: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&auto=format&fit=crop&q=80' },
    { name: 'Professional Frame', url: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=80' }
  ];

  const handlePresetSelect = (url: string) => {
    setImageUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const startEditing = (prod: Product) => {
    setEditingProductId(prod.id);
    setTitle(prod.title);
    setCategory(prod.category);
    setGender(prod.gender);
    setCurrentPrice(prod.currentPrice.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setSize(prod.size);
    setImageUrl('');
    setGalleryImages(prod.images && prod.images.length > 0 ? prod.images : [prod.imageUrl]);
    setDescription(prod.description);
    setIsPrescriptionCompatible(prod.isPrescriptionCompatible);
    setFrameMaterial(prod.frameMaterial || '');
    // Scroll to the top of the inventory dashboard
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setTitle('');
    setCategory('blue-cut');
    setGender('unisex');
    setCurrentPrice('');
    setOriginalPrice('');
    setSize('Medium');
    setImageUrl('');
    setGalleryImages([]);
    setDescription('');
    setIsPrescriptionCompatible(true);
    setFrameMaterial('');
    setEditingProductId(null);
  };

  const handleCombinedCategoryChange = (val: string) => {
    if (val.endsWith('-men') || val.endsWith('-women') || val.endsWith('-unisex')) {
      const lastHyphenIndex = val.lastIndexOf('-');
      const cat = val.substring(0, lastHyphenIndex) as any;
      const g = val.substring(lastHyphenIndex + 1) as any;
      setCategory(cat);
      setGender(g);
    } else {
      setCategory(val as any);
      if (val === 'contact-lenses') {
        setGender('women');
      } else {
        setGender('unisex');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !currentPrice || !description) {
      alert('Please fill out the Title, Current Price, and Description.');
      return;
    }

    const priceNum = parseFloat(currentPrice);
    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : priceNum;

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Current price must be a valid positive number.');
      return;
    }

    let finalImagesList = [...galleryImages];
    if (imageUrl.trim()) {
      if (!finalImagesList.includes(imageUrl.trim())) {
        finalImagesList.push(imageUrl.trim());
      }
    }
    
    if (finalImagesList.length === 0) {
      finalImagesList.push('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&auto=format&fit=crop&q=80');
    }

    const finalImageUrl = finalImagesList[0];

    if (editingProductId) {
      const existingProduct = products.find(p => p.id === editingProductId);
      onUpdateProduct({
        ...existingProduct,
        id: editingProductId,
        title: title.trim(),
        category,
        gender,
        currentPrice: priceNum,
        originalPrice: originalPriceNum,
        size,
        imageUrl: finalImageUrl,
        images: finalImagesList,
        description: description.trim(),
        isPrescriptionCompatible,
        frameMaterial: (frameMaterial || undefined) as any,
      } as Product);
    } else {
      onAddProduct({
        title: title.trim(),
        category,
        gender,
        currentPrice: priceNum,
        originalPrice: originalPriceNum,
        size,
        imageUrl: finalImageUrl,
        images: finalImagesList,
        description: description.trim(),
        isPrescriptionCompatible,
        ...(frameMaterial ? { frameMaterial } : {}),
      });
    }

    const wasEditing = !!editingProductId;

    // Reset Form
    setTitle('');
    setCategory('blue-cut');
    setGender('unisex');
    setCurrentPrice('');
    setOriginalPrice('');
    setSize('Medium');
    setImageUrl('');
    setGalleryImages([]);
    setDescription('');
    setIsPrescriptionCompatible(true);
    setFrameMaterial('');
    setEditingProductId(null);

    alert(wasEditing ? 'Product updated successfully!' : 'Product added successfully!');
  };

  // Filtered products list for deletions
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(inventoryFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(inventoryFilter.toLowerCase())
  );

  return (
    <section className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="text-secondary w-5 h-5 animate-pulse" />
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Store Inventory Dashboard
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              Manage product listings for Riaz Sons Opticals. Add new glasses or remove existing items in real-time.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Sign Out
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-dark-obsidian hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Close Panel
            </button>
          </div>
        </div>

        {/* Form and Inventory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column Left: Add Product Form (5 Cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 mb-5 flex items-center gap-2">
              {editingProductId ? (
                <>
                  <Edit className="text-primary w-5 h-5" />
                  Update Product Details
                </>
              ) : (
                <>
                  <PlusCircle className="text-primary w-5 h-5" />
                  List New Glasses
                </>
              )}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Title */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alpha Golden Transition Frame"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Category, Size, Material */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Section / Target Category</label>
                  <select
                    value={
                      ['contact-lenses', 'accessories', 'kids-eyewear'].includes(category)
                        ? category
                        : `${category}-${gender}`
                    }
                    onChange={(e) => handleCombinedCategoryChange(e.target.value)}
                    className="w-full px-2 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-[11px] focus:ring-1 focus:ring-primary focus:outline-none font-semibold text-slate-700"
                  >
                    <option value="rimless-men">Rimless Glasses (Men)</option>
                    <option value="rimless-women">Rimless Glasses (Women)</option>
                    <option value="rimless-unisex">Rimless Glasses (Unisex)</option>
                    
                    <option value="blue-cut-men">Screen Glasses (Men)</option>
                    <option value="blue-cut-women">Screen Glasses (Women)</option>
                    <option value="blue-cut-unisex">Screen Glasses (Unisex)</option>
                    
                    <option value="transition-men">Intelligent Transition (Men)</option>
                    <option value="transition-women">Intelligent Transition (Women)</option>
                    <option value="transition-unisex">Intelligent Transition (Unisex)</option>
                    
                    <option value="sunglasses-men">Sunglasses (Men)</option>
                    <option value="sunglasses-women">Sunglasses (Women)</option>
                    <option value="sunglasses-unisex">Sunglasses (Unisex)</option>
                    
                    <option value="eyeglasses-men">Eyeglasses (Men)</option>
                    <option value="eyeglasses-women">Eyeglasses (Women)</option>
                    <option value="eyeglasses-unisex">Eyeglasses (Unisex)</option>
                    
                    <option value="kids-eyewear">Kids Eyewear</option>
                    <option value="contact-lenses">Contact Lenses</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Size</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as any)}
                    className="w-full px-2 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-[11px] focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="Medium">Medium</option>
                    <option value="Wide">Wide</option>
                    <option value="Extra Wide">Extra Wide</option>
                    <option value="One Size">One Size</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Material</label>
                  <select
                    value={frameMaterial}
                    onChange={(e) => setFrameMaterial(e.target.value as any)}
                    className="w-full px-2 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-[11px] focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="">None (N/A)</option>
                    <option value="Metal">Metal</option>
                    <option value="Acetate">Acetate</option>
                    <option value="Titanium">Titanium</option>
                    <option value="TR90">TR90</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Discount Price (Rs) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2500"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Original Price (Rs)</label>
                  <input
                    type="number"
                    placeholder="e.g. 4999"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Image upload / input options */}
              <div className="space-y-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase block tracking-wider">
                  Product Image Gallery (Add 1 or more images)
                </span>

                {/* Local Upload input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Upload / Pick Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-extrabold file:bg-primary/15 file:text-primary file:hover:bg-primary/25 cursor-pointer bg-white p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="text-center text-[10px] text-slate-400 font-bold uppercase">
                  — OR —
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Direct Image URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/glass.jpg"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                {/* Quick Pick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase block">Quick Presets</label>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePresetSelect(preset.url)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all ${
                          imageUrl === preset.url
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action button to add current imageUrl/uploaded file to gallery */}
                {(imageUrl || imageUrl.startsWith('data:')) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!galleryImages.includes(imageUrl)) {
                        setGalleryImages([...galleryImages, imageUrl]);
                        setImageUrl('');
                      } else {
                        alert('This image is already in the gallery!');
                      }
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all text-xs uppercase"
                  >
                    Add Current Image to Gallery
                  </button>
                )}

                {/* Gallery Preview Grid */}
                {galleryImages.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/65">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block mb-2">
                      Gallery Images ({galleryImages.length})
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden group/thumb">
                          <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                            }}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer text-[10px] font-extrabold"
                          >
                            Remove
                          </button>
                          {idx === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-primary/95 text-white text-[8px] text-center font-extrabold py-0.5">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prescription Capability Check */}
              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="compat"
                  checked={isPrescriptionCompatible}
                  onChange={(e) => setIsPrescriptionCompatible(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="compat" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Prescription Power Compatible Frame
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Product Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write details about the shape, material, and target protections..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              {/* Submit Actions */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl transition-all shadow-md shadow-primary/20 text-xs uppercase tracking-wider cursor-pointer"
                >
                  {editingProductId ? 'Update Product' : 'Add Product to Catalog'}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Column Right: Active Inventory / Remove Glasses (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <ListFilter className="text-secondary w-5 h-5" />
                  Active Glasses Inventory
                </h3>
                
                {/* Search query box */}
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={inventoryFilter}
                  onChange={(e) => setInventoryFilter(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Inventory table/list (Desktop & Tablet) */}
              <div className="hidden md:block border border-slate-100 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="p-3">Product details</th>
                      <th className="p-3">Category & Folder</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold bg-white">
                          No matching glasses found in catalog.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                          
                          {/* Image & Title */}
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                              <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-extrabold text-slate-700 max-w-[150px] line-clamp-1 truncate" title={prod.title}>
                              {prod.title}
                            </span>
                          </td>

                          {/* Category & Folder */}
                          <td className="p-3">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {prod.category}
                              </span>
                              <span className="text-[9px] font-bold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                {prod.gender}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="p-3 text-right font-extrabold text-slate-800">
                            Rs {prod.currentPrice.toLocaleString()}
                          </td>

                          {/* Actions (Edit & Delete) */}
                          <td className="p-3 text-center">
                            <div className="flex justify-center items-center gap-1.5">
                              <button
                                onClick={() => startEditing(prod)}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  editingProductId === prod.id
                                    ? 'bg-primary text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-primary'
                                }`}
                                title="Edit/Update Product"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove "${prod.title}"?`)) {
                                    onRemoveProduct(prod.id);
                                  }
                                }}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Inventory List (Only visible on mobile screens) */}
              <div className="md:hidden space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 font-semibold bg-white border border-slate-100 rounded-2xl">
                    No matching glasses found in catalog.
                  </div>
                ) : (
                  filteredProducts.map((prod) => (
                    <div key={prod.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                        <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-xs font-extrabold text-slate-700 truncate" title={prod.title}>
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[9px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                            {prod.category}
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                            {prod.gender}
                          </span>
                          <span className="text-xs font-bold text-slate-800 ml-auto">
                            Rs {prod.currentPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => startEditing(prod)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                            editingProductId === prod.id
                              ? 'bg-primary text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:text-primary'
                          }`}
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove "${prod.title}"?`)) {
                              onRemoveProduct(prod.id);
                            }
                          }}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Total items stats footer */}
            <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400 mt-5 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
              <span>Catalog Total: {products.length} Glasses</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <Sparkles size={13} />
                Live Sync Enabled
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
