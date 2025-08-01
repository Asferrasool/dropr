import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className={`fixed top-20 right-4 px-3 py-1 rounded-full text-xs font-medium z-40 ${
      isOnline 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="inline h-3 w-3 mr-1" />
          Connected
        </>
      ) : (
        <>
          <WifiOff className="inline h-3 w-3 mr-1" />
          Offline
        </>
      )}
    </div>
  );
}
