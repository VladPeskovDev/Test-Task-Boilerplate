import axios from "axios";

const BASE_URL = "https://api.binance.com";

export const fetchHistoricalData = async (
  symbol: string,
  interval: string,
  limit: number = 500
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v3/klines`,
      {
        params: {
          symbol: symbol.replace("/", ""),
          interval,
          limit,
        },
      }
    );

    const data: [number, string, string, string, string][] = response.data;
    return data.map((item) => ({
      time: item[0] / 1000, 
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }));
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};
