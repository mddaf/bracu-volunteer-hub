import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
        },
        eventName: {
            type: String,
            required: true,
        },
        picture: {
            type: String, // URL or file path for the event picture
            required: false,
        },
        details: {
            type: String,
            required: true,
        },
        openTo: {
            type: String,
            enum: ["all", "clubMembersOnly"], // Options: "all" or "clubMembersOnly"
            default: "all",
        },
        volunteerLimit: {
            type: mongoose.Schema.Types.Mixed, // Allows both Number and String
            default: function () {
                return this.volunteerLimitType === "number" ? 1 : "No limit";
            },
        },
        volunteersJoined: {
            type: Number,
            default: 0, // Tracks the number of volunteers who joined
        },
        eventVolunteerList: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true, // Ensure userId is always present
                },
                joinedAt: {
                    type: Date,
                    default: Date.now, // Tracks when the volunteer joined
                },
                banned: {
                    type: Boolean,
                    default: false, // Indicates if the volunteer is banned
                },
                bannedAt: {
                    type: Date,
                    default: null, // Tracks when the volunteer was banned
                },
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "createdByType", // Dynamically references either "User" or "Club"
        },
        createdByType: {
            type: String,
            required: true,
            enum: ["admin", "clubadmin", "moderator"], // Specifies whether the creator is an admin (User) or a club (Club)
        },
        createdByClubId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Club", // Refers to the Club model
            required: false, // Optional field
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;