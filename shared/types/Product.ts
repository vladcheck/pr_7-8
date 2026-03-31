export interface Product {
  id: string;
  imageSrc?: string;
  imageAlt?: string;
  title: string;
  category: string;
  description?: string;
  price: number;
}

export type ProductResponse = Product;
