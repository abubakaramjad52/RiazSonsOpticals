export interface Product {
  id: string;
  title: string;
  category: 'blue-cut' | 'sunglasses' | 'transition' | 'contact-lenses' | 'eyeglasses' | 'accessories' | 'kids-eyewear' | 'rimless';
  description: string;
  currentPrice: number;
  originalPrice: number; // for showing discount
  size: 'Medium' | 'Wide' | 'Extra Wide' | 'One Size';
  imageUrl: string;
  isPrescriptionCompatible: boolean;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  gender: 'men' | 'women' | 'unisex';
  frameMaterial?: 'Metal' | 'Acetate' | 'Titanium' | 'TR90';
  transitionImageUrl?: string;
  splitLabelTop?: string;
  splitLabelBottom?: string;
  tryOnImageUrl?: string;
  images?: string[];
}

export interface EyeDetails {
  sph: string;  // Spherical (-10.00 to +6.00)
  cyl: string;  // Cylinder (-4.00 to +4.00)
  axis: string; // Axis (0 to 180)
  pd: string;   // Pupillary Distance
}

export interface PrescriptionDetails {
  leftEye: EyeDetails;
  rightEye: EyeDetails;
  remarks?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  prescription?: PrescriptionDetails;
  lensType?: 'eyesight' | 'no-eyesight';
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  shippingAddress: string;
  cartItems: CartItem[];
  totalPrice: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
}
