import { getProfile } from "@/auth/api/profile";
import AuthLayout from "@/layouts/AuthLayout";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  beforeLoad: async ({ context }) => {
    const { data } = await context.queryClient.fetchQuery({
      queryFn: getProfile,
      queryKey: ["auth"],
    });

    if (data.user) throw redirect({
      to: '/'
    })
  },
});
