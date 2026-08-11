import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

// GET all events
router.get("/", getEvents);

// GET one event
router.get("/:id", getEventById);

// CREATE event
router.post("/", createEvent);

// UPDATE event
router.put("/:id", updateEvent);

// DELETE event
router.delete("/:id", deleteEvent);

export default router;