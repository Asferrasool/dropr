import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BottomNavigation from "../components/bottom-navigation";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", searchQuery],
    queryFn: () => {
      if (!searchQuery.trim()) return [];
      return fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`).then(res => res.json());
    },
    enabled: searchQuery.trim().length > 0,
  });

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
          <h1 className="text-xl font-bold">Search</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        {/* Search Input */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search for food, medicine, groceries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-primary"
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() === "" ? (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Search Products</h3>
            <p className="text-gray-500">Find food, medicines, and groceries available in your area</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="w-20 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-500">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product: any) => (
              <Card key={product.id} className="shadow-sm">
                <CardContent className="p-0">
                  <div className="flex">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=120&fit=crop"} 
                      alt={product.name}
                      className="w-24 h-20 object-cover rounded-l-lg"
                    />
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.vendor}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-yellow-500">
                              {"★".repeat(Math.floor(parseFloat(product.rating || "0")))}
                              {"☆".repeat(5 - Math.floor(parseFloat(product.rating || "0")))}
                            </span>
                            <span className="text-xs text-gray-500">({product.reviewCount})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-purple-primary">Rs. {parseFloat(product.price).toFixed(0)}</span>
                          <Button 
                            size="sm"
                            className="block bg-yellow-accent text-purple-primary hover:bg-yellow-accent/90 mt-1 active-scale"
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
        )}
      </div>

      <BottomNavigation />
    </>
  );
}
