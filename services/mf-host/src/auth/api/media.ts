import { MediaPayload } from "../types/media";
import { mediaService } from "./mediaService";

export const createMedia = async (values: MediaPayload) => {
  await mediaService.post("/", values);
};
