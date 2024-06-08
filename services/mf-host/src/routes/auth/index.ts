import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/auth/")({
  component: React.lazy(() => import("@/layouts/AuthLayout")),
});
