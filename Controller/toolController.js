import fs from "fs";
import csv from "csv-parser";
import { Tool } from "../Model/toolsModel.js";

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
          pricing: row["Pricing Plans"],
          tips_best_practices: row["Tips & Best Practices"],
          faqs: row.FAQs,
          final_take: row["Final Take"],
          link: row["Tool URL"],
          thumbnail_url: row["Thumnail URL"],
          image_url: row["Logo URL"],
        });
      })
      .on("end", async () => {
        try {
          const savedTools = await Tool.insertMany(tools);
          return res.status(201).json({
            success: true,
            message: "CSV uploaded and data saved",
          });
        } catch (dbErr) {
          return res
            .status(500)
            .json({ message: "DataBase Error", error: dbErr.message });
        }
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
    const { name, link, thumbnail_url, image_url, key_features } = req.body;
    console.log(req.user);
    const userID = req.user;
    console.log(userID);
    if (!name || !link || !thumbnail_url || !image_url || !key_features)
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    const add = await Tool.create({
      name,
      link,
      thumbnail_url,
      image_url,
      key_features,
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
    console.log(toolId);

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

export const pagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

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
    const { word } = req.body;
    if (!word)
      return res.status(400).json({ message: "Enter a keyword to search" });
    const searchWord = await Tool.find({
      is_approved: true,
      $or: [
        { name: { $regex: word, $options: "i" } },
        { description: { $regex: word, $options: "i" } },
        { tags: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
      ],
    });
    return res
      .status(200)
      .json({ success: "true", message: "search Successfully", searchWord });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const categoryPagination = async (req, res) => {
  try {
    const { categoryName } = req.body;
    // const categoryName = req.query.category;
    if (!categoryName) {
      return res.status(400).json({ message: "Enter a category Name" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { is_approved: true, category: categoryName };

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

export const suggestions = async (req, res) => {
  try {
    const id = req.params.id;

    const tool = await Tool.findById(id);
    if (!tool)
      return res
        .status(400)
        .json({ message: "Tool not Found", success: false });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const getTags = tool.tags.split("#").filter(Boolean);

    const regexTags = getTags.map((tag) => ({
      tags: { $regex: tag, $options: "i" },
    }));
    const query = {
      is_approved: true,
      $or: regexTags,
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
