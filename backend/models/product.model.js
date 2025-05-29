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
	image: {
		type: String,
		required: [true, "Image is required"],
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
  type: [String], // was String before
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