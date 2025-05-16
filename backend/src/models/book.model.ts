import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  price: number;
  stock: number;
  coverUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      unique: true,
      trim: true
    },
    author: {
      type: String,
      required: [true, "L'auteur est requis"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    stock: {
      type: Number,
      required: [true, 'Le stock est requis'],
      min: [0, 'Le stock ne peut pas être négatif'],
      default: 0
    },
    coverUrl: {
      type: String,
      default: '/images/default-cover.jpg'
    },
    description: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>('Book', bookSchema);
export default Book;
