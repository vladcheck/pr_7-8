export interface Product {
  id: string;
  images?: {
    src: string;
    alt: string;
  }[];
  title: string;
  category: string;
  description?: string;
  price: number;
}

export type ProductResponse = Product;
