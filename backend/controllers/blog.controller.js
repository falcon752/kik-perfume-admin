import Blog from '../models/blog.model.js';

export const createBlog = async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogImage } = req.body;
    const newBlog = new Blog({ blogTitle, blogDescription, blogImage });
    await newBlog.save();
    res.status(201).json({ message: 'Blog created', blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
};

// In blog.controller.js
export const updateBlog = async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogImage } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { blogTitle, blogDescription, blogImage },
      { new: true }
    );
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};



export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete blog', error: error.message });
  }
};
