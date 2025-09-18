import type { Product } from '../types/product';

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Boné Trucker Capivara', price: 129.9, image: '/src/assets/images/Boné-Capivarinha.png', category: 'camisetas', subcategory: 'oversized', styles: ['street'] },
  { id: 3, name: 'Moletom Logo Bordado',        price: 219.9, image: 'src/assets/images/Moletom-capivara-eletrica.png',   category: 'moletons', styles: ['street','premium'] },
  { id: 4, name: 'Calça Jogger Tech',           price: 189.9, image: 'src/assets/images/Calca-jogger.png', category: 'calcas',   styles: ['sport'] },
  { id: 5, name: 'Camiseta Baby Look',          price: 109.9, image: 'src/assets/images/Camiseta-capivara-amor.png',   category: 'camisetas', subcategory: 'baby look', styles: ['basic'] },
  { id: 6, name: 'Camiseta Premium Algodão Pima', price: 179.9, image: 'src/assets/images/Camiseta-capivarinha-crash.png', category: 'camisetas', subcategory: 'premium', styles: ['premium'] },
  { id: 9, name: 'Camiseta CapiTech', price: 179.9, image: 'src/assets/images/Camiseta-capi-dev.png', category: 'camisetas', subcategory: 'premium', styles: ['premium'] },
  { id: 7, name: 'Boné Trucker CapiWear',       price: 89.9,  image: 'src/assets/images/Boné-hydro.png',   category: 'acessorios', styles: ['street','sport'] },
  { id: 8, name: 'Caneca Capivara',    price: 139.9, image: 'src/assets/images/Caneca-capivara.png',   category: 'acessorios', styles: ['sport'] },
];

export const PROMOS = [
  {
    id: 'drop-neo',
    title: 'Novo Drop NEO',
    subtitle: 'Oversized premium com acabamentos top',
    cta: 'Conferir',
    image: 'src/assets/images/banner3.png',
    link: '/category/camisetas?sub=oversized',
  },
  {
    id: 'sale-30',
    title: 'SALE até 30% OFF',
    subtitle: 'Seleção de camisetas básicas',
    cta: 'Ver ofertas',
    image: 'https://images.unsplash.com/photo-1510560898-06a9d3e32b58?q=80&w=2000&auto=format&fit=crop',
    link: '/category/camisetas?sub=básica',
  },
  {
    id: 'run-collection',
    title: 'Linha RUN',
    subtitle: 'Dry fit performance',
    cta: 'Explorar',
    image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?q=80&w=2000&auto=format&fit=crop',
    link: '/category/camisetas?sub=dry fit',
  },
];