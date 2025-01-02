import { z } from "zod";
import { Currency, PaymentModel, Visibility } from "./uploads";
import { mediaSchema } from "@/schemas/mediaSchema";

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
