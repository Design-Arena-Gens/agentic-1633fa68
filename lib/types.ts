export interface ProductData {
  id: string;
  url: string;
  title: string;
  category: string;
  image: string;
  seller: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  ratingCount: number;
  stock: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  sentiment: "positive" | "neutral" | "negative";
  topics: string[];
  images?: string[];
}

export interface PriceHistory {
  productId: string;
  price: number;
  timestamp: string;
}

export interface AnalysisResult {
  product: ProductData;
  reviews: Review[];
  priceHistory: PriceHistory[];
  insights: {
    sentimentSummary: {
      positive: number;
      neutral: number;
      negative: number;
    };
    topTopics: { topic: string; count: number }[];
    buyerStyle: string;
    salesBehavior: string;
    overallSummary: string;
    estimatedMonthlyRevenue: number;
  };
}

export interface Job {
  id: string;
  productId: string;
  status: "pending" | "scraping" | "analyzing" | "completed" | "failed";
  progress: number;
  message: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export type TimeRange = "1m" | "6m" | "life";
