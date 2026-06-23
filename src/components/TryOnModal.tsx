import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, RefreshCw, X, Sliders, Move, Smile, VideoOff } from 'lucide-react';
import type { Product } from '../types';

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

export const TryOnModal: React.FC<TryOnModalProps> = ({ product, onClose }) => {
  const [activeSource, setActiveSource] = useState<'preset' | 'webcam' | 'upload'>('preset');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Glasses orientation and translation state
  const [scale, setScale] = useState(1.0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(-30); // offset slightly upwards to align with eyes by default
  const [rotation, setRotation] = useState(0);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  // Webcam stream reference
  const [webcamActive, setWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const presets = [
    { name: 'Model (Male)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&fit=crop&q=80' },
    { name: 'Model (Female)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&fit=crop&q=80' },
    { name: 'Model (Unisex)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&fit=crop&q=80' },
  ];

  // Stop video stream
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setWebcamActive(false);
  };

  // Start video stream
  const startWebcam = async () => {
    stopWebcam();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamActive(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
      alert('Could not access webcam. Please verify camera permissions or try another source.');
      setActiveSource('preset');
    }
  };

  // Handle source switching
  useEffect(() => {
    if (activeSource === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => stopWebcam();
  }, [activeSource]);

  // Clean up stream on modal unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setUploadedImage(reader.result);
        setActiveSource('upload');
      }
    };
    reader.readAsDataURL(file);
  };

  // Pointer dragging event handlers for glasses overlay
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    positionStartRef.current = { x: positionX, y: positionY };
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setPositionX(positionStartRef.current.x + deltaX);
    setPositionY(positionStartRef.current.y + deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const resetOverlay = () => {
    setScale(1.0);
    setPositionX(0);
    setPositionY(-30);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row h-[90vh] md:h-[650px] relative">
        
        {/* Close Modal Trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 bg-slate-900/65 text-white hover:bg-slate-900 rounded-full transition-colors shadow-md"
          title="Close Virtual Try-On"
        >
          <X size={18} />
        </button>

        {/* Left column: Live Try-on Area (60% width) */}
        <div className="flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden h-[50%] md:h-full">
          
          {/* Preset Model Backdrop */}
          {activeSource === 'preset' && (
            <img
              src={presets[selectedPreset].url}
              alt="Model Face"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          )}

          {/* Uploaded Photo Backdrop */}
          {activeSource === 'upload' && uploadedImage && (
            <img
              src={uploadedImage}
              alt="User Face"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          )}

          {/* Live Web Camera Feed */}
          {activeSource === 'webcam' && (
            <div className="absolute inset-0 w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]" // mirror effect
              />
              {!webcamActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                  <Camera className="w-8 h-8 animate-pulse text-primary" />
                  <span>Activating webcam...</span>
                </div>
              )}
            </div>
          )}

          {/* DRAGGABLE GLASSES OVERLAY */}
          {/* Multiply blend filter wipes out white background from catalog shots */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              transform: `translate(${positionX}px, ${positionY}px) rotate(${rotation}deg) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
            className="absolute z-30 select-none w-48 sm:w-56 aspect-[2.5/1] flex items-center justify-center"
          >
            {/* Displaying visual indicators for dragging */}
            {isDragging && (
              <div className="absolute inset-[-8px] border-2 border-dashed border-primary/65 rounded-xl pointer-events-none flex items-center justify-center">
                <Move className="w-4 h-4 text-primary animate-ping" />
              </div>
            )}
            <img
              src={product.tryOnImageUrl || product.imageUrl}
              alt={product.title}
              style={{
                mixBlendMode: 'multiply',
                filter: 'contrast(1.15) brightness(0.95)',
              }}
              className="w-full h-full object-contain pointer-events-none scale-120"
            />
          </div>

          {/* Drag Overlay Hint */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs text-white/95 font-semibold flex items-center gap-1.5 border border-white/5">
            <Move size={12} className="text-secondary" />
            <span>Drag the glasses to align them with your eyes</span>
          </div>

        </div>

        {/* Right column: Interactive Settings Dashboard (40% width) */}
        <div className="w-full md:w-[350px] bg-slate-50 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto h-[50%] md:h-full text-left">
          
          <div className="space-y-5">
            {/* Header Product Details */}
            <div>
              <span className="text-[10px] text-primary uppercase font-extrabold tracking-wider">
                Virtual Try-On Workshop
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800 line-clamp-1 mt-0.5" title={product.title}>
                {product.title}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Rs {product.currentPrice.toLocaleString()} • Frame Size: {product.size}
              </p>
            </div>

            {/* Try-on Source Tabs */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Choose Face Backdrop
              </span>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-200/50 p-1 rounded-xl">
                <button
                  onClick={() => setActiveSource('preset')}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold transition-all ${
                    activeSource === 'preset'
                      ? 'bg-white text-dark-obsidian shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Smile size={15} className="mb-0.5" />
                  Models
                </button>
                <button
                  onClick={() => setActiveSource('webcam')}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold transition-all ${
                    activeSource === 'webcam'
                      ? 'bg-white text-dark-obsidian shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Camera size={15} className="mb-0.5" />
                  Live Cam
                </button>
                <label
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    activeSource === 'upload'
                      ? 'bg-white text-dark-obsidian shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Upload size={15} className="mb-0.5" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Sub-panels based on selected backdrop source */}
            {activeSource === 'preset' && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Select Preset Face
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPreset(idx)}
                      className={`text-[9px] font-bold py-2 px-1.5 rounded-lg border transition-all truncate ${
                        selectedPreset === idx
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {preset.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSource === 'webcam' && (
              <div className="bg-slate-100 border border-slate-200/50 p-3 rounded-xl flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-medium">
                  <span className="font-bold text-slate-700 block">Webcam Streaming</span>
                  Accessing default front camera
                </div>
                <button
                  onClick={stopWebcam}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                  title="Stop Camera Stream"
                >
                  <VideoOff size={14} />
                </button>
              </div>
            )}

            {activeSource === 'upload' && (
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Custom Backdrop Image
                </span>
                {uploadedImage ? (
                  <div className="flex items-center gap-2.5 p-2 bg-white border border-slate-200 rounded-xl">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0">
                      <img src={uploadedImage} alt="User Face" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[9px] text-slate-500 flex-1 truncate">
                      <span className="font-bold text-slate-700 block">Selfie Uploaded</span>
                      Ready for overlay alignment
                    </div>
                    <label className="text-[9px] font-bold text-primary hover:underline cursor-pointer">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 p-4 rounded-xl text-center">
                    <label className="text-xs font-bold text-primary hover:underline cursor-pointer">
                      Click to upload a selfie photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Adjustments slider panel */}
            <div className="space-y-3.5 pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Sliders size={11} className="text-slate-400" />
                Fine-Tune Alignment
              </span>

              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                  <span>Scale / Size</span>
                  <span>{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-primary bg-slate-200 h-1 rounded-full cursor-pointer"
                />
              </div>

              {/* Y Position Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                  <span>Vertical Offset</span>
                  <span>{positionY}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={positionY}
                  onChange={(e) => setPositionY(parseInt(e.target.value))}
                  className="w-full accent-primary bg-slate-200 h-1 rounded-full cursor-pointer"
                />
              </div>

              {/* X Position Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                  <span>Horizontal Offset</span>
                  <span>{positionX}px</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="1"
                  value={positionX}
                  onChange={(e) => setPositionX(parseInt(e.target.value))}
                  className="w-full accent-primary bg-slate-200 h-1 rounded-full cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                  <span>Rotate Tilt</span>
                  <span>{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-primary bg-slate-200 h-1 rounded-full cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Lower controls: Reset and close */}
          <div className="pt-4 border-t border-slate-200 flex gap-2">
            <button
              onClick={resetOverlay}
              className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
            >
              <RefreshCw size={13} />
              Reset Frame
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-dark-obsidian hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
            >
              Done Fitting
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
