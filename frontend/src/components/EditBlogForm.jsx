import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Loader } from "lucide-react";
import { useBlogStore } from "../stores/useBlogStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const styles = {
  saddle: "#8B4513",
  hover: "#7A3E0F",
  villa: "#F0EBE3",
  bgTab: "#121212",
  card: "#000000",
};

const EditBlogForm = ({ blogId, onClose = () => {} }) => {
  const { fetchBlogById, updateBlog, loading } = useBlogStore();
  const [blogData, setBlogData] = useState({
    blogTitle: "",
    blogDescription: "",
    blogImage: "",
  });

  useEffect(() => {
    if (!blogId) return;
    (async () => {
      try {
        const data = await fetchBlogById(blogId);
        if (data) {
          setBlogData({
            blogTitle: data.blogTitle || "",
            blogDescription: data.blogDescription || "",
            blogImage: data.blogImage || "",
          });
        }
      } catch (err) {
        console.error("Failed to load blog:", err);
      }
    })();
  }, [blogId, fetchBlogById]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!blogId) {
      console.error("Cannot update blog: blogId is undefined");
      return;
    }

    try {
      await updateBlog(blogId, blogData);
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error("Failed to update blog:", err);
    }
  };

  const handleFocus = (e) => {
    e.currentTarget.style.borderColor = styles.villa;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${styles.villa}88`;
  };

  const handleBlur = (e) => {
    e.currentTarget.style.borderColor = styles.saddle;
    e.currentTarget.style.boxShadow = "none";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setBlogData((prev) => ({ ...prev, blogImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col justify-start sm:px-6 lg:px-8 min-h-screen"
      style={{ backgroundColor: styles.bgTab, paddingTop: "2rem" }}
    >
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2
          style={{ color: styles.villa, fontSize: "1.5rem", fontWeight: "bold" }}
        >
          Edit Blog Post
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="py-8 px-6 shadow sm:rounded-lg sm:px-10"
          style={{ backgroundColor: styles.card, boxShadow: `0 4px 15px 0 ${styles.saddle}88` }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="blogTitle"
                className="block text-sm font-medium"
                style={{ color: styles.villa }}
              >
                Blog Title
              </label>
              <input
                type="text"
                id="blogTitle"
                name="blogTitle"
                required
                value={blogData.blogTitle}
                onChange={(e) =>
                  setBlogData({ ...blogData, blogTitle: e.target.value })
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="block w-full px-3 py-2 rounded-md shadow-sm sm:text-sm"
                style={{
                  backgroundColor: styles.bgTab,
                  border: `1px solid ${styles.saddle}`,
                  color: styles.villa,
                  caretColor: styles.villa,
                }}
              />
            </div>

            <div>
              <label
                htmlFor="blogDescription"
                className="block text-sm font-medium mb-1"
                style={{ color: styles.villa }}
              >
                Blog Description
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={blogData.blogDescription}
                onChange={(_, editor) =>
                  setBlogData((prev) => ({
                    ...prev,
                    blogDescription: editor.getData(),
                  }))
                }
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
                }}
              />
            </div>

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
                style={{
                  backgroundColor: styles.bgTab,
                  color: styles.villa,
                  borderColor: styles.saddle,
                }}
              >
                <Upload className="mr-2 h-5 w-5" /> Upload New Blog Image
              </label>
              {blogData.blogImage && (
                <img
                  src={blogData.blogImage}
                  alt="Blog Preview"
                  className="mt-2 h-20 w-20 rounded-md object-cover"
                  style={{ border: `1px solid ${styles.saddle}` }}
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              style={{ backgroundColor: styles.saddle, color: styles.villa }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.saddle)}
            >
              {loading ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditBlogForm;
