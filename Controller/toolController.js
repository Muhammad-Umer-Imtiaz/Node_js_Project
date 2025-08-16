  import { Tool } from "../Model/ToolsModel.js";
import fs from "fs";
import csv from "csv-parser";

export const addTool = async (req, res) => {
  try {
    console.log(req.body)
    const {
      name,
      link,
      image_url,
      thumbnail_url,
      description,
      tags,
      developer,
      submitted_by,
      overview,
      what_you_can_do_with,
      key_features,
      benefits,
      pricing_plans,
      tips_best_practices,
      faqs,
      final_take,
      pricing,
      rating,
      category,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }
    console.log(req.file)

    const filePath = req.file.path;
    let headers = [];

    const readStream = fs.createReadStream(filePath)
      .pipe(csv())
      .on("headers", (headerList) => {
        headers = headerList; 
        readStream.destroy();
      })
      .on("close", async () => {
        const newTool = await Tool.create({
          name,
          link,
          image_url,
          thumbnail_url,
          description,
          tags,
          developer,
          submitted_by,
          overview,
          what_you_can_do_with,
          key_features,
          benefits,
          pricing_plans,
          tips_best_practices,
          faqs,
          final_take,
          pricing,
          rating,
          category,
          columns: headers, // store CSV column names
        });

        fs.unlinkSync(filePath); // cleanup uploaded CSV

        return res.status(201).json({
          success: true,
          message: "Tool added successfully",
          tool: newTool,
        });
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

