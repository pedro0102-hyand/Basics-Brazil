export interface CartItem {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: string;
  stock_quantity: number;
  weight_kg: string;
  image_url: string | null;
}