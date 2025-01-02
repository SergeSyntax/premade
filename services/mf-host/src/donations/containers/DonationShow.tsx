import { Box } from "@mui/material";
import { useGetDonation } from "../hooks/useGetDonation";
import { Route } from "@/routes/_dashboard/donations/$donationId";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useProfile } from "@/dashboard/hooks/profile";
import { useCreatePayment } from "../hooks/useCreatePayment";

const DonationShow: React.FC = () => {
  const { donationId } = Route.useParams();
  const { data, isLoading } = useGetDonation(donationId);
  const donation = data?.data.donation;

  const { data: profile } = useProfile();
  const { mutate } = useCreatePayment(donationId);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = +new Date(donation?.expiresAt ?? Date.now()) - Date.now();
      const secondsLeft = ~~(msLeft / 1000);
      setTimeLeft(secondsLeft.toString());
    };

    findTimeLeft();
    const intervalId = setInterval(findTimeLeft, 1000);
    return () => clearInterval(intervalId);
  }, [donation?.expiresAt]);


  if (isLoading) return 'loading...'
  
  return (
    <div>
      <Box>{JSON.stringify(data?.data.donation)}</Box>
      <Box>
        {+timeLeft > 0 ? `${timeLeft} seconds until this transaction expired` : "Donation Expired"}
      </Box>
      <Box>
        {/* {} */}
        <StripeCheckout
          stripeKey={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
          token={({ id: token }) => mutate(token)}
          amount={+donation!.media.price * 100}
          currency={donation?.media.currency}
          email={profile?.data.user?.email}
        />
      </Box>
    </div>
  );
};

export default DonationShow;
