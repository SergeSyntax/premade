import Joi from "joi";

import { UploadRequestQuery } from "../types/uploads";
import { text } from "./common";


export const uploadResourceParamsSchema = Joi.object<UploadRequestQuery>({
  fileType: text.required(),
  checksum: text.required(),
});
