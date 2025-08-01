import { useState } from "react";
import { X, MapPin, Navigation, Home, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SavedAddress {
  id: number;
  label: string;
  address: string;
  icon: "home" | "office" | "location";
  lastUsed?: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  onLocationSelect: (address: string) => void;
}

export default function LocationModal({ isOpen, onClose, selectedLocation, onLocationSelect }: LocationModalProps) {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy saved addresses data
  const savedAddresses: SavedAddress[] = [
    {
      id: 1,
      label: "Home",
      address: "House 123, Street 45, Chak 123, Punjab",
      icon: "home",
      lastUsed: "2 hours ago"
    },
    {
      id: 2,
      label: "Office",
      address: "Block B, IT Tower, Lahore, Punjab",
      icon: "office",
      lastUsed: "Yesterday"
    },
    {
      id: 3,
      label: "Mom's House",
      address: "Village Center, Chak 567, Punjab",
      icon: "home",
      lastUsed: "3 days ago"
    },
    {
      id: 4,
      label: "Market Plaza",
      address: "Main Bazaar, Commercial Area, Punjab",
      icon: "location",
      lastUsed: "1 week ago"
    }
  ];

  const handleCurrentLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          const mockAddress = `Current Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`;
          onLocationSelect(mockAddress);
          setIsDetectingLocation(false);
          onClose();
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsDetectingLocation(false);
          // Fallback to mock current location
          onLocationSelect("Current Location - Chak 789, Punjab");
          onClose();
        }
      );
    } else {
      // Fallback for browsers without geolocation
      onLocationSelect("Current Location - Chak 789, Punjab");
      setIsDetectingLocation(false);
      onClose();
    }
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "home":
        return <Home className="h-5 w-5 text-purple-primary" />;
      case "office":
        return <Building className="h-5 w-5 text-purple-primary" />;
      case "location":
        return <MapPin className="h-5 w-5 text-purple-primary" />;
      default:
        return <MapPin className="h-5 w-5 text-purple-primary" />;
    }
  };

  const filteredAddresses = savedAddresses.filter(address =>
    address.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="gradient-purple text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Delivery Location</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search addresses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Current Location Button */}
        <div className="p-4 border-b">
          <Button
            onClick={handleCurrentLocation}
            disabled={isDetectingLocation}
            className="w-full gradient-purple text-white py-3 rounded-lg font-medium"
          >
            <Navigation className="h-5 w-5 mr-2" />
            {isDetectingLocation ? "Detecting Location..." : "Use Current Location"}
          </Button>
        </div>

        {/* Saved Addresses */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Addresses</h3>
          
          {filteredAddresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No addresses found</p>
            </div>
          ) : (
            filteredAddresses.map((address) => (
              <Card 
                key={address.id} 
                className={`cursor-pointer transition-colors hover:bg-purple-50 border ${
                  selectedLocation === address.address ? 'border-purple-primary bg-purple-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  onLocationSelect(address.address);
                  onClose();
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(address.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {address.label}
                        </h3>
                        {address.lastUsed && (
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {address.lastUsed}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        {address.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <Button
            variant="outline"
            className="w-full text-sm"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}