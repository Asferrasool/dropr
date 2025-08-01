import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processAIMessage, generateOrderSummary } from "./services/openai";
import { insertChatMessageSchema, insertOrderSchema, insertOrderItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const { userId } = req.query;
      
      let orders;
      if (userId) {
        orders = await storage.getOrdersByUser(userId as string);
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(req.params.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const { items, ...orderInfo } = req.body;
      
      // Create order
      const order = await storage.createOrder(orderInfo);
      
      // Create order items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const orderItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id
          });
          await storage.createOrderItem(orderItemData);
        }
      }
      
      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Valid status is required" });
      }
      
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // AI Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ message: "Message and userId are required" });
      }

      // Save user message
      await storage.createChatMessage({
        userId,
        message,
        isFromUser: true
      });

      // Process with AI
      const aiResponse = await processAIMessage(message, userId);

      // Save AI response
      await storage.createChatMessage({
        userId,
        message: aiResponse.message,
        isFromUser: false
      });

      res.json(aiResponse);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Order creation from AI chat
  app.post("/api/ai/create-order", async (req, res) => {
    try {
      const { userId, items, deliveryAddress } = req.body;
      
      if (!userId || !items || !Array.isArray(items) || !deliveryAddress) {
        return res.status(400).json({ message: "userId, items array, and deliveryAddress are required" });
      }

      // Calculate total amount (simplified)
      const totalAmount = items.reduce((sum: number, item: any) => {
        return sum + (parseFloat(item.price || "0") * (item.quantity || 1));
      }, 0);

      // Create order
      const order = await storage.createOrder({
        userId,
        totalAmount: totalAmount.toString(),
        deliveryAddress,
        status: "pending",
        estimatedDelivery: 30 // Default 30 minutes
      });

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId || "unknown",
          quantity: item.quantity || 1,
          price: item.price || "0"
        });
      }

      // Generate AI summary
      const summary = await generateOrderSummary(items);

      res.json({ order, summary });
    } catch (error) {
      console.error("AI order creation error:", error);
      res.status(500).json({ message: "Failed to create order from AI chat" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
