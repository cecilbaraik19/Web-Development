
import Event from "../models/Events.js";

// ============================================================
// GET ALL UPCOMING EVENTS
// GET /api/events
// GET /api/events?search=technology
// ============================================================
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        console.log("EVENTS FOUND:", events.length);
        console.log("EVENT DATA:", events);

        res.status(200).json({
            success: true,
            count: events.length,
            events,
        });
    } catch (error) {
        console.error("Get events error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message,
        });
    }
};


// ============================================================
// GET SINGLE EVENT
// GET /api/events/:id
// ============================================================
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            event,
        });
    } catch (error) {
        console.error("Get event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch event",
            error: error.message,
        });
    }
};


// ============================================================
// CREATE EVENT
// POST /api/events
// ============================================================
export const createEvent = async (req, res) => {
    try {
        const {
            title,
            category,
            date,
            location,
            ticketPrice,
            totalSeats,
            image,
            description,
        } = req.body;

        // Validate required fields
        if (
            !title ||
            !category ||
            !date ||
            !location ||
            totalSeats === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        const event = await Event.create({
            title,
            category,
            date,
            location,
            ticketPrice: Number(ticketPrice) || 0,
            totalSeats: Number(totalSeats),
            availableSeats: Number(totalSeats),
            image: image || "",
            description: description || "",
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });
    } catch (error) {
        console.error("Create event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: error.message,
        });
    }
};


// ============================================================
// UPDATE EVENT
// PUT /api/events/:id
// ============================================================
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event,
        });
    } catch (error) {
        console.error("Update event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: error.message,
        });
    }
};


// ============================================================
// DELETE EVENT
// DELETE /api/events/:id
// ============================================================
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Delete event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: error.message,
        });
    }
};

