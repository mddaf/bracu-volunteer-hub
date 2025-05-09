import { Schema, model } from "mongoose";

const clubSchema = new Schema(
  {
    clubName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: null, // Club description
    },
    logo: {
      type: String, // URL for the club logo
      default: null,
    },
    banner: {
      type: String, // URL for the club banner
      default: null,
    },
    totalDepartments: {
      type: Number,
      default: 0, // Total number of departments in the club
    },
    departments: [
      {
        name: {
          type: String,
          required: true, // Department name
        },
        description: {
          type: String, // Department description
        },
      },
    ],
    panelMembers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User", // Refers to the User model
          required: true,
        },
        role: {
          type: String,
          enum: ["President", "Vice President", "Secretary", "Treasurer"],
          required: true,
        },
        picture: {
          type: String, // URL for the panel member's picture
          default: null,
        },
      },
    ],
    banned: {
      type: Boolean,
      default: false, // Indicates if the club is banned
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User", // Refers to the User model
          required: true,
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Club = model("Club", clubSchema);

export default Club;