import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createJoinRequest,
  getAllClubs,
  getJoinRequests,
  handleJoinRequest,
} from "../controllers/joinClub.controller.js";

const router = express.Router();

// Fetch all clubs
router.get("/clubs", verifyToken, getAllClubs);

// Create a join request
router.post("/:clubId/join", verifyToken, createJoinRequest);

// Fetch all join requests for a specific club
router.get("/:clubId/requests", verifyToken, getJoinRequests);

// Accept or deny a join request
router.post("/requests/:requestId", verifyToken, handleJoinRequest);

export default router;