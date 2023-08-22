import { Document, Schema, Types } from "mongoose";
import mongoose from "mongoose";

export interface IProduct extends Document {
  _id?: string;
  name: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: String,
  },
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

