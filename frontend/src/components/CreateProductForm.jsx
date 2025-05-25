import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../index.css";

const categories = ["Enchanted Dew", "Ethereal Petals", "Mystic Horizon"];

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const cream = "#F0EBE3";
const bgTab = "#121212";

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    productLink: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...newProduct });
      setNewProduct({
        name: "",
        description: "",
        category: "",
        image: "",
        productLink: "",
      });
    } catch (error) {
      console.error("Error creating product:", error.message);
    }
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = cream;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${cream}88`;
  };

  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = saddleBrown;
    e.currentTarget.style.boxShadow = "none";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col justify-start sm:px-6 lg:px-8 min-h-screen"
      style={{ backgroundColor: "#121212", paddingTop: "2rem" }}
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          className="text-center text-3xl font-extrabold"
          style={{ color: greekVilla }}
        >
          {/* Create New Product */}
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
<div
  className="py-8 px-6 shadow-sm sm:rounded-lg sm:px-10"
  style={{
    backgroundColor: "#000000",
    boxShadow: "0 4px 15px 0 rgba(139, 69, 19, 0.7)", // saddle brown shadow
  }}
>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium"
                style={{ color: greekVilla }}
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{
                  backgroundColor: "#121212",
                  border: `1px solid ${saddleBrown}`,
                  color: greekVilla,
                  caretColor: greekVilla,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                placeholder=""
              />
            </div>

            {/* Description with CKEditor */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
                style={{ color: greekVilla }}
              >
                Description
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={newProduct.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setNewProduct({ ...newProduct, description: data });
                }}
                config={{
                  toolbar: [
                    "bold",
                    "italic",
                    "link",
                    "undo",
                    "redo",
                    "bulletedList",
                    "numberedList",
                  ],
                  height: 150,
                }}
              />
            </div>



            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium"
                style={{ color: greekVilla }}
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{
                  backgroundColor: "#121212",
                  border: `1px solid ${saddleBrown}`,
                  color: greekVilla,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              >
                <option value="" style={{ color: "#888" }}>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    style={{ backgroundColor: "#121212", color: greekVilla }}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Link */}
            <div>
              <label
                htmlFor="productLink"
                className="block text-sm font-medium"
                style={{ color: greekVilla }}
              >
                Product Link
              </label>
              <input
                type="url"
                id="productLink"
                name="productLink"
                value={newProduct.productLink}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, productLink: e.target.value })
                }
                placeholder="https://example.com/product"
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{
                  backgroundColor: "#121212",
                  border: `1px solid ${saddleBrown}`,
                  color: greekVilla,
                  caretColor: greekVilla,
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Image Upload */}
            <div>
              <input
                type="file"
                id="image"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="image"
                className="cursor-pointer inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: bgTab, color: greekVilla }}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Image
              </label>
              {newProduct.image && (
                <span className="ml-3 text-sm" style={{ color: greekVilla }}>
                  Image uploaded
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              style={{ backgroundColor: saddleBrown, color: greekVilla }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = saddleBrownHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = saddleBrown)
              }
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Product
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProductForm;
