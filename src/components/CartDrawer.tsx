import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, CheckCircle, Smartphone } from 'lucide-react';
import type { CartItem, Order } from '../types';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, lensType: 'eyesight' | 'no-eyesight' | undefined, quantity: number) => void;
  onRemoveItem: (productId: string, lensType: 'eyesight' | 'no-eyesight' | undefined) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  cartItems,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product.currentPrice + (item.lensType === 'eyesight' ? 1000 : 0);
    return acc + itemPrice * item.quantity;
  }, 0);
  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !shippingAddress) {
      alert('Please fill out all billing details.');
      return;
    }

    setIsOrdering(true);

    // Simulate server request
    setTimeout(() => {
      const orderId = 'RS-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        id: orderId,
        customerName,
        phoneNumber,
        shippingAddress,
        cartItems: [...cartItems],
        totalPrice: total,
        status: 'Pending',
        orderDate: new Date().toLocaleDateString('en-PK', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setConfirmedOrder(newOrder);
      setIsOrdering(false);
      
      // Trigger checkout success confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const handleCloseAndReset = () => {
    if (confirmedOrder) {
      onClearCart();
      setConfirmedOrder(null);
      setCustomerName('');
      setPhoneNumber('');
      setShippingAddress('');
    }
    onClose();
  };

  // Generate WhatsApp message URL for sharing order info
  const getWhatsAppOrderLink = (order: Order) => {
    let text = `*NEW ORDER FROM RIAZ SONS OPTICALS*\n`;
    text += `--------------------------------------\n`;
    text += `*Order ID:* ${order.id}\n`;
    text += `*Date:* ${order.orderDate}\n`;
    text += `*Customer:* ${order.customerName}\n`;
    text += `*Phone:* ${order.phoneNumber}\n`;
    text += `*Shipping Address:* ${order.shippingAddress}\n\n`;
    text += `*ITEMS ORDERED:*\n`;
    
    order.cartItems.forEach((item, idx) => {
      const itemPrice = item.product.currentPrice + (item.lensType === 'eyesight' ? 1000 : 0);
      const itemTotal = itemPrice * item.quantity;
      text += `${idx + 1}. _${item.product.title}_ x ${item.quantity}`;
      if (item.lensType === 'eyesight') {
        text += ` (Eyesight Lens)`;
      } else if (item.product.isPrescriptionCompatible) {
        text += ` (No Eyesight/Zero Power)`;
      }
      text += ` - Rs ${itemTotal}\n`;
      if (item.prescription) {
        const r = item.prescription.rightEye;
        const l = item.prescription.leftEye;
        text += `   - *OD (R):* SPH ${r.sph} | CYL ${r.cyl} | AXIS ${r.axis} | PD ${r.pd}\n`;
        text += `   - *OS (L):* SPH ${l.sph} | CYL ${l.cyl} | AXIS ${l.axis} | PD ${l.pd}\n`;
        if (item.prescription.remarks) {
          text += `   - *Notes:* ${item.prescription.remarks}\n`;
        }
      }
    });
    
    text += `\n*Subtotal:* Rs ${subtotal.toLocaleString()}\n`;
    text += `*Shipping:* ${shippingFee === 0 ? 'FREE' : `Rs ${shippingFee}`}\n`;
    text += `*Total Amount:* Rs ${order.totalPrice.toLocaleString()}\n`;
    text += `--------------------------------------\n`;
    text += `_Please confirm my order. Thank you!_`;

    return `https://wa.me/923003544108?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/65 backdrop-blur-sm">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleCloseAndReset} />

      {/* Cart Content Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary w-5 h-5" />
            <h2 className="text-lg font-extrabold text-slate-800">Your Shopping Cart</h2>
            <span className="text-xs bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Confirmed View */}
        {confirmedOrder ? (
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-scale-up">
              <CheckCircle size={36} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800">Order Confirmed!</h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Order ID: {confirmedOrder.id}</p>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                Thank you, <strong className="font-semibold text-slate-700">{confirmedOrder.customerName}</strong>! Your order has been registered successfully.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="font-semibold text-slate-400">Date</span>
                <span className="font-extrabold text-slate-700">{confirmedOrder.orderDate}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="font-semibold text-slate-400">Delivery Address</span>
                <span className="font-extrabold text-slate-700 text-right max-w-[200px] line-clamp-1">{confirmedOrder.shippingAddress}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2">
                <span className="font-semibold text-slate-400">Total Price</span>
                <span className="font-extrabold text-slate-800">Rs {confirmedOrder.totalPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-1">Items Ordered</span>
                <div className="space-y-1 pl-1">
                  {confirmedOrder.cartItems.map((item, idx) => {
                    const itemPrice = item.product.currentPrice + (item.lensType === 'eyesight' ? 1000 : 0);
                    return (
                      <div key={idx} className="flex justify-between font-medium">
                        <span className="text-slate-600 font-light">
                          {item.product.title} (x{item.quantity})
                          {item.lensType === 'eyesight' ? ' (Eyesight)' : item.product.isPrescriptionCompatible ? ' (Zero Power)' : ''}
                        </span>
                        <span className="text-slate-800 font-semibold">Rs {(itemPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA to WhatsApp */}
            <div className="w-full space-y-3 pt-4">
              <a
                href={getWhatsAppOrderLink(confirmedOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all text-sm hover:scale-102"
              >
                <Smartphone size={16} />
                Send Invoice via WhatsApp
              </a>
              <button
                onClick={handleCloseAndReset}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold transition-all text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Cart Listing and Checkout form */
          <>
            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <ShoppingBag size={48} className="text-slate-200" />
                  <span className="text-sm font-semibold">Your shopping cart is empty</span>
                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Start browsing products
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemPrice = item.product.currentPrice + (item.lensType === 'eyesight' ? 1000 : 0);
                  const itemTotal = itemPrice * item.quantity;
                  return (
                    <div
                      key={`${item.product.id}-${item.lensType || 'no-eyesight'}`}
                      className="flex gap-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all duration-300 relative group"
                    >
                      {/* Item Image */}
                      <div className="w-20 h-20 bg-white border rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item text */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="pr-5">
                          <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                              {item.product.category.replace('-', ' ')}
                            </span>
                            {item.lensType === 'eyesight' ? (
                              <span className="text-[9px] bg-teal-50 text-teal-700 font-extrabold px-1.5 py-0.5 rounded border border-teal-100 uppercase">
                                Eyesight
                              </span>
                            ) : item.product.isPrescriptionCompatible ? (
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded uppercase">
                                Zero Power
                              </span>
                            ) : null}
                          </div>
                          
                          {/* Selected prescription summary */}
                          {item.prescription && (
                            <div className="bg-white/80 p-1.5 rounded-lg border border-slate-200/60 mt-1.5 text-[9px] text-slate-500 font-medium">
                              <span className="text-[10px] text-teal-600 font-extrabold block">Power Details</span>
                              OD (R): {item.prescription.rightEye.sph} SPH / OS (L): {item.prescription.leftEye.sph} SPH
                            </div>
                          )}
                        </div>

                        {/* Pricing and quantity control */}
                        <div className="flex items-center justify-between mt-2.5">
                          <span className="text-sm font-extrabold text-dark-obsidian">
                            Rs {itemTotal.toLocaleString()}
                          </span>
                          
                          {/* Quantity picker */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.lensType, Math.max(1, item.quantity - 1))}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="px-2.5 text-xs font-extrabold text-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.lensType, item.quantity + 1)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Trash Delete item */}
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.lensType)}
                        className="absolute top-3 right-3 p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Panel (Calculations & Form) */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50 shadow-inner">
                
                {/* Cost Breakdowns */}
                <div className="space-y-2.5 text-sm mb-5">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-slate-700">
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-600 font-extrabold uppercase text-xs">Free Shipping</strong>
                      ) : (
                        `Rs ${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base border-t border-slate-200/60 pt-2.5 font-extrabold text-dark-obsidian">
                    <span>Total Amount</span>
                    <span>Rs {total.toLocaleString()}</span>
                  </div>
                  {shippingFee > 0 && (
                    <span className="text-[10px] text-primary font-bold block bg-primary/10 px-2.5 py-1 rounded-md text-center mt-1">
                      Add Rs {(3000 - subtotal).toLocaleString()} more for FREE Delivery!
                    </span>
                  )}
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-3 border-t border-slate-200/50">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase block mb-1">
                    Shipping & Billing details
                  </span>
                  
                  {/* Name */}
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  
                  {/* Phone */}
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (e.g. 03xx-xxxxxxx)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  
                  {/* Address */}
                  <input
                    type="text"
                    required
                    placeholder="Complete Delivery Address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />

                  {/* Submit checkout */}
                  <button
                    type="submit"
                    disabled={isOrdering}
                    className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/55 text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all text-sm mt-3 hover:scale-102 flex items-center justify-center gap-2"
                  >
                    {isOrdering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        Confirm Cash on Delivery Order
                      </>
                    )}
                  </button>
                </form>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

