import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Event from "../models/event.model.js";
import Club from "../models/club.model.js"; // Import the Club model

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// File upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
});

// ✅ Create event
router.post("/create", async (req, res) => {
    const { eventId, eventName, picture, details, openTo, volunteerLimit, createdBy, createdByType, createdByClubId } = req.body;

    try {
        // Check if the event ID already exists
        const existingEvent = await Event.findOne({ eventId });
        if (existingEvent) {
            return res.status(400).json({ message: "Event ID already exists" });
        }

        // Validate the createdByType
        if (!["admin", "clubadmin"].includes(createdByType)) {
            return res.status(400).json({ message: "Invalid createdByType" });
        }

        // Validate createdByClubId if provided
        if (createdByType === "clubadmin" && !createdByClubId) {
            return res.status(400).json({ message: "createdByClubId is required for clubadmin" });
        }

        // Create a new event
        const newEvent = new Event({
            eventId,
            eventName,
            picture,
            details,
            openTo,
            volunteerLimit: isNaN(volunteerLimit) ? volunteerLimit : Number(volunteerLimit), // Handle both Number and String
            createdBy,
            createdByType,
            createdByClubId: createdByClubId || null, // Optional field
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Error creating event:", error.message);
        res.status(500).json({ message: "Failed to create event", error: error.message });
    }
});


// ✅ Get all events (for admin view)
router.get("/", async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
});



// ✅ Get events by creator (Admin, Club Admin, or Moderator)
router.get("/my-events", async (req, res) => {
    const { createdBy } = req.query; // Only check for createdBy

    if (!createdBy) {
        return res.status(400).json({ message: "Missing createdBy in query" });
    }

    try {
        // Fetch events only by createdBy (creator's user ID)
        const events = await Event.find({ createdBy });
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this creator" });
        }
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events", error: error.message });
    }
});






// ✅ Update event (with optional file upload and old image deletion)
router.put("/update/:id", upload.single("picture"), async (req, res) => {
    const { id } = req.params;
    const { eventId, eventName, details, openTo, volunteerLimit, createdByClubId } = req.body;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const updateData = {
            eventId,
            eventName,
            details,
            openTo,
            volunteerLimit: isNaN(volunteerLimit) ? volunteerLimit : Number(volunteerLimit), // Handle both Number and String
        };

        // ✅ Handle new file upload
        if (req.file) {
            const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            updateData.picture = fileUrl;

            // ✅ Delete old file if it exists and is local
            if (event.picture && event.picture.startsWith(`${req.protocol}://${req.get("host")}/uploads/`)) {
                const oldFilePath = path.join("uploads", path.basename(event.picture));
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error("Error deleting old file:", err.message);
                });
            }
        } else if (req.body.picture) {
            updateData.picture = req.body.picture;
        }

        // ✅ Update createdByClubId if provided
        if (createdByClubId) {
            updateData.createdByClubId = createdByClubId;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error.message);
        res.status(500).json({ message: "Failed to update event", error: error.message });
    }
});  

// ✅ Delete event and its associated image file
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // If the event has an associated picture (image), delete it from the server
        if (event.picture && event.picture.startsWith(`${req.protocol}://${req.get("host")}/uploads/`)) {
            const oldFilePath = path.join("uploads", path.basename(event.picture));
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    console.error("Error deleting old file:", err.message);
                } else {
                    console.log("Old file deleted successfully");
                }
            });
        }

        // Delete the event from the database
        const deletedEvent = await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event and associated image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete event", error: error.message });
    }
});




router.post("/join/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body; // Extract userId from the request body

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the event is restricted to club members only
    if (event.openTo === "clubMembersOnly") {
      if (!event.createdByClubId) {
        return res.status(400).json({ message: "Event is restricted to club members, but no club is associated with this event" });
      }

      // Fetch the club and check if the user is a member
      const club = await Club.findById(event.createdByClubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }

      const member = club.members.find(
        (member) => member.userId.toString() === userId
      );

      if (!member) {
        return res.status(403).json({ message: "You must be a member of the club to join this event" });
      }

      // Check if the user is banned by the club
      if (member.banned) {
        return res.status(403).json({ message: "You are banned from this club and cannot join its events" });
      }
    }

    // Check if the volunteer limit is reached
    if (
      event.volunteerLimit !== "No limit" &&
      event.volunteersJoined >= event.volunteerLimit
    ) {
      return res.status(400).json({ message: "Volunteer limit reached" });
    }

    // Check if the user is already a volunteer
    const alreadyJoined = event.eventVolunteerList.some(
      (volunteer) => volunteer.userId.toString() === userId
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: "You have already joined this event" });
    }

    // Add the user to the volunteer list
    event.eventVolunteerList.push({ userId, joinedAt: new Date() });
    event.volunteersJoined += 1;
    await event.save();

    res.status(200).json({ message: "Successfully joined the event" });
  } catch (error) {
    console.error("Error joining event:", error);
    res.status(500).json({ message: "Failed to join event" });
  }
});

router.get("/joined-events", async (req, res) => {
    const userId = req.userId; // Extracted from token middleware
  
    try {
      const events = await Event.find({
        "eventVolunteerList.userId": userId, // Find events where the user is a volunteer
      }).sort({ createdAt: -1 });
  
      res.status(200).json({ events });
    } catch (error) {
      console.error("Error fetching joined events:", error);
      res.status(500).json({ message: "Failed to fetch joined events" });
    }
  });


router.post("/leave/:eventId", async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body; // Extract userId from the request body

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is a volunteer
    const isVolunteer = event.eventVolunteerList.some(
      (volunteer) => volunteer.userId.toString() === userId
    );
    if (!isVolunteer) {
      return res.status(400).json({ message: "You are not a volunteer for this event" });
    }

    // Remove the user from the volunteer list
    event.eventVolunteerList = event.eventVolunteerList.filter(
      (volunteer) => volunteer.userId.toString() !== userId
    );
    event.volunteersJoined -= 1;
    await event.save();

    res.status(200).json({ message: "Successfully left the event" });
  } catch (error) {
    console.error("Error leaving event:", error);
    res.status(500).json({ message: "Failed to leave event" });
  }
});

router.post("/joined-events", async (req, res) => {
  const { userId } = req.body; // Extract userId from the request body

  try {
    const events = await Event.find({
      "eventVolunteerList.userId": userId, // Find events where the user is a volunteer
    }).sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching joined events:", error);
    res.status(500).json({ message: "Failed to fetch joined events" });
  }
});

export default router;
