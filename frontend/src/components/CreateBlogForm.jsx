import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useBlogStore } from "../stores/useBlogStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../index.css";

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const cream = "#F0EBE3";
const bgTab = "#121212";

const CreateBlogForm = () => {
  const [newBlog, setNewBlog] = useState({
    blogTitle: "",
    blogDescription: "",
    blogImage: "",
  });

  const { createBlog, loading } = useBlogStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBlog({ ...newBlog });
      setNewBlog({
        blogTitle: "",
        blogDescription: "",
        blogImage: "",
      });
    } catch (error) {
      console.error("Error creating blog:", error.message);
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
        setNewBlog({ ...newBlog, blogImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col justify-start sm:px-6 lg:px-8 min-h-screen"
      style={{ backgroundColor: bgTab, paddingTop: "2rem" }}
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
<div
  className="py-8 px-6 shadow sm:rounded-lg sm:px-10"
  style={{
    backgroundColor: "#000000",
    boxShadow: `0 4px 15px 0 ${saddleBrown}88`,
  }}
>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blog Title */}
            <div>
              <label
                htmlFor="blogTitle"
                className="block text-sm font-medium"
                style={{ color: greekVilla }}
              >
                Blog Title
              </label>
              <input
                type="text"
                id="blogTitle"
                name="blogTitle"
                value={newBlog.blogTitle}
                onChange={(e) =>
                  setNewBlog({ ...newBlog, blogTitle: e.target.value })
                }
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{
                  backgroundColor: bgTab,
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

            {/* Blog Description (CKEditor) */}
            <div>
              <label
                htmlFor="blogDescription"
                className="block text-sm font-medium mb-1"
                style={{ color: greekVilla }}
              >
                Blog Description
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={newBlog.blogDescription}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setNewBlog({ ...newBlog, blogDescription: data });
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

            {/* Image Upload */}
            <div>
              <input
                type="file"
                id="blogImage"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
              <label
                htmlFor="blogImage"
                className="cursor-pointer inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: bgTab, color: greekVilla }}
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Blog Image
              </label>
              {newBlog.blogImage && (
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
                  Create Blog Post
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateBlogForm;
