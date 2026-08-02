import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BackgroundEffect from "../components/BackgroundEffect";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BackgroundEffect />
      <div className="relative z-10 glass-strong rounded-3xl p-10 sm:p-14 border border-white/10 text-center max-w-md mx-4 animate-scale-in">
        <div className="text-7xl font-bold mb-4 text-gradient">404</div>
        <div className="w-16 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mb-6" />
        <p className="text-lg text-foreground/70 mb-2">Oops! Page not found</p>
        <p className="text-sm text-foreground/50 mb-8">
          The page at <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">{location.pathname}</code> doesn't exist.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 futuristic-button mx-auto"
        >
          <ArrowLeft size={16} />
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
