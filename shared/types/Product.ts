export interface Product {
  id: string;
  title: string;
  category: string;
  description?: string;
  price: number;
  author_id: string;
}

export type ProductResponse = Product;
