import { ProductEntity } from "../entities/Product";

export type ProductRequestBody = {
  [K in keyof ProductEntity]: string;
} & {
  author_id: string;
};
