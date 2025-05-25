import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true,
  },
  blogDescription: {
    type: String,
    required: true,
  },
  blogImage: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
