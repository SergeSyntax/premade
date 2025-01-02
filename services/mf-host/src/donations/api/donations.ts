// import { AxiosResponse } from "axios";
import { donationService } from "@/common/api/donationService";
import { DonationResponse } from "@/types";
import { AxiosResponse } from "axios";

export const getDonation = async (
  orderId: string,
): Promise<AxiosResponse<{ donation: DonationResponse }>> => {
  return donationService.get(`/${orderId}`);
};

export const getDonationList = async (): Promise<
  AxiosResponse<{ donations: DonationResponse[] }>
> => {
  return donationService.get(`/`);
};
