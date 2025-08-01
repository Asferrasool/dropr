import { type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct, type Order, type InsertOrder, type OrderItem, type InsertOrderItem, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Chat Messages
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.chatMessages = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categories: InsertCategory[] = [
      { name: "Food", icon: "fas fa-utensils", color: "from-orange-400 to-red-500" },
      { name: "Medicine", icon: "fas fa-pills", color: "from-green-400 to-emerald-500" },
      { name: "Groceries", icon: "fas fa-shopping-basket", color: "from-blue-400 to-indigo-500" },
    ];

    categories.forEach(cat => this.createCategory(cat));

    // Initialize products
    const products: InsertProduct[] = [
      {
        name: "Chicken Biryani",
        description: "Delicious aromatic chicken biryani with basmati rice",
        price: "380",
        categoryId: Array.from(this.categories.values())[0].id,
        vendor: "Desi Palace",
        rating: "4.2",
        reviewCount: 127,
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=200&h=120&fit=crop"
      },
      {
        name: "Fresh Vegetables",
        description: "Farm fresh seasonal vegetables bundle",
        price: "250",
        categoryId: Array.from(this.categories.values())[2].id,
        vendor: "Local Mart",
        rating: "4.5",
        reviewCount: 89,
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=120&fit=crop"
      },
      {
        name: "Panadol Tablets",
        description: "Pain relief tablets - 10 tablets pack",
        price: "45",
        categoryId: Array.from(this.categories.values())[1].id,
        vendor: "City Pharmacy",
        rating: "4.8",
        reviewCount: 245,
        imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=120&fit=crop"
      },
      {
        name: "Mutton Karahi",
        description: "Traditional mutton karahi with fresh naan",
        price: "650",
        categoryId: Array.from(this.categories.values())[0].id,
        vendor: "Desi Palace",
        rating: "4.6",
        reviewCount: 98,
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=120&fit=crop"
      },
      {
        name: "Rice 5kg",
        description: "Premium basmati rice 5kg pack",
        price: "1200",
        categoryId: Array.from(this.categories.values())[2].id,
        vendor: "Local Mart",
        rating: "4.3",
        reviewCount: 156,
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=120&fit=crop"
      }
    ];

    products.forEach(product => this.createProduct(product));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.categoryId === categoryId);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      rating: insertProduct.rating || null,
      reviewCount: insertProduct.reviewCount || null,
      isAvailable: insertProduct.isAvailable !== undefined ? insertProduct.isAvailable : true,
      imageUrl: insertProduct.imageUrl || null
    };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.vendor.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status || "pending",
      estimatedDelivery: insertOrder.estimatedDelivery || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(item => item.orderId === orderId);
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Chat Messages
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...insertChatMessage,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
}

export const storage = new MemStorage();
