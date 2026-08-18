import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import AuthLayout from '../components/layout/AuthLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PageLoader from '../components/common/PageLoader';

const lazyPage = (importFn) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
};

const Home = lazy(() => import('../pages/Home'));
const Explore = lazy(() => import('../pages/Explore'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const PlanTrip = lazy(() => import('../pages/PlanTrip'));
const Trips = lazy(() => import('../pages/Trips'));
const TripDetails = lazy(() => import('../pages/TripDetails'));
const LiveTrip = lazy(() => import('../pages/LiveTrip'));
const Budget = lazy(() => import('../pages/Budget'));
const Transport = lazy(() => import('../pages/Transport'));
const Hotels = lazy(() => import('../pages/Hotels'));
const Nearby = lazy(() => import('../pages/Nearby'));
const Assistant = lazy(() => import('../pages/Assistant'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: lazyPage(Home) },
      { path: '/explore', element: lazyPage(Explore) },
      { path: '*', element: lazyPage(NotFound) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: lazyPage(Login) },
      { path: '/register', element: lazyPage(Register) },
      { path: '/forgot-password', element: lazyPage(ForgotPassword) },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: lazyPage(Dashboard) },
      { path: '/plan', element: lazyPage(PlanTrip) },
      { path: '/trips', element: lazyPage(Trips) },
      { path: '/trips/:tripId', element: lazyPage(TripDetails) },
      { path: '/trips/:tripId/budget', element: lazyPage(Budget) },
      { path: '/transport', element: lazyPage(Transport) },
      { path: '/hotels', element: lazyPage(Hotels) },
      { path: '/nearby', element: lazyPage(Nearby) },
      { path: '/assistant', element: lazyPage(Assistant) },
      { path: '/favorites', element: lazyPage(Favorites) },
      { path: '/profile', element: lazyPage(Profile) },
      { path: '/settings', element: lazyPage(Settings) },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <LiveTrip />
        </Suspense>
      </ProtectedRoute>
    ),
    path: '/trips/:tripId/live',
  },
]);
