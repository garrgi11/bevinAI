import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-neutral-900">404</h1>
        <p className="mt-3 text-neutral-600">We couldn’t find that page.</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-semibold text-white shadow"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
