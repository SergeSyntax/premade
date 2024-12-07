import { Currency, PaymentModels, Visibility } from "@devops-premade/ms-common/src/enums";
import mongoose, { Document } from "mongoose";

export interface MediaDoc extends Document {
  title: string;
  price: number;
  paymentModel: PaymentModels;
  currency: Currency;
  visibility?: Visibility;
  scheduledDate?: Date;
  version: number;
  
  canBuy(): boolean;
}

const mediaSchema = new mongoose.Schema<MediaDoc>(
  {
    title: {
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
    },
    visibility: {
      type: Number,
      enum: Visibility,
    },
    scheduledDate: {
      type: Date,
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

mediaSchema.methods.canBuy = function () {
  const isVisible =
    this.visibility === Visibility.PUBLIC ||
    // scheduled but publicity date is passed
    (this.visibility === Visibility.SCHEDULED && this.scheduledDate.getTime() <= Date.now());

  const isEvaluated = this.paymentModel !== PaymentModels.FREE && this.price > 0;

  return isVisible && isEvaluated;
};

const Media = mongoose.model("Media", mediaSchema);

export { Media };
