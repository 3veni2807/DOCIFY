import express from "express";
import Document from "../models/Document.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all documents for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.userId });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found." });
    }

    res.status(200).json(documents);
  } catch (error) {
    console.error("Fetch Documents Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get a single document by ID for the logged-in user
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document by ID and ensure the logged-in user owns the document
    const document = await Document.findOne({ _id: id, userId: req.userId });

    if (!document) {
      return res.status(404).json({ message: "Document not found or unauthorized" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Fetch Document Error:", error);
    res.status(500).json({ message: "Error fetching document", error: error.message });
  }
});

// ✅ Create a new document
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Document title is required" });
    }

    const newDocument = new Document({
      userId: req.userId,
      title,
      content: content || "",
    });

    const savedDoc = await newDocument.save();
    res.status(201).json(savedDoc);
  } catch (error) {
    console.error("Document Creation Error:", error);
    res.status(500).json({ message: "Error creating document", error: error.message });
  }
});

// ✅ DELETE a document by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the document by ID and ensure the logged-in user owns the document
    const document = await Document.findOneAndDelete({ _id: id, userId: req.userId });

    if (!document) {
      return res.status(404).json({ message: "Document not found or unauthorized" });
    }

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Document Deletion Error:", error);
    res.status(500).json({ message: "Error deleting document", error: error.message });
  }
});

// ✅ Update a document by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Find the document by ID and ensure the logged-in user owns the document
    const document = await Document.findOne({ _id: id, userId: req.userId });

    if (!document) {
      return res.status(404).json({ message: "Document not found or unauthorized" });
    }

    // Update the document fields
    document.title = title || document.title;
    document.content = content || document.content;

    // Save the updated document
    const updatedDocument = await document.save();
    res.status(200).json(updatedDocument);
  } catch (error) {
    console.error("Document Update Error:", error);
    res.status(500).json({ message: "Error updating document", error: error.message });
  }
});

export default router;