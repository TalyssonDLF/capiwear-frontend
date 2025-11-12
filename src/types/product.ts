export type StyleTag = 'street' | 'basic' | 'sport' | 'premium';

export type Product = {
  id: number;
  name: string;
  price: number;
  imgUrl?: string;      // URL da capa (seu backend pode retornar)
  styles: StyleTag[];     // adapte se vier diferente
  category?: string;
  subcategory?: string;
};
