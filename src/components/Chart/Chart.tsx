import  { useEffect, useRef } from "react";
import { createChart, ISeriesApi } from "lightweight-charts";
import { fetchHistoricalData } from "../../services/binanceApi";
import { createWebSocketConnection } from "../../services/binanceWebSocket";
import "./Chart.css";

interface ChartProps {
  pair: string;
  timeframe: string;
}

  export default function Chart({ pair, timeframe }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 400,
      layout: {
        
        textColor: "#000000",
        backgroundColor: "#f0f0f0",
      },
      grid: {
        vertLines: { color: "#e0e0e0" },
        horzLines: { color: "#e0e0e0" },
      },
      priceScale: {
        borderColor: "#cccccc",
      },
      timeScale: {
        borderColor: "#cccccc",
      },
    });

   
    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeriesRef.current = candlestickSeries;

    
    return () => chart.remove();
  }, []);

  useEffect(() => {
    if (!candlestickSeriesRef.current) return;

    const loadData = async () => {
      try {
        const historicalData = await fetchHistoricalData(pair, timeframe);
        candlestickSeriesRef.current!.setData(historicalData);
      } catch (error) {
        console.error("Error loading historical data:", error);
      }
    };

    loadData();
  }, [pair, timeframe]);

  useEffect(() => {
    if (!candlestickSeriesRef.current) return;
  
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  
    websocketRef.current = createWebSocketConnection(pair, timeframe, (newCandle) => {
      candlestickSeriesRef.current!.update(newCandle); 
    });
  
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close(); 
      }
    };
  }, [pair, timeframe]);
  

  return <div className="chart" ref={chartContainerRef} />;
};


