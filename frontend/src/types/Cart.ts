// Typages pour le panier d'achats

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  bookId: string; // Sous forme de string pour le frontend
  quantity: number;
  book?: {
    id: string;
    title: string;
    price: number;
    // autres propriétés du livre dont vous avez besoin
  };
}
