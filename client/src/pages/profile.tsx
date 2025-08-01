import { ArrowLeft, User, MapPin, Phone, Settings, HelpCircle, LogOut } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "../components/bottom-navigation";

export default function Profile() {
  const user = {
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
    location: "Chak 123, Punjab, Pakistan"
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
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </header>

      <div className="p-4 pb-20">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 gradient-purple rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{user.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <div className="space-y-4">
          {/* Account Settings */}
          <Card>
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-4 h-auto rounded-lg"
              >
                <Settings className="h-5 w-5 mr-3 text-purple-primary" />
                <div className="text-left">
                  <div className="font-medium">Account Settings</div>
                  <div className="text-sm text-gray-500">Manage your account details</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Addresses */}
          <Card>
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-4 h-auto rounded-lg"
              >
                <MapPin className="h-5 w-5 mr-3 text-purple-primary" />
                <div className="text-left">
                  <div className="font-medium">Delivery Addresses</div>
                  <div className="text-sm text-gray-500">Manage your delivery locations</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Help & Support */}
          <Card>
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-4 h-auto rounded-lg"
              >
                <HelpCircle className="h-5 w-5 mr-3 text-purple-primary" />
                <div className="text-left">
                  <div className="font-medium">Help & Support</div>
                  <div className="text-sm text-gray-500">Get help with your orders</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Separator />

          {/* Logout */}
          <Card>
            <CardContent className="p-0">
              <Button 
                variant="ghost" 
                className="w-full justify-start p-4 h-auto rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Logout</div>
                  <div className="text-sm text-gray-500">Sign out of your account</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">DeliverPak v1.0.0</p>
          <p className="text-xs mt-1">Serving rural Pakistan with ❤️</p>
        </div>
      </div>

      <BottomNavigation />
    </>
  );
}
