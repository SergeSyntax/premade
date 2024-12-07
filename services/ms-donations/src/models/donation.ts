import { DonationStatus } from "@devops-premade/ms-common";
import mongoose, { Document } from "mongoose";

import { MediaDoc } from "./media";

// the attributes a saved document have
// the attributes required to create a document
interface DonationDoc extends Document {
  userId: string;
  status: DonationStatus;
  expiresAt: Date;
  media: MediaDoc;
  version: number;
}

const DonationSchema = new mongoose.Schema<DonationDoc>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(DonationStatus),
      default: DonationStatus.CREATED,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    media: {
      type: mongoose.Schema.ObjectId,
      ref: "Media",
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    versionKey: "version",
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

export const Donation = mongoose.model<DonationDoc>("Donation", DonationSchema);
