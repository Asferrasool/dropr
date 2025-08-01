import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  estimatedDelivery?: number;
  createdAt: string;
}

interface ActiveOrdersProps {
  orders: Order[];
}

export default function ActiveOrders({ orders }: ActiveOrdersProps) {
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "preparing":
        return "bg-yellow-accent text-purple-primary";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivering":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressWidth = (status: string) => {
    switch (status) {
      case "confirmed":
        return "20%";
      case "preparing":
        return "40%";
      case "delivering":
        return "80%";
      default:
        return "10%";
    }
  };

  return (
    <section className="p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Active Orders</h2>
        <Button variant="ghost" size="sm" className="text-purple-primary text-sm font-medium">
          View All
        </Button>
      </div>
      
      {activeOrders.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No Active Orders</h3>
            <p className="text-sm text-gray-500">Start ordering with our AI assistant!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeOrders.map((order) => (
            <Card key={order.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-utensils text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-600">
                    {order.estimatedDelivery ? `Estimated: ${order.estimatedDelivery} mins` : "Processing"}
                  </span>
                  <span className="font-semibold text-gray-800">
                    Rs. {parseFloat(order.totalAmount).toFixed(0)}
                  </span>
                </div>
                
                <div className="bg-gray-100 rounded-lg h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-primary to-purple-secondary h-2 rounded-lg transition-all duration-500"
                    style={{ width: getProgressWidth(order.status) }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
