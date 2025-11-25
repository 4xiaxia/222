
import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';

export default function RouteDetail() {
  // FIX: Explicitly type the route params to ensure `params` is correctly inferred as `{ id: string } | null`.
  // This prevents TypeScript from inferring `never` after the null check.
  const [, params] = useRoute<{ id: string }>("/route/:id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data for route details
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer); // Cleanup
    // FIX: The optional chaining in `params?.id` was causing a spurious error.
    // Depending on the `params` object directly is safer and achieves the same goal
    // of re-running the effect when the route changes.
  }, [params]);

  if (isLoading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // FIX: `params` from `useRoute` can be null if the route doesn't match.
  // Adding a guard clause to handle this case and satisfy TypeScript's
  // strict null checks.
  if (!params) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Route Not Found</h1>
      </div>
    );
  }
  const routeId = params.id;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Route Detail Page</h1>
      <p>Details for route: {routeId}</p>
    </div>
  );
}