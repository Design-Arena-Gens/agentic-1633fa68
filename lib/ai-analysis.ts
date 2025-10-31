import OpenAI from "openai";
import { Review, AnalysisResult } from "./types";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function analyzeSentiment(reviews: Review[]): Promise<Review[]> {
  if (!openai) {
    // Fallback: simple keyword-based sentiment
    return reviews.map(review => ({
      ...review,
      sentiment: classifyReviewFallback(review.text),
      topics: extractTopicsFallback(review.text),
    }));
  }

  const analyzed = await Promise.all(
    reviews.map(async (review) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Analyze this product review and return JSON with sentiment (positive/neutral/negative) and topics array (max 3 keywords like 'quality', 'delivery', 'fit', etc.)",
            },
            {
              role: "user",
              content: review.text,
            },
          ],
          response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");
        return {
          ...review,
          sentiment: result.sentiment || "neutral",
          topics: result.topics || [],
        };
      } catch {
        return {
          ...review,
          sentiment: classifyReviewFallback(review.text),
          topics: extractTopicsFallback(review.text),
        };
      }
    })
  );

  return analyzed;
}

function classifyReviewFallback(text: string): "positive" | "neutral" | "negative" {
  const positive = ["great", "excellent", "good", "amazing", "love", "recommend", "happy", "satisfied"];
  const negative = ["bad", "poor", "worst", "terrible", "disappointed", "useless", "waste"];

  const lowerText = text.toLowerCase();
  const posCount = positive.filter(word => lowerText.includes(word)).length;
  const negCount = negative.filter(word => lowerText.includes(word)).length;

  if (posCount > negCount) return "positive";
  if (negCount > posCount) return "negative";
  return "neutral";
}

function extractTopicsFallback(text: string): string[] {
  const topics = ["quality", "delivery", "price", "fit", "color", "size", "packaging", "material"];
  const lowerText = text.toLowerCase();
  return topics.filter(topic => lowerText.includes(topic)).slice(0, 3);
}

export async function generateInsights(reviews: Review[], productData: any) {
  const sentimentCounts = reviews.reduce(
    (acc, r) => {
      acc[r.sentiment]++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const topicMap: Record<string, number> = {};
  reviews.forEach(r => {
    r.topics.forEach(topic => {
      topicMap[topic] = (topicMap[topic] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));

  const verifiedCount = reviews.filter(r => r.verified).length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  let buyerStyle = "Mixed Buyers";
  if (verifiedCount / reviews.length > 0.7) buyerStyle = "Repeat Customers";
  else if (avgRating > 4.5) buyerStyle = "Gift Buyers";

  const salesBehavior = avgRating > 4 ? "High Engagement" : "Moderate Engagement";
  const estimatedMonthlyRevenue = Math.round(productData.ratingCount * productData.price * 0.1);

  const positiveTrend = sentimentCounts.positive > sentimentCounts.negative ? "positively" : "neutrally";
  const overallSummary = openai
    ? await generateSummaryWithAI(reviews, productData)
    : `Overall this product is trending ${positiveTrend} with consistent pricing and ${buyerStyle.toLowerCase()}.`;

  return {
    sentimentSummary: sentimentCounts,
    topTopics,
    buyerStyle,
    salesBehavior,
    overallSummary,
    estimatedMonthlyRevenue,
  };
}

async function generateSummaryWithAI(reviews: Review[], productData: any): Promise<string> {
  if (!openai) return "";

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize the product reviews and data in one concise sentence focusing on trends, sentiment, and buying behavior.",
        },
        {
          role: "user",
          content: JSON.stringify({ product: productData, reviewCount: reviews.length, reviews: reviews.slice(0, 10) }),
        },
      ],
    });

    return completion.choices[0].message.content || "";
  } catch {
    return "";
  }
}
