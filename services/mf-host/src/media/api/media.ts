import { AxiosResponse } from "axios";
import { MediaPayload } from "../../types/media";
import { mediaService } from "../../common/api/mediaService";

export const createMedia = async (values: MediaPayload) => {
  await mediaService.post("/", values);
};

export interface VideoData {
  donationInProgress: boolean;
  title: string;
  description: string;
  userId: string;
  visibility: number;
  videoUrl: string;
  thumbnailUrl: string;
  paymentModel: number;
  price: number;
  currency: string;
  isUploaded: boolean;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  id: string;
}

export const getMediaList = async (): Promise<AxiosResponse<{ medias: VideoData[] }>> => {
  return await mediaService.get("/");
};

export const getMediaItem = async (
  mediaId: string,
): Promise<AxiosResponse<{ media: VideoData }>> => {
  return await mediaService.get(`/${mediaId}`);
};
