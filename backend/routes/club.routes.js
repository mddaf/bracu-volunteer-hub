import express from "express";
import Club from "../models/club.model.js";
import { User } from '../models/user.model.js';
import Event from "../models/event.model.js"; // Import the Event model
import bcrypt from "bcryptjs";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


// ✅ Create Club & User
router.post("/create-club", async (req, res) => {
    const { clubName, username, email, password, confirmPassword, clubRole } = req.body;

    try {
        // Check if the club name already exists
        const existingClub = await Club.findOne({ clubName });
        if (existingClub) {
            return res.status(400).json({ message: "Club name already exists." });
        }

        // Create the new club
        const newClub = new Club({ clubName });
        await newClub.save();

        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Check if the user is already a member of the club
            const isAlreadyMember = existingUser.clubs.some(
                (club) => club.clubId.toString() === newClub._id.toString()
            );

            if (isAlreadyMember) {
                return res.status(400).json({ message: "User is already a member of this club." });
            }

            // Add the user to the club
            existingUser.clubs.push({ clubId: newClub._id, clubRole });
            await existingUser.save();

            newClub.members.push({ userId: existingUser._id, clubRole });
            newClub.totalMembers += 1; // Increment total members
            await newClub.save();

            return res.status(200).json({
                message: "Club created and user added successfully.",
                club: newClub,
                user: existingUser,
            });
        }

        // If the user does not exist, validate passwords
        if (!password || !confirmPassword || password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match or are missing." });
        }

        // Hash the password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: username, // Use the provided username
            email,
            password: hashedPassword,
            clubs: [{ clubId: newClub._id, clubRole }],
        });

        await newUser.save();

        // Add the new user to the club
        newClub.members.push({ userId: newUser._id, clubRole });
        newClub.totalMembers += 1; // Increment total members
        await newClub.save();

        res.status(201).json({
            message: "Club created and new user added successfully.",
            club: newClub,
            user: newUser,
        });
    } catch (error) {
        console.error("Error creating club:", error);
        res.status(500).json({ message: "Failed to create club.", error: error.message });
    }
});



router.get("/check-user", async (req, res) => {
    const { email } = req.query;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const user = await User.findOne({ email });
        res.status(200).json({ exists: !!user });
    } catch (error) {
        console.error("Error checking user existence:", error);
        res.status(500).json({ message: "Failed to check user existence." });
    }
});



router.post('/add-member', async (req, res) => {
    try {
      const { email, clubId, clubRole } = req.body;
  
      // Validate required fields
      if (!email || !clubId || !clubRole) {
        return res.status(400).json({ message: "Missing required fields." });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Find the club by ID
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found." });
      }
  
      // Check if the user is already a member of the club
      const alreadyMember = user.clubs.some(c => c.clubId.toString() === clubId);
      if (alreadyMember) {
        return res.status(400).json({ message: "User is already in the club." });
      }
  
      // Add the club to the user's club list
      user.clubs.push({ clubId, clubRole });
      await user.save();
  
      // Add the user to the club's member list
      club.members.push({ userId: user._id, clubRole });
  
      // Update the total member count
      club.totalMembers = club.members.length;
      await club.save();
  
      res.status(200).json({ message: "Member added successfully." });
    } catch (err) {
      console.error("Add Member Error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  
  

// ✅ Get all clubs
router.get("/", async (req, res) => {
    try {
        const clubs = await Club.find().sort({ createdAt: -1 });
        res.status(200).json({ clubs });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch clubs", error: error.message });
    }
});

// ✅ Ban/Unban club
router.put("/:action/:clubId", async (req, res) => {
    const { action, clubId } = req.params;

    if (!["ban", "unban"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
    }

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        club.banned = action === "ban";
        await club.save();

        res.status(200).json({ message: `Club ${action}ned successfully` });
    } catch (error) {
        res.status(500).json({ message: "Error banning/unbanning club", error: error.message });
    }
});

// ✅ Delete club
router.delete("/delete/:clubId", async (req, res) => {
    const { clubId } = req.params;

    try {
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        await User.updateMany(
            { "clubs.clubId": club._id },
            { $pull: { clubs: { clubId: club._id } } }
        );

        await Club.findByIdAndDelete(clubId);
        res.status(200).json({ message: "Club and associated data deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete club", error: error.message });
    }
});




// for club admin

// ✅ Get all members of a club

router.get("/:clubId/members", async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId).populate("members.userId", "name email");
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }
        res.status(200).json({ members: club.members });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch members" });
    }
});

router.patch("/:clubId/ban-member/:memberId", async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        const member = club.members.find((m) => m.userId.toString() === req.params.memberId);
        if (!member) {
            return res.status(404).json({ message: "Member not found in this club" });
        }

        // Update the member's status in the club
        member.banned = true;
        member.bannedAt = new Date();
        await club.save();

        // Update the user's club info in the User model
        const user = await User.findById(req.params.memberId);
        if (user) {
            const userClub = user.clubs.find((c) => c.clubId.toString() === req.params.clubId);
            if (userClub) {
                userClub.banned = true;
                userClub.bannedAt = new Date();
                await user.save();
            }
        }

        res.status(200).json({ message: "Member banned successfully" });
    } catch (error) {
        console.error("Error banning member:", error);
        res.status(500).json({ message: "Failed to ban member", error: error.message });
    }
});

router.patch("/:clubId/unban-member/:memberId", async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId);
        if (!club) {
            return res.status(404).json({ message: "Club not found" });
        }

        const member = club.members.find((m) => m.userId.toString() === req.params.memberId);
        if (!member) {
            return res.status(404).json({ message: "Member not found in this club" });
        }

        // Update the member's status in the club
        member.banned = false;
        await club.save();

        // Update the user's club info in the User model
        const user = await User.findById(req.params.memberId);
        if (user) {
            const userClub = user.clubs.find((c) => c.clubId.toString() === req.params.clubId);
            if (userClub) {
                userClub.banned = false;
                userClub.bannedAt = null; // Clear the bannedAt field
                await user.save();
            }
        }

        res.status(200).json({ message: "Member unbanned successfully" });
    } catch (error) {
        console.error("Error unbanning member:", error);
        res.status(500).json({ message: "Failed to unban member", error: error.message });
    }
});


router.delete("/:clubId/delete-member/:memberId", async (req, res) => {
    try {
      const { clubId, memberId } = req.params;
  
      // Find the club by ID
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
  
      // Remove the member from the club's members array
      const initialMemberCount = club.members.length;
      club.members = club.members.filter((m) => m.userId.toString() !== memberId);
  
      // Update the total member count
      if (club.members.length !== initialMemberCount) {
        club.totalMembers = club.members.length;
      }
  
      await club.save();
  
      // Find the user by ID and remove the club from their clubs array
      const user = await User.findById(memberId);
      if (user) {
        user.clubs = user.clubs.filter((c) => c.clubId.toString() !== clubId);
        await user.save();
      }
  
      res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ message: "Failed to delete member", error: error.message });
    }
  });



router.get("/user-clubs", verifyToken, async (req, res) => {
    try {
        const userId = req.userId; // Extracted from the middleware
        const user = await User.findById(userId).populate("clubs.clubId", "clubName");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            clubs: user.clubs.map((club) => ({
                clubId: club.clubId._id,
                clubName: club.clubId.clubName,
                clubRole: club.clubRole,
            })),
        });
    } catch (error) {
        console.error("Error fetching user clubs:", error);
        res.status(500).json({ success: false, message: "Failed to fetch clubs" });
    }
});





router.post("/get-club-names", async (req, res) => {
    const { clubIds } = req.body;
  
    try {
      const clubs = await Club.find({ _id: { $in: clubIds } }).select("_id clubName");
      const clubNames = clubs.reduce((acc, club) => {
        acc[club._id] = club.clubName;
        return acc;
      }, {});
      res.status(200).json(clubNames);
    } catch (error) {
      console.error("Error fetching club names:", error);
      res.status(500).json({ message: "Failed to fetch club names" });
    }
  });


router.post("/leave-club", async (req, res) => {
  const { clubId, userId } = req.body;

  try {
    // Remove the user from the club's members list
    const club = await Club.findByIdAndUpdate(
      clubId,
      { $pull: { members: { userId: userId } }, $inc: { totalMembers: -1 } },
      { new: true }
    );
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Remove the club from the user's clubs array
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { clubs: { clubId: clubId } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all events created by the club where the user is in the eventVolunteerList
    const events = await Event.find({
      createdByClubId: clubId,
      "eventVolunteerList.userId": userId,
    });

    // Remove the user from the eventVolunteerList and decrement the volunteersJoined count
    for (const event of events) {
      await Event.findByIdAndUpdate(event._id, {
        $pull: { eventVolunteerList: { userId: userId } },
        $inc: { volunteersJoined: -1 },
      });
    }

    res.status(200).json({ message: "Successfully left the club and removed from related events" });
  } catch (error) {
    console.error("Error leaving club:", error);
    res.status(500).json({ message: "Failed to leave the club" });
  }
});












export default router;