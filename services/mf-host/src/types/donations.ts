export interface DonationPayload {
  mediaId: string;
}

export interface DonationResponse {
  userId: string;
  status: string;
  expiresAt: string;
  media: {
    title: string;
    paymentModel: number;
    price: number;
    currency: string;
    visibility: number;
    createdAt: string;
    updatedAt: string;
    version: number;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
  id: string;
}
