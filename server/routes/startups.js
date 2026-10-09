import express from "express";
import Startup from "../models/Startup.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { industry: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    const startups = await Startup.find(filter).sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: "Startup not found." });
    res.json(startup);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json(startup);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!startup) return res.status(404).json({ message: "Startup not found." });
    res.json(startup);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ message: "Startup not found." });
    res.json({ message: "Startup deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
