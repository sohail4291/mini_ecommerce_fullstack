// Shapes of data coming from the API
export type Product = { id: number; name: string; description: string; price: number; stock: number; imageUrl: string };
export type CartItem = { id: number; productId: number; quantity: number; product: Product };
export type OrderStatus = "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type Order = { id: number; total: number; address: string; status: OrderStatus; createdAt: string;
  user: { email: string }; items: { id: number; quantity: number; price: number; product: Product }[] };
export const rupees = (paise: number) => "₹" + (paise / 100).toFixed(2);
