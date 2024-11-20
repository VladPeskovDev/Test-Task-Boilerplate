import "./Header.css";
import { Button, Segmented, Select, Space } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeConfigProvider";

interface HeaderProps {
  onPairChange: (pair: string) => void;
  onTimeframeChange: (timeframe: string) => void;
}

export default function Header({ onPairChange, onTimeframeChange }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleChangePair = (value: string) => {
    onPairChange(value);
  };

  const handleChangeTimeframe = (value: string) => {
    onTimeframeChange(value);
  };

  return (
    <div className="header">
      <div className="header-left">
        <Space wrap>
          <Select
            defaultValue="BTC/USDT"
            style={{ width: 130 }}
            onChange={handleChangePair}
            options={[
              { value: "BTC/USDT", label: "BTC/USDT" },
              { value: "ETH/USDT", label: "ETH/USDT" },
              { value: "BNB/USDT", label: "BNB/USDT" },
              { value: "XRP/USDT", label: "XRP/USDT" },
              { value: "SOL/USDT", label: "SOL/USDT" },
              { value: "LUNA/USDT", label: "LUNA/USDT" },
              { value: "DOGE/USDT", label: "DOGE/USDT" },
              { value: "DOT/USDT", label: "DOT/USDT" },
              { value: "ADA/USDT", label: "ADA/USDT" },
              { value: "LINK/USDT", label: "LINK/USDT" },
              { value: "OP/USDT", label: "OP/USDT" },
            ]}
          />
          <Segmented<string>
            options={["5m", "15m", "1h", "4h", "1d", "3d", "1w", "1M"]}
            defaultValue="1d"
            onChange={handleChangeTimeframe}
          />
        </Space>
      </div>
      <Button
        type="text"
        onClick={toggleDarkMode}
        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
        size="large"
      />
    </div>
  );
}
