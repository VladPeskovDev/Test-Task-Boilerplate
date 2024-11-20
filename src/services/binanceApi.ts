import axios from "axios";
import { Time } from "lightweight-charts";

const BASE_URL = "https://api.binance.com";

interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const fetchHistoricalData = async (
  pair: string,
  timeframe: string
): Promise<CandlestickData[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v3/klines`, {
      params: {
        symbol: pair.replace("/", ""),
        interval: timeframe,
        limit: 1000,
      },
    });

    const data: [number, string, string, string, string, string, string, string, string, string, string, string][] = response.data;

    return data.map((item) => ({
      time: item[0] / 1000 as Time, 
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    throw error;
  }
};
