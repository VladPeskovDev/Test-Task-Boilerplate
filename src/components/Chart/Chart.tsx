import { useEffect, useRef, useState } from "react";
import { createChart, DeepPartial, ISeriesApi, LayoutOptions } from "lightweight-charts";
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
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
  
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 400,
      layout: {
        textColor: "#000000",
        backgroundColor: "#f0f0f0",
      } as DeepPartial<LayoutOptions>,
      grid: {
        vertLines: { color: "#e0e0e0" },
        horzLines: { color: "#e0e0e0" },
      },
      timeScale: {
        borderColor: "#cccccc",
      },
    });
  
    // Настраиваем priceScale
    chart.priceScale("right").applyOptions({
      borderColor: "#cccccc",
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

      setCurrentPrice(parseFloat(newCandle.close));
    });

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [pair, timeframe]);

  return (
    <div className="chart-wrapper">
      <div className="price-display">
  {currentPrice !== null ? (
    <>
      <span className="asset-name">{pair.replace('/', '')}</span> 
      <br />
      <span className="price">Текущая цена: ${currentPrice.toFixed(2)}</span>
    </>
  ) : (
    "Loading..."
  )}
</div>
      <div className="chart-container" ref={chartContainerRef}></div>
    </div>
  );
}
