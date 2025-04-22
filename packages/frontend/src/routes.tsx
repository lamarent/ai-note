import { RouteObject } from "react-router-dom";
import React from "react";
import LoadingFallback from "./components/common/LoadingFallback";

// Lazy load pages for better performance
const HomePage = React.lazy(() => import("./pages/home/HomePage"));
const SessionsListPage = React.lazy(
  () => import("./pages/sessions/SessionsListPage")
);
const SessionDetailPage = React.lazy(
  () => import("./pages/sessions/SessionDetailPage")
);
const SettingsPage = React.lazy(() => import("./pages/settings/SettingsPage"));
const NewSessionPage = React.lazy(
  () => import("./pages/sessions/NewSessionPage")
);

// Fallback component while loading lazy-loaded pages
// const LoadingFallback = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//   </div>
// );

// Define routes
const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </React.Suspense>
    ),
  },
  {
    path: "/sessions",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <SessionsListPage />
      </React.Suspense>
    ),
  },
  {
    path: "/sessions/new",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <NewSessionPage />
      </React.Suspense>
    ),
  },
  {
    path: "/sessions/:sessionId",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <SessionDetailPage />
      </React.Suspense>
    ),
  },
  {
    path: "/settings",
    element: (
      <React.Suspense fallback={<LoadingFallback />}>
        <SettingsPage />
      </React.Suspense>
    ),
  },
];

export default routes;
