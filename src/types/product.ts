export type StyleTag = 'street' | 'basic' | 'sport' | 'premium';

export type Product = {
  id: number;
  name: string;
  price: number;        // BRL
  image: string;
  category: 'camisetas' | 'moletons' | 'calcas' | 'acessorios';
  subcategory?: string;
  styles: StyleTag[];
};