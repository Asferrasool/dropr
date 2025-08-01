import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "../components/bottom-navigation";

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: () => fetch("/api/orders?userId=demo-user").then(res => res.json()),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "preparing":
      case "confirmed":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "preparing":
        return "bg-yellow-accent text-purple-primary";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* Header */}
      <header className="gradient-purple text-white p-4 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-gray-500 mb-4">Start ordering with our AI assistant!</p>
            <Link href="/">
              <Button className="gradient-purple text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card key={order.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Order #{order.id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {order.estimatedDelivery ? `Est: ${order.estimatedDelivery} mins` : "Processing"}
                    </span>
                    <span className="font-semibold text-gray-800">
                      Rs. {parseFloat(order.totalAmount).toFixed(0)}
                    </span>
                  </div>
                  
                  {order.status === "preparing" && (
                    <div className="mt-3 bg-gray-100 rounded-lg h-2">
                      <div className="bg-gradient-to-r from-purple-primary to-purple-secondary h-2 rounded-lg" style={{ width: "40%" }}></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </>
  );
}
