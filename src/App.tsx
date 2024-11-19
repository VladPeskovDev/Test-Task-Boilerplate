import { useState } from "react";
import "./App.css";
import { Layout } from "antd";
import Header from "./components/Header";
import Chart from "./components/Chart";
import { ThemeConfigProvider } from "./contexts/ThemeConfigProvider";

function App() {
  const { Content } = Layout;
  const [pair, setPair] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1d");

  return (
    <ThemeConfigProvider>
      <Layout>
        <Header
          onPairChange={(newPair) => setPair(newPair)}
          onTimeframeChange={(newTimeframe) => setTimeframe(newTimeframe)}
        />
        <Content className="content">
          <Chart pair={pair} timeframe={timeframe} />
        </Content>
      </Layout>
    </ThemeConfigProvider>
  );
}

export default App;

