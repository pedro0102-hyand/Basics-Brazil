export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category: string;
  size: string | null;
  color: string | null;
  weight_kg: string;
  is_active: boolean;
  images?: ProductImage[];
}