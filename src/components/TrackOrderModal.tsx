import React, { useState } from 'react';
import { Truck, CheckCircle2, Circle, Clock, Search, X } from 'lucide-react';

interface TrackOrderModalProps {
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ onClose }) => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) return;

    // Simulate order retrieval
    const simulatedStatusList = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    // Generate a consistent pseudo-random index based on digits in OrderId
    const digitsSum = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const statusIdx = digitsSum % simulatedStatusList.length;
    const activeStatus = simulatedStatusList[statusIdx];

    setTrackingData({
      id: orderId,
      customerPhone: phone,
      status: activeStatus,
      courier: digitsSum % 2 === 0 ? 'TCS Express' : 'Leopards Courier',
      trackingNumber: `PK-${digitsSum * 73}`,
      lastUpdate: new Date().toLocaleDateString(),
      steps: [
        { title: 'Order Placed', desc: 'We have received your catalog order details.', active: true, completed: true },
        { title: 'Prescription Verification', desc: 'Optician checked your SPH/CYL/Axis data.', active: statusIdx >= 1, completed: statusIdx >= 1 },
        { title: 'Lab Assembly', desc: 'Lens mounting, anti-glare coating, and frame tuning.', active: statusIdx >= 2, completed: statusIdx >= 2 },
        { title: 'Shipped via Courier', desc: 'Handed over to carrier for doorstep delivery.', active: statusIdx >= 2, completed: statusIdx >= 3 },
      ],
    });
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 text-left border border-slate-100 max-h-[90vh] overflow-y-auto transition-all duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-50 transition-colors"
          title="Close Modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b pb-4 mb-5 flex items-center gap-2">
          <Truck className="text-primary w-5 h-5 sm:w-6 sm:h-6" /> Track Your Order
        </h2>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Order ID
              </label>
              <input
                type="text"
                placeholder="e.g. RS-3321"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 03003544108 / 03003544105"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:scale-101 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={15} /> Search Order Shipment
          </button>
        </form>

        {/* Tracking Details */}
        {hasSearched && trackingData && (
          <div className="mt-6 border-t border-slate-100 pt-6 space-y-6 animate-scale-up">
            
            {/* Status Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center text-xs">
              <div className="text-left space-y-1">
                <span className="text-slate-400 font-medium">Status</span>
                <div className="font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    trackingData.status === 'Delivered' 
                      ? 'bg-emerald-500' 
                      : trackingData.status === 'Shipped' 
                      ? 'bg-blue-500' 
                      : 'bg-amber-500'
                  }`} />
                  {trackingData.status}
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-slate-400 font-medium">Courier Service</span>
                <div className="font-bold text-slate-800">
                  {trackingData.courier}
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-slate-400 font-medium">Tracking Number</span>
                <div className="font-mono text-slate-700">
                  {trackingData.trackingNumber}
                </div>
              </div>
            </div>

            {/* Stepper Steps */}
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 ml-3">
              {trackingData.steps.map((step: any, idx: number) => {
                const isCompleted = step.completed;
                const isActive = step.active && !isCompleted;
                return (
                  <div key={idx} className="relative text-left">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-[31px] top-0.5 rounded-full p-0.5 z-10 bg-white transition-all`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white" />
                      ) : isActive ? (
                        <Clock className="w-5 h-5 text-primary animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-0.5">
                      <h4 className={`text-xs sm:text-sm font-bold ${
                        isCompleted ? 'text-slate-800 font-extrabold' : isActive ? 'text-primary' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-light leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-[10px] sm:text-xs text-emerald-700 leading-relaxed font-light">
              💡 **Fast Support**: If your order status is pending or you need instant delivery dispatch, click the **WhatsApp Widget** in the bottom-right of the screen to chat with our shakargarh shop technician directly.
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
