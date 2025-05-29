import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useBlogStore } from "../stores/useBlogStore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import EditBlogForm from "./EditBlogForm";

const MySwal = withReactContent(Swal);

const saddleBrown = "#8B4513";
const saddleBrownHover = "#7A3E0F";
const greekVilla = "#F0EBE3";
const bgTab = "#121212";

const formatDateTime = (dateString) => {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("en-GB", options);
};

const BlogsList = () => {
  const { blogs, fetchAllBlogs, deleteBlog, updateBlog } = useBlogStore();

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const openEditModal = (blog) => {
    MySwal.fire({
      title: <span style={{ color: "white" }}>Edit Blog</span>,
      html: (
        <EditBlogForm
          blogId={blog._id}               // <-- Pass blogId here
          onClose={() => MySwal.close()}
        />
      ),
      showConfirmButton: false,
      showCancelButton: false,
      background: bgTab,
      width: "900px",
      customClass: {
        popup: "rounded-lg",
      },
    });
  };

  return (
    <motion.div
      className="rounded-lg overflow-hidden max-w-6xl mx-auto"
      style={{ backgroundColor: bgTab, boxShadow: `0 0 15px ${saddleBrown}55` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className="min-w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${saddleBrown}` }}>
            {["Image", "Title", "Description", "Date", "Edit", "Delete"].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: greekVilla }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {blogs?.map((blog) => (
            <tr
              key={blog._id}
              className="hover:cursor-pointer"
              style={{
                backgroundColor: bgTab,
                borderBottom: `1px solid ${saddleBrown}`,
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = saddleBrownHover + "33")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgTab)}
            >
              <td className="px-6 py-4">
                <img
                  src={blog.blogImage}
                  alt={blog.blogTitle}
                  className="h-10 w-10 rounded-full object-cover"
                  style={{ border: `1px solid ${saddleBrown}` }}
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium" style={{ color: greekVilla }}>
                {blog.blogTitle}
              </td>
              <td className="px-6 py-4 max-w-xs">
                <div
                  className="text-sm overflow-hidden line-clamp-2"
                  style={{ color: "#C8C8C8" }}
                  dangerouslySetInnerHTML={{ __html: blog.blogDescription }}
                />
              </td>
              <td className="px-6 py-4 text-sm" style={{ color: "#7D7D7D", fontFamily: "monospace" }}>
                {formatDateTime(blog.createdAt)}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => openEditModal(blog)}
                  style={{
                    color: "#4A90E2",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#357ABD")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#4A90E2")}
                  aria-label={`Edit blog ${blog.blogTitle}`}
                >
                  Edit
                </button>
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                <button
                  onClick={() => deleteBlog(blog._id)}
                  style={{
                    color: "#FF5555",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#FF3333")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#FF5555")}
                  aria-label={`Delete blog ${blog.blogTitle}`}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default BlogsList;
