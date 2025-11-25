import React, { useEffect, useSyncExternalStore } from 'react';
import { Route, Switch, Router } from "wouter";
import Home from './pages/Home';
import RouteDetail from './pages/RouteDetail';
import AttractionDetail from './pages/AttractionDetail';
import Admin from './pages/Admin';
import AgentFloatButton from './components/AgentFloatButton';
import { ragService } from './services/ragService';

// Use useSyncExternalStore for stable hash-based routing in React 18/19
// This prevents flickering by ensuring the location state is synchronous with the external source (window.location.hash)
const subscribe = (callback: () => void) => {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
};

const getSnapshot = () => {
  return window.location.hash.replace(/^#/, "") || "/";
};

const useHashLocation = (): [string, (to: string) => void] => {
  const loc = useSyncExternalStore(subscribe, getSnapshot);
  const navigate = React.useCallback((to: string) => { window.location.hash = to }, []);
  return [loc, navigate];
};

export default function App() {

  useEffect(() => {
    // Initialize the RAG service when the app loads
    ragService.init();
  }, []);

  return (
    <div className="font-sans antialiased text-gray-800">
      <main className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl">
        <Router hook={useHashLocation}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/route/:id" component={RouteDetail} />
            <Route path="/attraction/:id" component={AttractionDetail} />
            <Route path="/admin" component={Admin} />
            <Route>404 Not Found</Route>
          </Switch>
        </Router>
      </main>
      <AgentFloatButton />
    </div>
  );
}