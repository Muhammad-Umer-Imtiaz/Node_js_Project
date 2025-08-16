import mongoose from "mongoose";

const CATEGORY_CHOICES = [
  "Business & Productivity",
  "Education & Knowledge",
  "Environmental",
  "Food & Nutrition",
  "Government & Public Sector",
  "Health & Wellness",
  "Language & Communication",
  "Media & Entertainment",
  "NFT & Blockchain",
  "Personal & Lifestyle",
  "Security & Privacy",
  "Sports",
  "Tech & Engineering",
  "Travel & Navigation",
  "Utilities & Tools",
  "Other",
];

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 255 },
    link: { type: String, required: true, maxlength: 500 },
    image_url: { type: String, maxlength: 500 },
    thumbnail_url: { type: String, maxlength: 500 },
    description: { type: String },
    tags: { type: String },
    is_approved: { type: Boolean, default: true },
    click_count: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    developer: { type: String, maxlength: 255 },
    submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    overview: { type: String },
    what_you_can_do_with: { type: String },
    key_features: { type: String },
    benefits: { type: String },
    columns: {
      type: [String],
    },
    pricing_plans: { type: String },
    tips_best_practices: { type: String },
    faqs: { type: String },
    final_take: { type: String },
    pricing: { type: String },
    rating: { type: String },
    category: { type: String, enum: CATEGORY_CHOICES, default: "Other" },
  },
  { timestamps: true }
);

export const Tool = mongoose.model("Tool", ToolSchema);
