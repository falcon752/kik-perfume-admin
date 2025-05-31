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
    images: [],
    productLink: [],
    comingSoon: false,
  });
  const [removedImages, setRemovedImages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditedProduct({
      name: "",
      description: "",
      category: "",
      images: [],
      productLink: [],
      comingSoon: false,
      ...product,
      images: Array.isArray(product?.images) ? product.images : [],
      productLink: Array.isArray(product?.productLink) ? product.productLink : [],
    });
    setRemovedImages([]);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name !== "productLink") {
      setEditedProduct((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setEditedProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...images], // Append multiple images
      }));
    });
  };

  const handleRemoveImage = (index) => {
    const removedImg = editedProduct.images[index];
    setEditedProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages.splice(index, 1);
      return { ...prev, images: updatedImages };
    });

    if (typeof removedImg === "string" && removedImg.startsWith("http")) {
      setRemovedImages((prev) => [...prev, removedImg]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...editedProduct, removedImages });
  };

  return (
    <form
      onSubmit={handleSubmit}
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
                aria-label={`Remove link ${link}`}
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

      <input
        type="file"
        id="editImageUpload"
        accept="image/*"
        multiple
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
        aria-label="Select product images"
      >
        Select Images
      </label>

      {editedProduct.images?.length > 0 && (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {editedProduct.images.map((img, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={img}
                alt={`Product ${index}`}
                style={{
                  height: "80px",
                  width: "80px",
                  objectFit: "cover",
                  border: `1px solid ${saddleBrown}`,
                  borderRadius: "6px",
                  userSelect: "none",
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  lineHeight: "20px",
                  textAlign: "center",
                }}
                aria-label={`Remove image ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

{/* Coming Soon */}
<div>
  <label className="block text-sm font-medium mb-1" style={{ color: greekVilla }}>
    Coming Soon
  </label>
  <button
    type="button"
    onClick={() => setEditedProduct({ ...editedProduct, comingSoon: !editedProduct.comingSoon })}
    className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold"
    style={{
      backgroundColor: editedProduct.comingSoon ? saddleBrownHover : bgTab,
      color: greekVilla,
      borderColor: saddleBrown,
    }}
  >
    {editedProduct.comingSoon ? "Enabled" : "Disabled"}
  </button>
</div>


      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: "transparent",
            color: greekVilla,
            border: `1px solid ${saddleBrown}`,
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: saddleBrown,
            color: greekVilla,
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
