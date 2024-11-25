import { DateTime } from "luxon";

export enum Currency {
  USD,
  EUR,
  ILS,
}

export enum Visibility {
  PUBLIC,
  UNLISTED,
  SCHEDULED,
}

export enum PaymentModel {
  FREE,
  RENT,
  PURCHASE,
}

export interface MediaUploadValues {
  video: File;
  title: string;
  description: string;
  thumbnail: File;
  paymentModel: PaymentModel;
  price: number;
  currency: Currency;
  visibility: Visibility;
  scheduledDate?: DateTime;
}
