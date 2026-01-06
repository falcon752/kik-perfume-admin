import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts || featuredProducts.length === 0) {
			return res.status(404).json({ message: "No featured products found" });
		}

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, images, category, productLink, comingSoon } = req.body;

		let imageUrls = [];

		if (Array.isArray(images)) {
			for (const img of images) {
				if (typeof img === "string" && (img.startsWith("data:") || !img.startsWith("http"))) {
					const response = await cloudinary.uploader.upload(img, { folder: "products" });
					imageUrls.push(response.secure_url);
				} else if (typeof img === "string") {
					imageUrls.push(img);
				}
			}
		}

		const product = await Product.create({
			name,
			description,
			images: imageUrls,
			category,
			productLink: Array.isArray(productLink) ? productLink : productLink ? [productLink] : [],
			comingSoon: comingSoon || false,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const { name, description, images, category, productLink, comingSoon, removedImages } = req.body;

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (Array.isArray(removedImages) && removedImages.length > 0) {
			for (const imgUrl of removedImages) {
				try {
					const parts = imgUrl.split("/");
					const filename = parts[parts.length - 1];
					const publicId = `products/${filename.split(".")[0]}`;
					await cloudinary.uploader.destroy(publicId);
				} catch (error) {
					console.log("Error deleting removed image from Cloudinary", error);
				}
			}
		}

		let updatedImages = [];

		if (Array.isArray(images)) {
			for (const img of images) {
				if (typeof img === "string") {
					if (img.startsWith("data:")) {
						const response = await cloudinary.uploader.upload(img, { folder: "products" });
						updatedImages.push(response.secure_url);
					} else {
						if (!removedImages || !removedImages.includes(img)) {
							updatedImages.push(img);
						}
					}
				}
			}
		}

		product.images = updatedImages.length > 0 ? updatedImages : product.images;
		product.name = name || product.name;
		product.description = description || product.description;
		product.category = category || product.category;

		if (productLink !== undefined) {
			product.productLink = Array.isArray(productLink)
				? productLink
				: typeof productLink === "string"
				? [productLink]
				: product.productLink;
		}

		product.comingSoon = comingSoon !== undefined ? comingSoon : product.comingSoon;

		const updatedProduct = await product.save();

		res.json(updatedProduct);
	} catch (error) {
		console.log("Error in updateProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.images && product.images.length > 0) {
			for (const imgUrl of product.images) {
				try {
					const parts = imgUrl.split("/");
					const filename = parts[parts.length - 1];
					const publicId = `products/${filename.split(".")[0]}`;
					await cloudinary.uploader.destroy(publicId);
				} catch (error) {
					console.log("Error deleting image from Cloudinary", error);
				}
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					images: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.status(200).json({ product });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
