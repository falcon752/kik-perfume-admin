import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,

  setBlogs: (blogs) => set({ blogs }),
  setCurrentBlog: (blog) => set({ currentBlog: blog }),

  fetchAllBlogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/blogs");
      set({ blogs: res.data.blogs, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to fetch blogs" });
      toast.error(error.response?.data?.error || "Failed to fetch blogs");
    }
  },

  fetchBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/blogs/${id}`);
      set({ currentBlog: res.data.blog, loading: false });
      return res.data.blog; // return blog data for use in component
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to fetch blog" });
      toast.error(error.response?.data?.error || "Failed to fetch blog");
      throw error;
    }
  },

  createBlog: async (blogData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/blogs", blogData);
      set((state) => ({
        blogs: [...state.blogs, res.data.blog],
        loading: false,
      }));
      toast.success("Blog created successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to create blog" });
      toast.error(error.response?.data?.error || "Failed to create blog");
    }
  },

  updateBlog: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/blogs/${id}`, updatedData);
      set((state) => ({
        blogs: state.blogs.map((blog) => (blog._id === id ? res.data.blog : blog)),
        loading: false,
      }));
      toast.success("Blog updated successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to update blog" });
      toast.error(error.response?.data?.error || "Failed to update blog");
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/blogs/${id}`);
      set((state) => ({
        blogs: state.blogs.filter((blog) => blog._id !== id),
        loading: false,
      }));
      toast.success("Blog deleted successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.error || "Failed to delete blog" });
      toast.error(error.response?.data?.error || "Failed to delete blog");
    }
  },
}));
