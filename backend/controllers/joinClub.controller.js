import Club from "../models/club.model.js";
import JoinClub from "../models/joinClub.model.js";
import {User} from "../models/user.model.js";
// import mongoose from "mongoose";

// Fetch all clubs
export const getAllClubs = async (req, res) => {
    const userId = req.userId; // Extracted from the token via verifyToken middleware

    try {
        // Fetch the user's clubs
        const user = await User.findById(userId).select("clubs");
        const userClubIds = user.clubs.map((club) => club.clubId.toString());

        // Fetch clubs excluding the ones the user is already a member of
        const clubs = await Club.find({ _id: { $nin: userClubIds } }).select(
            "_id clubName description totalMembers departments"
        );

        res.status(200).json({ clubs });
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ error: "Failed to fetch clubs" });
    }
};

// Create a join request
export const createJoinRequest = async (req, res) => {
    const { clubId } = req.params;
    const { message } = req.body;
    const userId = req.userId; // Extracted from the token via verifyToken middleware

    try {
        // Check if the club exists
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ error: "Club not found" });
        }

        // Check if the user already has a pending request
        const existingRequest = await JoinClub.findOne({ clubId, userId, status: "pending" });
        if (existingRequest) {
            return res.status(400).json({ error: "You already have a pending request for this club" });
        }

        // Create a new join request
        const joinRequest = new JoinClub({
            clubId,
            userId,
            message,
        });

        await joinRequest.save();
        res.status(201).json({ message: "Join request sent successfully" });
    } catch (error) {
        console.error("Error creating join request:", error);
        res.status(500).json({ error: "Failed to create join request" });
    }
};

// Fetch all join requests for a specific club
export const getJoinRequests = async (req, res) => {
  const { clubId } = req.params;
//   console.log("clubId:", clubId);

//   if (!mongoose.isValidObjectId(clubId)) {
//     return res.status(400).json({ error: "Invalid Club ID" });
//   }

  if (!clubId) {
    return res.status(400).json({ error: "Club ID is required" });
  }

  try {
    const joinRequests = await JoinClub.find({ clubId, status: "pending" })
      .populate("userId", "name email") // Populate user details
      .select("userId message status createdAt");

    res.status(200).json({ joinRequests });
  } catch (error) {
    console.error("Error fetching join requests:", error);
    res.status(500).json({ error: "Failed to fetch join requests" });
  }
};

// Accept or deny a join request
export const handleJoinRequest = async (req, res) => {
  const { requestId } = req.params;
  const { action } = req.body; // "accept" or "deny"
  const adminId = req.userId; // Extracted from the token via verifyToken middleware

  try {
    const joinRequest = await JoinClub.findById(requestId);

    if (!joinRequest) {
      return res.status(404).json({ error: "Join request not found" });
    }

    if (action === "accept") {
      // Add the user to the club's members
      const club = await Club.findById(joinRequest.clubId);
      const user = await User.findById(joinRequest.userId);

      if (!club || !user) {
        return res.status(404).json({ error: "Club or user not found" });
      }

      // Add user to the club's members
      club.members.push({
        userId: joinRequest.userId,
        clubRole: "member",
      });
      club.totalMembers += 1;

      // Add club to the user's clubs
      user.clubs.push({
        clubId: joinRequest.clubId,
        clubRole: "member",
      });

      await club.save();
      await user.save();

      // Update the join request status
      joinRequest.status = "approved";
      joinRequest.reviewedBy = adminId;
      joinRequest.reviewedAt = new Date();
      await joinRequest.save();

      res.status(200).json({ message: "Join request accepted" });
    } else if (action === "deny") {
      // Update the join request status
      joinRequest.status = "rejected";
      joinRequest.reviewedBy = adminId;
      joinRequest.reviewedAt = new Date();
      await joinRequest.save();

      res.status(200).json({ message: "Join request denied" });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling join request:", error);
    res.status(500).json({ error: "Failed to handle join request" });
  }
};