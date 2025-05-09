import express from "express";
import { User } from "../models/user.model.js";
import Club from "../models/club.model.js"; // Import the Club model

const router = express.Router();

// List all users
router.get("/list", async (req, res) => {
    try {
        const users = await User.find()
            .populate("clubs.clubId", "clubName")
            .select("name email role clubs eventBannedCount bannedAccount");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

router.patch("/ban/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { bannedAccount: true }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update the `banned` field in the `members` array of all clubs the user is part of
        await Club.updateMany(
            { "members.userId": user._id },
            { $set: { "members.$[elem].banned": true, "members.$[elem].bannedAt": new Date() } },
            { arrayFilters: [{ "elem.userId": user._id }] }
        );

        res.status(200).json({ message: "User banned successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to ban user", error: error.message });
    }
});




router.patch("/unban/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { bannedAccount: false }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update the `banned` field in the `members` array of all clubs the user is part of
        await Club.updateMany(
            { "members.userId": user._id },
            { $set: { "members.$[elem].banned": false, "members.$[elem].bannedAt": null } },
            { arrayFilters: [{ "elem.userId": user._id }] }
        );

        res.status(200).json({ message: "User unbanned successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to unban user", error: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove the user from the `members` array of all clubs
        const clubs = await Club.updateMany(
            { "members.userId": user._id },
            { $pull: { members: { userId: user._id } }, $inc: { totalMembers: -1 } }
        );

        res.status(200).json({ message: "User deleted successfully", clubs });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});

export default router;
