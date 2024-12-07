import { Currency, PaymentModel, Visibility } from "@/types/upload";
import { DateTime } from "luxon";
import { z } from "zod";

const dateTimeSchema = z.custom<DateTime | null>(
  (val) => !val || DateTime.isDateTime(val),
  "Invalid DateTime object",
);

export const mediaSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255, "Title cannot exceed 255 characters"),
    description: z.string().optional(),
    video: z.instanceof(File, { message: "A valid video file is required" }),
    thumbnail: z.instanceof(File),
    // z.union([
    //   z.instanceof(File),
    //   // z.null()
    // ]),
    visibility: z.nativeEnum(Visibility, { message: "Invalid visibility option" }),
    paymentModel: z.nativeEnum(PaymentModel, { message: "Invalid payment model option" }),
    scheduledDate: dateTimeSchema.optional(),
    currency: z.nativeEnum(Currency, { message: "Invalid currency option" }),
    price: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const isNotFree = value.paymentModel !== PaymentModel.FREE;
    const isPriceValue = Number((value?.price ?? "").replace(/,/g, "")) === 0;

    if (isNotFree && isPriceValue) {
      ctx.addIssue({
        path: ["price"],
        message: "Price is required when the payment model is not free.",
        code: z.ZodIssueCode.custom,
      });
    }

    if (value.visibility === Visibility.SCHEDULED) {
      if (!DateTime.isDateTime(value.scheduledDate))
        ctx.addIssue({
          path: ["scheduledDate"],
          message: "Scheduled date is required when visibility is not public.",
          code: z.ZodIssueCode.custom,
        });
    }
  });
