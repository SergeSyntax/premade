// import { AxiosResponse } from "axios";
import { DonationPayload, DonationResponse } from "@/types";
import { donationService } from "../../common/api/donationService";
import { AxiosResponse } from "axios";

export const createDonation = async (
  values: DonationPayload,
): Promise<AxiosResponse<{ donation: DonationResponse }>> => {
  return donationService.post("/", values);
};
