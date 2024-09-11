import { OrderStatus } from "@devops-premade/ms-common";
import mongoose, { Document } from "mongoose";

import { MediaDoc } from "./media";

// the attributes a saved document have
// the attributes required to create a document
interface OrderDoc extends Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  media: MediaDoc;
  version: number;
}

const orderSchema = new mongoose.Schema<OrderDoc>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
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

export const Order = mongoose.model<OrderDoc>("order", orderSchema);
