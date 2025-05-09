import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user", // Default role is "user"
        },
        bannedAccount: {
            type: Boolean,
            default: false, // Indicates if the account is banned
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: true, // Set to true by default for testing purposes
        },
        resetPasswordToken: String,
        resetPasswordExpiresAt: Date,
        verificationToken: String,
        verificationTokenExpiresAt: Date,

        // Reference to clubs the user is associated with
        clubs: {
            type: [
                {
                    clubId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Club", // Refers to the Club model
                    },
                    clubRole: {
                        type: String,
                        enum: ["member", "clubadmin", "moderator"],
                        default: "member",
                    },
                    joinedAt: {
                        type: Date,
                        default: Date.now, // Tracks when the user joined the club
                    },
                    banned: {
                        type: Boolean,
                        default: false, // Indicates if the member is banned
                    },
                    bannedAt: {
                        type: Date,
                        default: null, // Tracks when the user was banned
                    },
                },
            ],
            default: [], // Initially, the user is not connected to any club
        },

        // Count of events the user is banned from
        eventBannedCount: {
            type: Number,
            default: 0, // Default is 0 since the user is not banned from any events initially
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
