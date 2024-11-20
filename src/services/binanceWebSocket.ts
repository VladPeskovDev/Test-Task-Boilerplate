export const createWebSocketConnection = (
    symbol: string,
    timeframe: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (data: any) => void
  ) => {
    const formattedSymbol = symbol.replace("/", "").toLowerCase();
    const url = `wss://stream.binance.com:9443/ws/${formattedSymbol}@kline_${timeframe}`;
  
    const ws = new WebSocket(url);
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
  
      if (message.k) {
        const candle = {
          time: message.k.t / 1000, 
          open: parseFloat(message.k.o),
          high: parseFloat(message.k.h),
          low: parseFloat(message.k.l),
          close: parseFloat(message.k.c),
        };
        callback(candle);
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    ws.onclose = () => {
      console.log("Соединение закрыто");
    };
  
    return ws;
  };
  