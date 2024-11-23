import { Currency, PaymentModel, Visibility } from "@/types/upload";

export interface MediaPayload {
  videoUrl: string;
  title: string;
  description?: string;
  visibility: Visibility;
  scheduledDate?: Date;
  thumbnailUrl: string;
  paymentModel: PaymentModel;
  price: number;
  currency: Currency;
}
