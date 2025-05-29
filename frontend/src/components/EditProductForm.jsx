import React, { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const bgTab = "#121212";

const categories = ["Enchanted Dew", "Ethereal Petals", "Mystic Horizon"];

const EditProductForm = ({ product, onSave, onCancel, loading }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    productLink: [],
    comingSoon: false,
  });

  const inputRef = useRef(null);

  useEffect(() => {
    setEditedProduct({
      name: "",
      description: "",
      category: "",
      image: "",
      productLink: [],
      comingSoon: false,
      ...product,
      productLink: Array.isArray(product?.productLink) ? product.productLink : [],
    });
  }, [product]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name !== "productLink") {
      setEditedProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Add links helper
  const addLinks = (input) => {
    const links = input
      .split(/[, \n]+/)
      .map((l) => l.trim())
      .filter((l) => l && !editedProduct.productLink.includes(l));
    if (links.length) {
      setEditedProduct((prev) => ({
        ...prev,
        productLink: [...prev.productLink, ...links],
      }));
    }
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
    const paste = e.clipboardData.getData("text");
    addLinks(paste);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeLink = (index) => {
    setEditedProduct((prev) => {
      const newLinks = [...prev.productLink];
      newLinks.splice(index, 1);
      return { ...prev, productLink: newLinks };
    });
  };

  // Handle image change (copied styles from EditBlogForm)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(editedProduct);
      }}
      style={{
        backgroundColor: bgTab,
        color: greekVilla,
        padding: "1rem",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <label>
        Product Name
        <input
          type="text"
          name="name"
          value={editedProduct.name || ""}
          onChange={handleInputChange}
          required
          autoFocus
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: `1px solid ${saddleBrown}`,
            backgroundColor: bgTab,
            color: greekVilla,
          }}
        />
      </label>

      <label>
        Description
        <CKEditor
          editor={ClassicEditor}
          data={editedProduct.description || ""}
          onChange={(event, editor) => {
            const data = editor.getData();
            setEditedProduct((prev) => ({ ...prev, description: data }));
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
      </label>

      <label>
        Category
        <select
          name="category"
          value={editedProduct.category || ""}
          onChange={handleInputChange}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "4px",
            border: `1px solid ${saddleBrown}`,
            backgroundColor: bgTab,
            color: greekVilla,
          }}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
              style={{ backgroundColor: bgTab, color: greekVilla }}
            >
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label>
        Product Links
        <div
          className="flex flex-wrap gap-2 p-2 rounded-md border"
          style={{
            backgroundColor: bgTab,
            border: `1px solid ${saddleBrown}`,
            minHeight: "60px",
            cursor: "text",
            color: greekVilla,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          {editedProduct.productLink.map((link, i) => (
            <span
              key={i}
              style={{
                backgroundColor: saddleBrownHover,
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              {link}
              <button
                type="button"
                onClick={() => removeLink(i)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: greekVilla,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste/type links, press comma or enter"
            style={{
              flexGrow: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: greekVilla,
              minWidth: "120px",
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />
        </div>
      </label>

      {/* Image upload button & preview: styles copied from EditBlogForm */}
      <input
        type="file"
        id="editImageUpload"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
      />
      <label
        htmlFor="editImageUpload"
        className="cursor-pointer inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: bgTab,
          color: greekVilla,
          borderColor: saddleBrown,
          userSelect: "none",
          width: "fit-content",
        }}
      >
        Upload New Product Image
      </label>

      {editedProduct.image && (
        <img
          src={editedProduct.image}
          alt="Product Preview"
          className="mt-2 rounded-md object-cover"
          style={{
            height: "80px",
            width: "80px",
            border: `1px solid ${saddleBrown}`,
            userSelect: "none",
          }}
        />
      )}

      <label style={{ cursor: "pointer" }}>
        Coming Soon
        <input
          type="checkbox"
          name="comingSoon"
          checked={editedProduct.comingSoon || false}
          onChange={handleInputChange}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: "transparent",
            color: greekVilla,
            border: `1px solid ${saddleBrown}`,
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: saddleBrown,
            color: greekVilla,
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            border: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saddleBrownHover)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = saddleBrown)}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
