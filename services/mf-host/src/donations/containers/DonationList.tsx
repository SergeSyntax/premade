import { useGetDonationList } from "../hooks/useGetDonationList";

const DonationList: React.FC = () => {
  const { data } = useGetDonationList();

  return (
    <ul>
      {data?.data.donations.map((donation) => (
        <li key={donation.id}>
          {donation.media.title} - {donation.status}
        </li>
      ))}
    </ul>
  );
};

export default DonationList;
