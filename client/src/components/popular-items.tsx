import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  vendor: string;
  price: string;
  rating: string;
  reviewCount: number;
  imageUrl?: string;
}

interface PopularItemsProps {
  products: Product[];
}

export default function PopularItems({ products }: PopularItemsProps) {
  const { toast } = useToast();
  
  const popularProducts = products.slice(0, 5); // Show first 5 products

  const handleAddToCart = (product: Product) => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    
    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < fullStars 
                ? 'fill-current' 
                : i === fullStars && hasHalfStar 
                ? 'fill-current opacity-50' 
                : 'fill-transparent'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular in Your Area</h2>
      
      <div className="space-y-3">
        {popularProducts.map((product) => (
          <Card key={product.id} className="shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=120&fit=crop"} 
                  alt={product.name}
                  className="w-24 h-20 object-cover"
                />
                <div className="flex-1 p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.vendor}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {renderStars(product.rating)}
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-purple-primary">
                        Rs. {parseFloat(product.price).toFixed(0)}
                      </span>
                      <Button 
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="block bg-yellow-accent text-purple-primary hover:bg-yellow-accent/90 mt-1 active-scale text-xs font-semibold"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
