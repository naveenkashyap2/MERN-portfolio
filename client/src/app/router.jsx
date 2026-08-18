import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PageLoader from '../components/common/PageLoader.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';

const Home = lazy(() => import('../pages/landing/Home.jsx'));
const About = lazy(() => import('../pages/landing/About.jsx'));
const Features = lazy(() => import('../pages/landing/Features.jsx'));
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const Signup = lazy(() => import('../pages/auth/Signup.jsx'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword.jsx'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const MyTrips = lazy(() => import('../pages/trips/MyTrips.jsx'));
const CreateTrip = lazy(() => import('../pages/trips/CreateTrip.jsx'));
const TripDetails = lazy(() => import('../pages/trips/TripDetails.jsx'));
const EditTrip = lazy(() => import('../pages/trips/EditTrip.jsx'));
const ActiveTrip = lazy(() => import('../pages/trips/ActiveTrip.jsx'));
const TripBudget = lazy(() => import('../pages/trips/TripBudget.jsx'));
const Explore = lazy(() => import('../pages/explore/Explore.jsx'));
const Transport = lazy(() => import('../pages/transport/Transport.jsx'));
const RouteDetails = lazy(() => import('../pages/transport/RouteDetails.jsx'));
const Hotels = lazy(() => import('../pages/hotels/Hotels.jsx'));
const Places = lazy(() => import('../pages/places/Places.jsx'));
const Nearby = lazy(() => import('../pages/nearby/Nearby.jsx'));
const AIAssistant = lazy(() => import('../pages/ai/AIAssistant.jsx'));
const Profile = lazy(() => import('../pages/profile/Profile.jsx'));
const Settings = lazy(() => import('../pages/profile/Settings.jsx'));
const Favorites = lazy(() => import('../pages/favorites/Favorites.jsx'));
const NotFound = lazy(() => import('../pages/errors/NotFound.jsx'));

function wrap(el, protect) {
  const inner = <Suspense fallback={<PageLoader />}>{el}</Suspense>;
  return protect ? <ProtectedRoute>{inner}</ProtectedRoute> : inner;
}

const router = createBrowserRouter([
  { path: '/', element: wrap(<Home />) },
  { path: '/about', element: wrap(<About />) },
  { path: '/features', element: wrap(<Features />) },
  { path: '/explore', element: wrap(<Explore />) },
  { path: '/login', element: wrap(<Login />) },
  { path: '/register', element: wrap(<Signup />) },
  { path: '/forgot-password', element: wrap(<ForgotPassword />) },
  { path: '/reset-password', element: wrap(<ResetPassword />) },
  { path: '/plan', element: wrap(<CreateTrip />, true) },
  { path: '/dashboard', element: wrap(<Dashboard />, true) },
  { path: '/trips', element: wrap(<MyTrips />, true) },
  { path: '/trips/:tripId', element: wrap(<TripDetails />, true) },
  { path: '/trips/:tripId/edit', element: wrap(<EditTrip />, true) },
  { path: '/trips/:tripId/live', element: wrap(<ActiveTrip />, true) },
  { path: '/trips/:tripId/budget', element: wrap(<TripBudget />, true) },
  { path: '/transport', element: wrap(<Transport />, true) },
  { path: '/transport/route', element: wrap(<RouteDetails />, true) },
  { path: '/hotels', element: wrap(<Hotels />, true) },
  { path: '/places', element: wrap(<Places />) },
  { path: '/nearby', element: wrap(<Nearby />, true) },
  { path: '/assistant', element: wrap(<AIAssistant />, true) },
  { path: '/favorites', element: wrap(<Favorites />, true) },
  { path: '/profile', element: wrap(<Profile />, true) },
  { path: '/settings', element: wrap(<Settings />, true) },
  { path: '*', element: wrap(<NotFound />) },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
