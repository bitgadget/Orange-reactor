
export interface CoinData {
  bitcoin: {
    usd: number;
    usd_market_cap: number;
    usd_24h_vol: number;
    usd_24h_change: number;
    last_updated_at: number;
    // Extended Stats (CoinGecko)
    rank?: number;
    ath?: number;
    ath_change?: number;
    high_24h?: number;
    low_24h?: number;
    circulating_supply?: number;
    total_supply?: number;
    // Temporal Performance
    change_1h?: number;
    change_24h?: number;
    change_7d?: number;
    change_30d?: number;
    change_60d?: number;
    change_1y?: number;
  };
}

export interface ChartPoint {
  date: string;
  price: number;
}

export interface HistoricalData {
  date: string;
  price: number;
  market_cap: number;
  volume: number;
  high?: number;
  low?: number;
}

export interface MiningPool {
  name: string;
  blockCount: number;
  share: number; // percentage
  slug: string;
}

export interface NetworkStats {
  height: number;
  hashrate: number; // EH/s
  difficulty: number; // in Trillions
  nextRetarget: number; // blocks remaining
  difficultyChange: number; // percent estimate
  fees: {
    fast: number; // sat/vB
    hour: number;
  };
  mempool: {
    count: number; // tx count
    vBytes: number; // total size
  };
  halving: {
    nextBlock: number;
    progress: number; // percent
    blocksToGo: number;
  };
  pools: MiningPool[];
}

export type TimeFrame = '24H' | '7D' | '30D';
export type Theme = 'CYBER' | 'MINIMAL';

export interface MarketAnalysis {
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  analysis: string;
  recommendation: string;
}

export enum LoadingState {
  BOOTING,
  CONNECTING,
  DECRYPTING,
  READY
}
