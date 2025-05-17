const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { USERTYPE, STATUS } = require("../db/enums");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    },
    userType: {
        type: String,
        required: [true, "Please provide userType"],
        enum: {
            values: Object.values(USERTYPE),
            message: "{VALUE} is not a valid userType"
        }
    },
    status: {
        type: String,
        required: [true, "Please provide status"],
        enum: {
            values: Object.values(STATUS),
            message: "{VALUE} is not a valid status"
        }
    },

    // Common info for reviewer and organizer
    bio: {
        type: String
    },
    contactEmail: {
        type: String,
        // required: [true, "please provide your contactEmail"],
        validate: {
            validator: function(v) {
                if (v === null || v === undefined) return true;
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: "Please provide a valid email"
        }
    },

    // Reviewer info
    fullName: {
        type: String,
        // required: [true, "Please provide your fullName"],
    },
    skills: {
        type: [String],
        // required: [true, "skills are required"],
        // validate: {
        //     validator: function (arr) {
        //         if (arr === null || arr === undefined) return true;
        //         return Array.isArray(arr) && arr.length > 0
        //     },
        //     message: "At least one skill is required"
        // }
    },
    linkedlnURL: {
        type: String
    },

    // organizer info
    orgName: {
        type: String,
        // required: [true, "Please provide orgName"]
    },
    phone: {
        type: String,
        // required: [true, "Please provide a phone number"],
        // match: [
        //     /^[0-9]+$/,
        //     "Please provide a valid phone number"
        // ],
        validate: {
            validator: function(v) {
                if (v === null || v === undefined) return true;
                return /^[0-9]+$/.test(v);
            },
            message: "Please provide a valid phone number"
        }
    },
    websiteURL: {
        type: String
    }
});

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.createJWT = function createJWT(status) {
    if (!Object.values(STATUS).includes(status)) {
        throw Error(`${status} is not a valid status, can only be "VERIFIED", "UNVERIFIED"`);
    }
    return jwt.sign({ sub: this._id, typ: this.userType, sat: status }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
}

UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
