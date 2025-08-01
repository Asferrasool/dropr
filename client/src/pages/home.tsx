import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Truck, Bell, User, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChatModal from "../components/ai-chat-modal";
import BottomNavigation from "../components/bottom-navigation";
import CategoryGrid from "../components/category-grid";
import ActiveOrders from "../components/active-orders";
import PopularItems from "../components/popular-items";
import NetworkStatus from "../components/network-status";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Chak 123, Punjab");

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => fetch("/api/orders?userId=demo-user").then(res => res.json()),
  });

  return (
    <>
      {/* Header */}
      <header className="gradient-purple text-white p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
              <img src="/dropr-logo.jpg" alt="Dropr Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold">Dropr</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-accent text-purple-primary text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                3
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 bg-yellow-accent rounded-full text-purple-primary hover:bg-yellow-accent/90">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Location Banner */}
        <div className="mt-3 flex items-center space-x-2 bg-white/20 rounded-lg p-2">
          <MapPin className="text-yellow-accent h-4 w-4" />
          <span className="text-sm">Delivering to: <span className="font-semibold">{selectedLocation}</span></span>
          <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto text-white">
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </header>

      {/* AI Chat Prompt Section */}
      <section className="p-4 bg-gradient-to-br from-yellow-light to-white border-b border-gray-100">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">AI Assistant</h3>
              <p className="text-xs text-gray-500">Order anything with voice or text</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsChatOpen(true)}
            className="w-full gradient-purple text-white py-6 rounded-xl font-medium text-lg shadow-lg active-scale"
          >
            <i className="fas fa-comment-dots mr-2"></i>
            Start Chatting to Order
          </Button>
          
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
            <span><i className="fas fa-language mr-1"></i>English/Urdu</span>
            <span><i className="fas fa-microphone mr-1"></i>Voice Support</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryGrid categories={categories} />

      {/* Active Orders Section */}
      <ActiveOrders orders={orders} />

      {/* Popular Items Section */}
      <PopularItems products={products} />

      {/* AI Chat Modal */}
      <AIChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Network Status */}
      <NetworkStatus />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </>
  );
}
