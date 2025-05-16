import mongoose, { Schema, Document } from 'mongoose';

// Interface pour les éléments du panier (sous-document)
export interface ICartItem {
  bookId: mongoose.Types.ObjectId;
  quantity: number;
}

// Schéma pour les éléments du panier (embarqué dans Cart)
const cartItemSchema = new Schema<ICartItem>({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'ID du livre requis']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantité requise'],
    min: [1, 'La quantité minimale est 1']
  }
});

// Interface pour le panier complet
export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Schéma principal du panier
const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'ID utilisateur est requis"]
    },
    items: [cartItemSchema] // Array de sous-documents CartItem
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>('Cart', cartSchema);
export default Cart;
