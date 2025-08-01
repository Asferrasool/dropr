import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X, Send, Mic, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  message: string;
  isFromUser: boolean;
  createdAt: string;
}

export default function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [message, setMessage] = useState("");
  const [userId] = useState("demo-user"); // In real app, get from auth
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: chatHistory = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", userId],
    enabled: isOpen,
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        userId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", userId] });
      
      // If AI suggests creating an order, show toast
      if (data.intent === "order" && data.items?.length > 0) {
        toast({
          title: "Order Ready!",
          description: "I can create this order for you. Shall I proceed?",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    chatMutation.mutate(message);
    setMessage("");
  };

  const handleQuickReply = (text: string) => {
    chatMutation.mutate(text);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <Card className="w-full max-w-sm mx-auto rounded-t-3xl rounded-b-none max-h-[80vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 gradient-purple text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-accent rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-purple-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-green-200">● Online</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 && (
              <>
                {/* Welcome Message */}
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                    <p className="text-sm text-gray-800">
                      Assalam-o-Alaikum! I'm here to help you order food, medicines, or groceries. What would you like today?
                    </p>
                  </div>
                </div>
                
                {/* Quick Reply Options */}
                <div className="flex flex-wrap gap-2 ml-10">
                  <Button
                    size="sm"
                    onClick={() => handleQuickReply("I want to order food")}
                    className="bg-yellow-accent text-purple-primary hover:bg-yellow-accent/90 text-xs rounded-full"
                  >
                    🍽️ Order Food
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleQuickReply("I need medicine")}
                    className="bg-yellow-accent text-purple-primary hover:bg-yellow-accent/90 text-xs rounded-full"
                  >
                    💊 Get Medicine
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleQuickReply("I want to buy groceries")}
                    className="bg-yellow-accent text-purple-primary hover:bg-yellow-accent/90 text-xs rounded-full"
                  >
                    🛒 Buy Groceries
                  </Button>
                </div>
              </>
            )}

            {chatHistory.map((msg: ChatMessage) => (
              <div key={msg.id} className={`flex items-start space-x-2 ${msg.isFromUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!msg.isFromUser && (
                  <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`rounded-2xl p-3 max-w-[80%] ${
                  msg.isFromUser 
                    ? 'bg-purple-primary text-white rounded-tr-md' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-md'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-md p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Button 
                size="sm"
                className="w-10 h-10 gradient-purple rounded-full flex-shrink-0"
              >
                <Mic className="h-4 w-4 text-white" />
              </Button>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Type your message in English or Urdu..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="rounded-2xl border-gray-200"
                />
              </div>
              <Button 
                size="sm"
                onClick={handleSendMessage}
                disabled={!message.trim() || chatMutation.isPending}
                className="w-10 h-10 gradient-purple rounded-full flex-shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Voice commands supported in both languages
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
