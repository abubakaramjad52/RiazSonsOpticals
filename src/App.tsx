import { useState, useEffect } from 'react';
import { Announcement } from './components/Announcement';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryList } from './components/CategoryList';
import { GenderBanners } from './components/GenderBanners';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { TryOnModal } from './components/TryOnModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { Footer } from './components/Footer';
import type { Product, CartItem, PrescriptionDetails } from './types';
import { Shield, MessageCircle, Laptop, Heart, Star } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from the backend database on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products from backend API');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('riaz_opticals_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & filtering states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Custom sidebar/catalog filter states
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [pageSize, setPageSize] = useState<number>(24);
  const [gridLayout, setGridLayout] = useState<'grid-3' | 'grid-4'>('grid-4');

  // Informational modals state
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  
  // UI toggles
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('riaz_opticals_admin_auth') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null);


  // Sync admin authentication state
  useEffect(() => {
    localStorage.setItem('riaz_opticals_admin_auth', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('riaz_opticals_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync URL search parameters with application state for deep linking and SEO crawling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const productParam = params.get('product');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (productParam) {
      const match = products.find((p) => p.id === productParam);
      if (match) {
        setQuickViewProduct(match);
      }
    }
  }, [products]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }

    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }

    if (quickViewProduct) {
      params.set('product', quickViewProduct.id);
    } else {
      params.delete('product');
    }

    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
    window.history.replaceState(null, '', newUrl);
  }, [selectedCategory, searchQuery, quickViewProduct]);

  // Reset scroll position to top when selected category changes, simulating page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory]);

  // Catalog modification callbacks (Admin)
  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'rating' | 'reviewsCount' | 'inStock'>) => {
    const tempId = `bc-${Date.now()}`;
    const addedProduct: Product = {
      ...newProduct,
      id: tempId,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
    };
    
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addedProduct),
      });
      if (res.ok) {
        const savedProduct = await res.json();
        setProducts((prev) => [savedProduct, ...prev]);
      } else {
        console.error('Failed to add product to backend');
        alert('Error adding product to database.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to connect to backend server.');
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        // Also clean up from cart if deleted product was in cart
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      } else {
        console.error('Failed to delete product from backend');
        alert('Error removing product from database.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to connect to backend server.');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (res.ok) {
        const savedProduct = await res.json();
        setProducts((prev) => prev.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
        // Sync cart items with the updated product details if it exists in the cart
        setCartItems((prev) =>
          prev.map((item) =>
            item.product.id === savedProduct.id ? { ...item, product: savedProduct } : item
          )
        );
      } else {
        console.error('Failed to update product on backend');
        alert('Error updating product in database.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to connect to backend server.');
    }
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    prescription?: PrescriptionDetails,
    lensType?: 'eyesight' | 'no-eyesight'
  ) => {
    setCartItems((prev) => {
      // Find if item with same ID, same prescription and lens type already exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.lensType === lensType &&
          JSON.stringify(item.prescription) === JSON.stringify(prescription)
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, quantity: 1, prescription, lensType }];
      }
    });

    // Alert or open cart drawer for feedback
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    lensType: 'eyesight' | 'no-eyesight' | undefined,
    quantity: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.lensType === lensType
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (
    productId: string,
    lensType: 'eyesight' | 'no-eyesight' | undefined
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.lensType === lensType)
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Quick category navigation logic
  const handleExploreCategory = (category: string) => {
    setSelectedCategory(category);
  };

  // Dynamic size count calculator based on category, search and material
  const getSizeCount = (sizeName: string) => {
    return products.filter((prod) => {
      // Category filter
      let matchesCategory = false;
      if (selectedCategory === 'all') {
        matchesCategory = true;
      } else if (selectedCategory === 'men') {
        matchesCategory = prod.gender === 'men' || prod.gender === 'unisex';
      } else if (selectedCategory === 'women') {
        matchesCategory = prod.gender === 'women' || prod.gender === 'unisex';
      } else if (selectedCategory.endsWith('-men')) {
        const cat = selectedCategory.replace('-men', '');
        matchesCategory = prod.category === cat && (prod.gender === 'men' || prod.gender === 'unisex');
      } else if (selectedCategory.endsWith('-women')) {
        const cat = selectedCategory.replace('-women', '');
        matchesCategory = prod.category === cat && (prod.gender === 'women' || prod.gender === 'unisex');
      } else {
        matchesCategory = prod.category === selectedCategory;
      }

      // Search query filter
      const matchesSearch =
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Material filter
      const matchesMaterial =
        selectedMaterial === 'all' ||
        prod.frameMaterial?.toLowerCase() === selectedMaterial.toLowerCase();

      return matchesCategory && matchesSearch && matchesMaterial && prod.size === sizeName;
    }).length;
  };

  // Filter products based on search, category tab, material, and size checkboxes
  const filteredProducts = products.filter((prod) => {
    let matchesCategory = false;
    if (selectedCategory === 'all') {
      matchesCategory = true;
    } else if (selectedCategory === 'men') {
      matchesCategory = prod.gender === 'men' || prod.gender === 'unisex';
    } else if (selectedCategory === 'women') {
      matchesCategory = prod.gender === 'women' || prod.gender === 'unisex';
    } else if (selectedCategory.endsWith('-men')) {
      const cat = selectedCategory.replace('-men', '');
      matchesCategory = prod.category === cat && (prod.gender === 'men' || prod.gender === 'unisex');
    } else if (selectedCategory.endsWith('-women')) {
      const cat = selectedCategory.replace('-women', '');
      matchesCategory = prod.category === cat && (prod.gender === 'women' || prod.gender === 'unisex');
    } else {
      matchesCategory = prod.category === selectedCategory;
    }

    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMaterial =
      selectedMaterial === 'all' ||
      prod.frameMaterial?.toLowerCase() === selectedMaterial.toLowerCase();

    const matchesSize =
      selectedSizes.length === 0 || selectedSizes.includes(prod.size);

    return matchesCategory && matchesSearch && matchesMaterial && matchesSize;
  });

  // Apply sorting options
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-asc') {
      return a.currentPrice - b.currentPrice;
    }
    if (sortOption === 'price-desc') {
      return b.currentPrice - a.currentPrice;
    }
    if (sortOption === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // Default sorting
  });

  // Slice based on selected pageSize
  const displayedProducts = pageSize === 0 ? sortedProducts : sortedProducts.slice(0, pageSize);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const showStoreContent = !(isAdminLoggedIn && isAdminOpen);

  const getCatalogTitle = () => {
    if (selectedCategory === 'all') return 'All Premium Glasses';
    if (selectedCategory === 'men') return 'Men Glasses Collection';
    if (selectedCategory === 'women') return 'Female Glasses Collection';
    
    let suffix = '';
    let baseCategory = selectedCategory;
    if (selectedCategory.endsWith('-men')) {
      suffix = " (Men's)";
      baseCategory = selectedCategory.replace('-men', '');
    } else if (selectedCategory.endsWith('-women')) {
      suffix = " (Ladies)";
      baseCategory = selectedCategory.replace('-women', '');
    }

    const categoryNames: Record<string, string> = {
      'blue-cut': 'Screen Glasses',
      'sunglasses': 'Sunglasses',
      'transition': 'Intelligent Glasses',
      'contact-lenses': 'Contact Lenses',
      'eyeglasses': 'Eyeglasses',
      'accessories': 'Accessories',
      'kids-eyewear': 'Kids Eyewear',
      'rimless': 'Rimless Glasses'
    };

    const baseName = categoryNames[baseCategory] || baseCategory.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `${baseName}${suffix} Collection`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 relative selection:bg-primary/20">
      
      {/* Top Banner Ticker */}
      <Announcement />

      {/* Main Glassmorphic Header */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => {
          if (isAdminLoggedIn) {
            setIsAdminOpen(!isAdminOpen);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        isAdmin={isAdminLoggedIn && isAdminOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onTrackOrderClick={() => setIsTrackOpen(true)}
        onAboutClick={() => setIsAboutOpen(true)}
        onReturnPolicyClick={() => setIsReturnOpen(true)}
      />

      {/* Hero Sliders Section */}
      {showStoreContent && selectedCategory === 'all' && <Hero onExploreClick={handleExploreCategory} />}

      {/* Category Icons Grid */}
      {showStoreContent && selectedCategory === 'all' && (
        <CategoryList
          selectedCategory={selectedCategory}
          onCategorySelect={handleExploreCategory}
        />
      )}

      {/* Shop by Gender split banners */}
      {showStoreContent && selectedCategory === 'all' && <GenderBanners onGenderSelect={handleExploreCategory} />}

      {/* Admin Panel (Dashboard drawer toggle) */}
      {isAdminLoggedIn && isAdminOpen && (
        <div className="animate-fade-in">
          <AdminPanel
            products={products}
            onAddProduct={handleAddProduct}
            onRemoveProduct={handleRemoveProduct}
            onUpdateProduct={handleUpdateProduct}
            onClose={() => setIsAdminOpen(false)}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              setIsAdminOpen(false);
              alert('Successfully logged out from Admin Panel.');
            }}
          />
        </div>
      )}

      {/* Products Catalog grid */}
      {showStoreContent && (
        <main id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24 lg:scroll-mt-28 flex-1">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b border-slate-100 pb-6">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-obsidian">
              {getCatalogTitle()}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              Showing {sortedProducts.length} high-quality items handcrafted in our digital optical lab.
            </p>
          </div>
          
          {/* Active search tag */}
          {searchQuery && (
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              Searching for: <span className="text-primary font-bold">"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-red-500 font-bold">×</button>
            </div>
          )}
        </div>

        {/* Sunglasses Sub-categories Pills/Tabs */}
        {(selectedCategory === 'sunglasses' || selectedCategory.startsWith('sunglasses-')) && (
          <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in text-left">
            {[
              { id: 'sunglasses', label: 'All Sunglasses 🕶️' },
              { id: 'sunglasses-women', label: 'Ladies Sunglasses 👩' },
              { id: 'sunglasses-men', label: "Men's Sunglasses 👨" },
            ].map((subCat) => {
              const isSubSelected = selectedCategory === subCat.id;
              return (
                <button
                  key={subCat.id}
                  onClick={() => setSelectedCategory(subCat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSubSelected
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-white text-slate-600 hover:text-primary border border-slate-100 hover:border-primary/20 shadow-xs'
                  }`}
                >
                  {subCat.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 2-Column Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filters Sidebar (Only visible when a specific category filter is active) */}
          {selectedCategory !== 'all' && (
            <div className="lg:col-span-1 space-y-8 text-left bg-white p-6 rounded-2xl border border-slate-100 shadow-xs h-fit sticky top-24 animate-scale-up">
            
            {/* Filter by Frame Material */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Filter By</h3>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer font-semibold"
              >
                <option value="all">Any Frame Material</option>
                <option value="Metal">Metal</option>
                <option value="Acetate">Acetate</option>
                <option value="Titanium">Titanium</option>
                <option value="TR90">TR90 (Plastic)</option>
              </select>
            </div>

            {/* Filter by Sizes (Checkboxes) */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Filter By</h3>
              <div className="space-y-3">
                {['Extra Wide', 'Wide', 'Medium'].map((sizeOption) => {
                  const isChecked = selectedSizes.includes(sizeOption);
                  const count = getSizeCount(sizeOption);
                  return (
                    <label key={sizeOption} className="flex items-center justify-between text-xs text-slate-600 cursor-pointer group">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedSizes(selectedSizes.filter((s) => s !== sizeOption));
                            } else {
                              setSelectedSizes([...selectedSizes, sizeOption]);
                            }
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 focus:border-primary transition-all accent-primary cursor-pointer"
                        />
                        <span className="group-hover:text-primary transition-colors">{sizeOption}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* Reset Button */}
            {(selectedMaterial !== 'all' || selectedSizes.length > 0) && (
              <button
                onClick={() => {
                  setSelectedMaterial('all');
                  setSelectedSizes([]);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
          )}

          {/* Right Column: Catalog List & Controls */}
          <div className={`${selectedCategory === 'all' ? 'lg:col-span-4' : 'lg:col-span-3'} space-y-6`}>
            
            {/* Catalog Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-xs">
              
              {/* Show Page Sizes */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Show :</span>
                {[9, 12, 18, 24].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setPageSize(sz)}
                    className={`font-semibold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                      pageSize === sz ? 'text-primary border-b-2 border-primary font-bold' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
                <button
                  onClick={() => setPageSize(0)}
                  className={`font-semibold px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    pageSize === 0 ? 'text-primary border-b-2 border-primary font-bold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Layout Columns Switcher & Sorting */}
              <div className="flex items-center gap-4">
                
                {/* Columns Grid Toggle */}
                <div className="hidden sm:flex items-center gap-1.5 border-r border-slate-100 pr-4">
                  {/* Grid 3 Icon */}
                  <button
                    onClick={() => setGridLayout('grid-3')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      gridLayout === 'grid-3' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="3 Columns Grid"
                  >
                    <svg className="w-4 h-4 animate-scale-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="5" height="5" rx="1" />
                      <rect x="3" y="11" width="5" height="5" rx="1" />
                      <rect x="3" y="19" width="5" height="5" rx="1" />
                      <rect x="11" y="3" width="5" height="5" rx="1" />
                      <rect x="11" y="11" width="5" height="5" rx="1" />
                      <rect x="11" y="19" width="5" height="5" rx="1" />
                      <rect x="19" y="3" width="5" height="5" rx="1" />
                      <rect x="19" y="11" width="5" height="5" rx="1" />
                      <rect x="19" y="19" width="5" height="5" rx="1" />
                    </svg>
                  </button>
                  {/* Grid 4 Icon */}
                  <button
                    onClick={() => setGridLayout('grid-4')}
                    className={`p-1.5 rounded transition-all cursor-pointer ${
                      gridLayout === 'grid-4' ? 'bg-slate-100 text-primary' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="4 Columns Grid"
                  >
                    <svg className="w-4.5 h-4.5 animate-scale-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="2" y="2" width="4" height="4" rx="0.5" />
                      <rect x="2" y="8" width="4" height="4" rx="0.5" />
                      <rect x="2" y="14" width="4" height="4" rx="0.5" />
                      <rect x="2" y="20" width="4" height="4" rx="0.5" />
                      <rect x="8" y="2" width="4" height="4" rx="0.5" />
                      <rect x="8" y="8" width="4" height="4" rx="0.5" />
                      <rect x="8" y="14" width="4" height="4" rx="0.5" />
                      <rect x="8" y="20" width="4" height="4" rx="0.5" />
                      <rect x="14" y="2" width="4" height="4" rx="0.5" />
                      <rect x="14" y="8" width="4" height="4" rx="0.5" />
                      <rect x="14" y="14" width="4" height="4" rx="0.5" />
                      <rect x="14" y="20" width="4" height="4" rx="0.5" />
                      <rect x="20" y="2" width="4" height="4" rx="0.5" />
                      <rect x="20" y="8" width="4" height="4" rx="0.5" />
                      <rect x="20" y="14" width="4" height="4" rx="0.5" />
                      <rect x="20" y="20" width="4" height="4" rx="0.5" />
                    </svg>
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                >
                  <option value="default">Default sorting</option>
                  <option value="rating">Sort by average rating</option>
                  <option value="price-asc">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>

            </div>

            {/* Displayed Cards Grid */}
            {displayedProducts.length === 0 ? (
              <div className="py-20 text-center max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  🔭
                </div>
                <h3 className="font-extrabold text-lg text-slate-800">No Glasses Found</h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed">
                  We couldn't find any products matching your current filters. Try resetting the sidebar checkboxes or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSelectedMaterial('all');
                    setSelectedSizes([]);
                  }}
                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 hover:bg-primary-hover"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 gap-3 sm:gap-6 ${
                selectedCategory === 'all'
                  ? (gridLayout === 'grid-3' ? 'lg:grid-cols-3' : 'lg:grid-cols-4')
                  : (gridLayout === 'grid-3' ? 'lg:grid-cols-3' : 'lg:grid-cols-4')
              }`}>
                {displayedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onTryOn={(p) => setTryOnProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </main>
      )}

      {/* Eye Education Panel */}
      {showStoreContent && selectedCategory === 'all' && (
        <section className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
              <div className="max-w-2xl space-y-4">
                <span className="inline-block text-primary font-bold text-[10px] uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Eye Care Technology
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Why Computer Glasses Are Essential
                </h2>
                <p className="text-slate-400 font-light text-xs sm:text-sm leading-relaxed">
                  Daily exposure to digital screens (phones, laptops, and tablets) emits high-energy blue light (HEV), causing fatigue, dryness, headaches, and sleep disruption. Riaz Sons precision-crafted computer lenses filter out 95% of harmful artificial rays, ensuring relaxed, comfortable vision all day.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 shrink-0">
                <div className="flex items-center gap-2.5 bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl text-left">
                  <Laptop className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-bold text-xs text-white">HEV Shield</h4>
                    <p className="text-[10px] text-slate-400">Blocks screen fatigue</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl text-left">
                  <Shield className="w-5 h-5 text-secondary" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Anti-Glare</h4>
                    <p className="text-[10px] text-slate-400">Restores eye comfort</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl text-left">
                  <Heart className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-xs text-white">Sleep Guard</h4>
                    <p className="text-[10px] text-slate-400">Better natural rest</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews section */}
      {showStoreContent && selectedCategory === 'all' && (
        <section className="bg-white py-16 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-obsidian">
                Loved by Our Customers
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-light">
                See how our custom prescription and computer glasses are upgrading visions across Pakistan.
              </p>
              <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  stars: 5,
                  text: "Ordered the Astra hexagonal glasses with custom prescription. The clarity is amazing and the frame fits my face perfectly. Delivery to Karachi took only 4 days. Best service!",
                  initials: "AK",
                  name: "Adnan Khan",
                  city: "Karachi",
                  bg: "bg-primary/5",
                  textCol: "text-primary"
                },
                {
                  stars: 5,
                  text: "My screen headaches have completely stopped. I wear the Dita vintage glasses all day at work. I was skeptical about ordering online but the prescription was spot on.",
                  initials: "ZF",
                  name: "Zainab Fatima",
                  city: "Islamabad",
                  bg: "bg-secondary/10",
                  textCol: "text-secondary"
                },
                {
                  stars: 5,
                  text: "The Alpha transition glasses work like magic. Clear inside my office, and dark sunglasses outside. High quality titanium frame at this price is unbelievable. 10/10 recommended.",
                  initials: "MH",
                  name: "Muhammad Hamza",
                  city: "Lahore",
                  bg: "bg-emerald-500/10",
                  textCol: "text-emerald-600"
                }
              ].map((rev, index) => (
                <div 
                  key={index} 
                  className="p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 flex flex-col justify-between transform hover:-translate-y-1 group"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" className="w-3.5 h-3.5" />
                      ))}
                    </div>
                    {/* Text */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light italic">
                      "{rev.text}"
                    </p>
                  </div>
                  {/* User info */}
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200/50">
                    <div className={`w-9 h-9 rounded-full ${rev.bg} ${rev.textCol} font-extrabold text-xs flex items-center justify-center`}>
                      {rev.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rev.name}</h4>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                        {rev.city} • Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Details */}
      {showStoreContent && (
        <Footer 
          onCategoryClick={handleExploreCategory} 
          onAboutClick={() => setIsAboutOpen(true)}
          onReturnPolicyClick={() => setIsReturnOpen(true)}
          onTrackOrderClick={() => setIsTrackOpen(true)}
        />
      )}

      {/* --- FLOATING MODALS AND WIDGETS --- */}

      {/* Detailed product overview & prescription config modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onTryOn={(p) => setTryOnProduct(p)}
        />
      )}

      {/* Virtual Try-On Modal */}
      {tryOnProduct && (
        <TryOnModal
          product={tryOnProduct}
          onClose={() => setTryOnProduct(null)}
        />
      )}

      {/* Cart Slider Drawer */}
      <CartDrawer
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Admin Login Authenticator Gate */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsAdminOpen(true);
        }}
      />

      {/* About Us Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setIsAboutOpen(false)} />
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-up">
            <button onClick={() => setIsAboutOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition-colors text-xl font-bold">×</button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b pb-4 mb-4">About Riaz Sons Opticals</h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              <p>
                Established as a family-run heritage brand, **Riaz Sons Opticals** has been serving the Shakargarh and local region for years with state-of-the-art vision correction solutions.
              </p>
              <p>
                Our digital optical lab is equipped with high-precision computer lens edgers and alignment systems to ensure your prescription SPH, CYL, and Axis calculations are calibrated with micro-level accuracy.
              </p>
              <h3 className="font-extrabold text-slate-800 text-sm mt-6 mb-2">Our Store Location</h3>
              <p>
                📍 Ikhlaspur road, Shakargarh, Pakistan (Location: 32°15'40.7"N 75°10'09.7"E)
              </p>
              <p className="flex flex-col">
                <span>📞 Phone Support & Phone Orders: **0300-3544108**</span>
                <span className="pl-6">**0300-3544105**</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Return Policy Modal */}
      {isReturnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setIsReturnOpen(false)} />
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-up">
            <button onClick={() => setIsReturnOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition-colors text-xl font-bold">×</button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b pb-4 mb-4">7-Day Refund & Return Policy</h2>
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
              <p>
                Your satisfaction is our primary metric of success. We want you to love your frames and vision clarity.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>**Prescription Mismatch**: If you experience headaches or incorrect focal paths, send us your physical prescription chart. We will re-cut and mount fresh lenses for free!</li>
                <li>**Frame Fitting**: If the frame is too wide or too medium for your face structure, returns are accepted within 7 days for exchange.</li>
                <li>**Return Logistics**: Pack the glasses safely in the original Riaz Sons Opticals hard case and return it via TCS/Leopards.</li>
              </ul>
              <p className="text-[11px] text-slate-400 mt-4">
                *Note: Damage due to physical drop, lens scratches from abrasive cloths, or heat warp are not covered under warranty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Track Order Modal */}
      {isTrackOpen && (
        <TrackOrderModal onClose={() => setIsTrackOpen(false)} />
      )}

      {/* Floating WhatsApp Action Widget (Inspiring direct purchase support) */}
      {showStoreContent && (
        <a
          href="https://wa.me/923003544108?text=Hello%20Riaz%20Sons%20Opticals%2C%20I%20have%20a%20question%20regarding%20glasses%20prescription."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-emerald-400 group"
          title="Contact WhatsApp Support"
        >
          <MessageCircle size={26} className="group-hover:rotate-6 transition-transform" />
          <span className="absolute right-14 bg-slate-900 text-white font-extrabold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
            Chat With Optician
          </span>
        </a>
      )}

    </div>
  );
}

export default App;
