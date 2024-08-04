import mongoose from "mongoose";

import { Password } from "../utils";

interface UserAttrs {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  allowExtraEmails?: boolean;
}

const userSchema = new mongoose.Schema<UserAttrs>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    allowExtraEmails: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    toObject: {
      transform(_doc, ret, _options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;

        delete ret.password;
      },
    },
  },
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password"))
    this.set("password", await Password.toHash(this.get("password")));

  done();
});

const User = mongoose.model("User", userSchema);

export { User };
