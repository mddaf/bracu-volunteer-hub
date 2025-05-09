import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import clubRoutes from "./routes/club.routes.js";
import roleRoutes from "./routes/roles.route.js";
import eventRoutes from "./routes/event.route.js";
import userManageRoutes from "./routes/userManage.route.js";
import joinClubRoutes from "./routes/joinClub.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.resolve("uploads")));


app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user-manage", userManageRoutes);
app.use("/api/join-club", joinClubRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});
