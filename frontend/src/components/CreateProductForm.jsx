import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../index.css";

const categories = ["Enchanted Dew", "Ethereal Petals", "Mystic Horizon"];
const saddleBrown = "#8B4513", saddleBrownHover = "#7A3E0F", greekVilla = "#F0EBE3", cream = "#F0EBE3", bgTab = "#121212";

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", category: "",
    images: [], productLink: [], comingSoon: false
  });

  const { createProduct, loading } = useProductStore();
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...newProduct });
      setNewProduct({
        name: "", description: "", price: "", category: "",
        images: [], productLink: [], comingSoon: false
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
    const files = Array.from(e.target.files);
    const imageReaders = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imageReaders).then(images => {
      setNewProduct(prev => ({ ...prev, images: [...prev.images, ...images] }));
    });
  };

  const addLinks = (input) => {
    const links = input.split(/[, \n]+/).map((l) => l.trim()).filter((l) => l && !newProduct.productLink.includes(l));
    if (links.length) setNewProduct((prev) => ({ ...prev, productLink: [...prev.productLink, ...links] }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addLinks(e.target.value);
      e.target.value = "";
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    addLinks(e.clipboardData.getData("text"));
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeLink = (index) => {
    setNewProduct((prev) => {
      const newLinks = [...prev.productLink];
      newLinks.splice(index, 1);
      return { ...prev, productLink: newLinks };
    });
  };

  const removeImage = (indexToRemove) => {
    setNewProduct((prev) => {
      const newImages = [...prev.images];
      newImages.splice(indexToRemove, 1);
      return { ...prev, images: newImages };
    });
  };


  return (
    <div className="flex flex-col justify-start sm:px-6 lg:px-8 min-h-screen" style={{ backgroundColor: bgTab, paddingTop: "2rem" }}>
      <motion.div className="sm:mx-auto sm:w-full sm:max-w-3xl" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2 className="text-center text-3xl font-extrabold" style={{ color: greekVilla }}></h2>
      </motion.div>

      <motion.div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <div className="py-8 px-6 shadow-sm sm:rounded-lg sm:px-10" style={{ backgroundColor: "#000000", boxShadow: `0 4px 15px 0 rgba(139, 69, 19, 0.7)` }}>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium" style={{ color: greekVilla }}>Product Name</label>
              <input type="text" id="name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{ backgroundColor: bgTab, border: `1px solid ${saddleBrown}`, color: greekVilla }}
                onFocus={handleFocus} onBlur={handleBlur} required />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: greekVilla }}>Description</label>
              <CKEditor editor={ClassicEditor} data={newProduct.description}
                onChange={(event, editor) => setNewProduct({ ...newProduct, description: editor.getData() })}
                config={{ toolbar: ["bold", "italic", "link", "undo", "redo", "bulletedList", "numberedList"], height: 150 }} />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium" style={{ color: greekVilla }}>Category</label>
              <select id="category" value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{ backgroundColor: bgTab, border: `1px solid ${saddleBrown}`, color: greekVilla }}
                onFocus={handleFocus} onBlur={handleBlur} required>
                <option value="">Select a category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Product Links */}
            <div>
              <label htmlFor="productLinkInput" className="block text-sm font-medium" style={{ color: greekVilla }}>Product Links</label>
              <div className="flex flex-wrap gap-2 p-2 rounded-md border"
                style={{ backgroundColor: bgTab, border: `1px solid ${saddleBrown}`, color: greekVilla }}
                onClick={() => inputRef.current?.focus()}>
                {newProduct.productLink.map((link, i) => (
                  <span key={i} className="flex items-center px-2 py-1 rounded" style={{ backgroundColor: saddleBrownHover }}>
                    {link}
                    <button onClick={() => removeLink(i)} className="ml-1 text-xs font-bold" style={{ background: "transparent", border: "none", color: greekVilla }}>×</button>
                  </span>
                ))}
                <input ref={inputRef} type="text" placeholder="Paste/type links, press comma or enter"
                  className="flex-grow bg-transparent border-none outline-none text-sm"
                  style={{ color: greekVilla }} onKeyDown={handleKeyDown} onPaste={handlePaste} />
              </div>
            </div>

            {/* Coming Soon */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: greekVilla }}>Coming Soon</label>
              <button type="button" onClick={() => setNewProduct({ ...newProduct, comingSoon: !newProduct.comingSoon })}
                className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold"
                style={{ backgroundColor: newProduct.comingSoon ? saddleBrownHover : bgTab, color: greekVilla, borderColor: saddleBrown }}>
                {newProduct.comingSoon ? "Enabled" : "Disabled"}
              </button>
            </div>

            {/* Image Upload */}
            <div>
              <input type="file" id="images" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
              <label htmlFor="images"
                className="cursor-pointer inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold shadow-sm"
                style={{ backgroundColor: bgTab, color: greekVilla }}>
                <Upload className="mr-2 h-5 w-5" /> Select Images
              </label>

              {/* Image Previews */}
              <div className="flex flex-wrap gap-2 mt-3">
                {newProduct.images.map((src, index) => (
                  <div
                    key={index}
                    className="relative mt-2 h-20 w-20 rounded-md"
                    style={{ border: `1px solid ${saddleBrown}` }}
                  >
                    <img
                      src={src}
                      alt={`preview-${index}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center shadow-md"
                      title="Remove Image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* Submit Button */}
            <button type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold"
              disabled={loading}
              style={{ backgroundColor: saddleBrown, color: greekVilla }}>
              {loading ? (<><Loader className="animate-spin mr-2 h-5 w-5" /> Creating...</>) : (<><PlusCircle className="mr-2 h-5 w-5" /> Create Product</>)}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateProductForm;
