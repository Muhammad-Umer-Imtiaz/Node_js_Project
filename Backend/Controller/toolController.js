import fs from "fs";
import csv from "csv-parser";
import { Tool } from "../Model/toolsModel.js";
import mongoose from "mongoose";

//add tool through CSV
export const addTool = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const tools = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        tools.push({
          name: row["Tool Name"],
          category: row.Category,
          tags: row.Tags,
          rating: row.Rating,
          pricing: row["Pricing (Raw)"],
          overview: row.Overview,
          what_you_can_do_with: row["What You Can Do With"],
          key_features: row["Key Features"],
          benefits: row.Benefits,
          pricing_plans: row["Pricing Plans"],
          tips_best_practices: row["Tips & Best Practices"],
          faqs: row.FAQs,
          final_take: row["Final Take"],
          link: row["Tool URL"],
          thumbnail_url: row["Thumnail URL"] || row["Thumbnail URL"], // Handle typo
          image_url: row["Logo URL"],
        });
      })
      .on("end", async () => {
        try {
          const savedTools = await Tool.insertMany(tools);
          // Clean up temporary file
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
          return res.status(201).json({
            success: true,
            message: "CSV uploaded and data saved",
          });
        } catch (dbErr) {
          // Clean up on error
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
          return res
            .status(500)
            .json({ message: "Database Error", error: dbErr.message });
        }
      })
      .on("error", (err) => {
        // Clean up on stream error
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
        return res
          .status(500)
          .json({ message: "CSV Parsing Error", error: err.message });
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//add tool through login user
export const AddTool = async (req, res) => {
  try {
    const { name, link, thumbnail_url, image_url, overview } = req.body;
    const userID = req.user;
    if (!name || !link || !thumbnail_url || !image_url || !overview)
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    const add = await Tool.create({
      name,
      link,
      thumbnail_url,
      image_url,
      overview,
      submitted_by: userID,
    });
    return res
      .status(200)
      .json({ message: "Tool add SuccessFully", success: true, add });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
//submit tool via Admin
export const submitTool = async (req, res) => {
  try {
    const { is_approved } = req.body;
    const toolId = req.params.id;

    if (!toolId) {
      return res.status(400).json({ message: "ToolId not found" });
    }

    const tool = await Tool.findByIdAndUpdate(
      toolId,
      { is_approved },
      { new: true }
    );

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    return res.status(200).json({ message: "Submit Todo Successfully", tool });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
export const findToolByUser = async (req, res) => {
  try {
    const id = req.user._id;
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    const tool = await Tool.find({ submitted_by: id });
    if (!tool)
      return res.status(400).json({ message: "No Tool Find you submit" });
    return res
      .status(200)
      .json({ success: true, message: "Get Tool Successfully", tool });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.offset) || 1;

    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const query = { is_approved: true };

    const [results, total] = await Promise.all([
      Tool.find(query).skip(skip).limit(limit),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const Search = async (req, res) => {
  try {
    // const { word } = req.body;
    const word = req.query.q;
    if (!word)
      return res.status(400).json({ message: "Enter a keyword to search" });
    const results = await Tool.find({
      is_approved: true,
      $or: [
        { name: { $regex: word, $options: "i" } },
        // { description: { $regex: word, $options: "i" } },
        // { tags: { $regex: word, $options: "i" } },
        // { category: { $regex: word, $options: "i" } },
      ],
    });
    return res
      .status(200)
      .json({ success: "true", message: "search Successfully", results });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const categoryPagination = async (req, res) => {
  try {
    const categoryName = req.query.category;
    if (!categoryName) {
      return res.status(400).json({ message: "Enter a category Name" });
    }

    const offset = parseInt(req.query.offset) || 0; // default offset = 0
    const limit = parseInt(req.query.limit) || 20;

    const query = { is_approved: true, category: categoryName };

    const [results, total] = await Promise.all([
      Tool.find(query).skip(offset).limit(limit),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      offset,
      limit,
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const suggestions = async (req, res) => {
  try {
    const tag = req.query.tag; // ?tag=marketing
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    if (!tag) {
      return res
        .status(400)
        .json({ message: "Tag query parameter is required" });
    }

    // Search in tags string (case-insensitive)
    const regex = new RegExp(tag, "i");

    const query = {
      is_approved: true,
      tags: { $regex: regex }, // matches "AI#marketing#tools"
    };

    const [results, total] = await Promise.all([
      Tool.find(query).skip(skip).limit(limit),
      Tool.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      currentResults: results.length,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
