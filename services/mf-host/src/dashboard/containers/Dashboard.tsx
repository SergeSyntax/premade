import { useProfile } from "../hooks/profile";

export const Dashboard = () => {
  const { data } = useProfile();
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <pre>{JSON.stringify(data?.data)}</pre>
    </div>
  );
};
