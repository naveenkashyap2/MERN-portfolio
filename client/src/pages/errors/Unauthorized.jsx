import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="grid min-h-screen place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Please sign in to continue.</h1>
        <Link to="/login" className="mt-4 inline-block text-accent-cyan">
          Login
        </Link>
      </div>
    </div>
  );
}
