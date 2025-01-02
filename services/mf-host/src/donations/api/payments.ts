// import { AxiosResponse } from "axios";
import { paymentsService } from "@/common/api/paymentsService";
import { DonationResponse } from "@/types";
import { AxiosResponse } from "axios";

export const createPayment = async (
  donationId: string,
  token: string,
): Promise<AxiosResponse<{ donation: DonationResponse }>> => {
  return paymentsService.post(`/`, {
    donationId,
    token,
  });
};
