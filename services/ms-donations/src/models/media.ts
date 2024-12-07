import { Currency, PaymentModels, Visibility } from "@devops-premade/ms-common/src/enums";
import mongoose, { Document, Model } from "mongoose";

interface Event {
  id: string;
  version: number;
}
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

interface MediaModel extends Model<MediaDoc> {
  /**
   * Retrieves a Media document based on the event ID and its prior version.
   *
   * This method ensures synchronization between the donation service and
   * the services managing the primary media table by checking for the
   * document state before updates.
   *
   * @param {Event} event - The event object containing the ID and current version.
   * @returns {Promise<MediaDoc | null>} - The Media document if found, or null.
   *
   * @example
   * const event = { id: "123", version: 3 };
   * const media = await Media.findByEvent(event);
   * if (media) {
   *   console.log(`Found Media: ${media.title}`);
   * } else {
   *   console.log("No Media found.");
   * }
   */
  findByEvent(event: Event): Promise<MediaDoc | null>;
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

mediaSchema.statics.findByEvent = async function (event: Event) {
  return Media.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Media = mongoose.model<MediaDoc, MediaModel>("Media", mediaSchema);

export { Media };
