import mongoose, { Document } from "mongoose";

export interface MediaDoc extends Document {
  title: string;
  price: number;
  version: number;
}

const mediaSchema = new mongoose.Schema<MediaDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
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

const Media = mongoose.model("Media", mediaSchema);

export { Media };
