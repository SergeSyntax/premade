import mongoose from "mongoose";

interface MediaAttrs {
  title: string;
  description?: string;
  userId: string;
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
      required: true
    }
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
