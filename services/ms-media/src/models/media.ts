import mongoose from "mongoose";

import { Currency, PaymentModels, Visibility } from "../types";

interface MediaAttrs {
  title: string;
  description?: string;
  userId: string;
  visibility?: Visibility;
  scheduledDate: Date;
  thumbnailUrl: string;
  paymentModel?: PaymentModels;
  price: number;
  currency?: Currency;
  isUploaded: boolean;
}

const MediaSchema = new mongoose.Schema<MediaAttrs>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    visibility: {
      type: Number,
      enum: Visibility,
      default: Visibility.PUBLIC,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    paymentModel: {
      type: Number,
      enum: PaymentModels,
      default: PaymentModels.FREE,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: Number,
      enum: Currency,
      default: Currency.USD,
    },
    isUploaded: {
      type: Boolean,
      default: false,
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
      },
    },
  },
);

const Media = mongoose.model("Media", MediaSchema);

export { Media };
