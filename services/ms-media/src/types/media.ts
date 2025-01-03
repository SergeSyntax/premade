import { Currency, PaymentModels, Visibility } from "@media-premade/ms-common/lib/enums";

export interface MediaReqBody {
  title: string;
  description?: string;
  visibility: Visibility;
  scheduledDate: Date;
  thumbnailUrl: string;
  videoUrl: string;
  paymentModel: PaymentModels;
  price: number;
  currency: Currency;
  isUploaded: boolean;
}

export interface MediaResourceReqQuery {
  mediaId: string;
}
