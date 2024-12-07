import { mediaSchema } from "@/schemas/mediaSchema";
import { Currency, PaymentModel, Visibility } from "@/types/upload";
import { z } from "zod";

export interface MediaPayload {
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  description?: string;
  visibility: Visibility;
  scheduledDate?: Date;
  paymentModel: PaymentModel;
  price: number;
  currency: Currency;
}

export type MediaSchema = z.infer<typeof mediaSchema>;
