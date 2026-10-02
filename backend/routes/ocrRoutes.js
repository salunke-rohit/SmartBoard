import express from "express";
import { recognizeHandwriting } from "../services/trocrService.js";

const router = express.Router();

router.post("/recognize", async (req, res) => {
  try {
    const { image } = req.body || {};

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    console.log("OCR request received");

    const result = await recognizeHandwriting(image);

    console.log("TrOCR result:", result);

    const text =
      Array.isArray(result) && result.length > 0
        ? result[0].generated_text?.trim() || ""
        : "";

    return res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("TrOCR Error:", error);

    return res.status(500).json({
      success: false,
      message: "OCR failed",
    });
  }
});

export default router;