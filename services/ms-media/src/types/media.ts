import { Currency, PaymentModels, Visibility } from "@devops-premade/ms-common/src/enums";

export interface MediaReqBody {
  title: string;
  description?: string;
  visibility: Visibility;
  scheduledDate: Date;
  thumbnailUrl: string;
  paymentModel: PaymentModels;
  price: number;
  currency: Currency;
  isUploaded: boolean;
}

export interface MediaResourceReqQuery {
  mediaId: string;
}
