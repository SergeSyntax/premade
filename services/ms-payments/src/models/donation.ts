import { Currency, DonationStatus, PaymentModels, Visibility } from "@devops-premade/ms-common";
import mongoose from "mongoose";

interface IDonation {
  _id: mongoose.Types.ObjectId; // Explicitly include _id in the TypeScript interface
  userId: string;
  status: DonationStatus;
  price: number;
  currency: Currency;
  version: number;
}

const DonationSchema = new mongoose.Schema<IDonation>(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Make _id explicitly required
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: DonationStatus,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: Currency,
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: "version",
    _id: false,

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
      },
    },
  },
);

const Donation = mongoose.model("Donation", DonationSchema);

export { Donation };
