import { GoogleGenAI, Type } from "@google/genai";
import { CoinData, MarketAnalysis, ChartPoint, TimeFrame } from '../types';

// Initialize Gemini
// Note: process.env.API_KEY is injected by the environment.
const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const analyzeMarket = async (data: CoinData, chartData: ChartPoint[] = [], timeframe: TimeFrame = '24H'): Promise<MarketAnalysis> => {
  // If no API key is present, return a simulated response to prevent crashing
  if (!ai) {
    return {
      sentiment: 'NEUTRAL',
      confidence: 75,
      analysis: "SYSTEM WARNING: NEURAL LINK SEVERED. UNABLE TO CONNECT TO AI CORE. DISPLAYING CACHED HEURISTICS: MARKET VOLATILITY WITHIN TOLERANCE.",
      recommendation: "HODL"
    };
  }

  // Calculate trends from chart data if available
  let trendContext = "";
  if (chartData.length > 0) {
      const startPrice = chartData[0].price;
      const endPrice = chartData[chartData.length - 1].price;
      const trendPercent = ((endPrice - startPrice) / startPrice) * 100;
      
      const prices = chartData.map(p => p.price);
      const periodHigh = Math.max(...prices);
      const periodLow = Math.min(...prices);

      trendContext = `
      SELECTED TIMEFRAME: ${timeframe}
      - Start Price: $${startPrice.toFixed(2)}
      - End Price: $${endPrice.toFixed(2)}
      - Period Trend: ${trendPercent.toFixed(2)}%
      - Period High: $${periodHigh.toFixed(2)}
      - Period Low: $${periodLow.toFixed(2)}
      `;
  }

  try {
    const prompt = `
      Identity: You are "NEXUS-7", an elite AI crypto-financial analyst integrated into a cyberpunk terminal. 
      Your task is to provide a SERIOUS, high-level technical analysis of the Bitcoin market.
      
      Do not be generic. Use the specific numbers provided below.
      
      LIVE METRICS:
      - Current Price: $${data.bitcoin.usd}
      - 24h Change: ${data.bitcoin.usd_24h_change.toFixed(2)}%
      - Volume: $${(data.bitcoin.usd_24h_vol / 1_000_000_000).toFixed(2)} Billion
      - Market Cap: $${(data.bitcoin.usd_market_cap / 1_000_000_000).toFixed(2)} Billion
      ${data.bitcoin.ath ? `- All Time High: $${data.bitcoin.ath} (${data.bitcoin.ath_change?.toFixed(2)}% away)` : ''}
      
      HISTORICAL CONTEXT (Chart Data):
      ${trendContext}

      INSTRUCTIONS:
      1. Analyze the correlation between volume and price action.
      2. Evaluate the trend strength based on the "Period Trend" and "24h Change".
      3. Mention support or resistance levels if the price is near the Period Low or Period High.
      4. Your tone must be cold, analytical, and authoritative, but using cyberpunk terminology (e.g., "signals", "resistance vector", "accumulation zones").
      5. The 'analysis' text must be 1-2 sharp, insightful sentences. NO FLUFF.
      
      JSON RESPONSE FORMAT:
      {
        "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
        "confidence": (number 1-100),
        "analysis": "string",
        "recommendation": "ACCUMULATE" | "LIQUIDATE" | "HODL" | "OBSERVE"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sentiment: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] },
                confidence: { type: Type.NUMBER },
                analysis: { type: Type.STRING },
                recommendation: { type: Type.STRING }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MarketAnalysis;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return {
      sentiment: 'NEUTRAL',
      confidence: 50,
      analysis: "COMMUNICATION INTERRUPTED. STATIC IN THE DATASTREAM.",
      recommendation: "WAIT"
    };
  }
};