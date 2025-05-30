import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // now an array of image URLs
    required: [true, "At least one image is required"],
    default: [],
  },
  category: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  productLink: {
    type: [String],
    default: [],
  },
  comingSoon: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
