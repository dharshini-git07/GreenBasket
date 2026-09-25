import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productNumber: {
      type: Number,
      default: 1,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Organic',
        'Reusable',
        'Sustainable Home',
        'Plastic-Free',
        'Energy Saving',
        'Personal Care',
      ],
      index: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    ecoScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 90,
    },
    ecoAttributes: {
      reusable: { type: Boolean, default: false },
      recyclable: { type: Boolean, default: false },
      plasticFree: { type: Boolean, default: false },
      sustainableMaterial: { type: Boolean, default: false },
      energyEfficient: { type: Boolean, default: false },
      organic: { type: Boolean, default: false },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 12,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search Index for MongoDB
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
