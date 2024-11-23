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

export enum PaymentModels {
  FREE,
  RENT,
  PURCHASE,
}

export interface MediaReqBody {
  title: string;
  description?: string;
  visibility: Visibility;
  scheduledDate: string;
  thumbnailUrl: string;
  paymentModel: PaymentModels;
  price: number;
  currency: Currency;
  isUploaded: boolean;
}

export interface MediaResourceReqQuery {
  mediaId: string;
}
