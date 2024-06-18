import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import React, { Suspense } from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/production").then((res) => ({
    default: res.ReactQueryDevtools,
  })),
);

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <Suspense fallback={null}>
        <TanStackRouterDevtools initialIsOpen={false} position="bottom-right" />
      </Suspense>
      <Suspense fallback={null}>
        <ReactQueryDevtoolsProduction initialIsOpen={false} position="right" />
      </Suspense>
    </>
  ),
});
