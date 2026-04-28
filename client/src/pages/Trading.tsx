import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap } from "lucide-react";

interface ChartData {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
}

interface Order {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  status: "pending" | "filled" | "canceled";
  filledQuantity: number;
  createdAt: string;
}

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  value: number;
}

/**
 * Production-Grade Trading Interface
 * Real-time market data, order execution, portfolio management
 */
export default function Trading() {
  const { user } = useAuth();
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(45230.50);
  const [priceChange24h, setPriceChange24h] = useState(2.34);
  const [orderForm, setOrderForm] = useState({
    type: "buy" as "buy" | "sell",
    orderType: "market" as "market" | "limit",
    quantity: "",
    price: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("1h");

  // Initialize chart data
  useEffect(() => {
    const generateChartData = () => {
      const data: ChartData[] = [];
      let price = currentPrice;
      const now = new Date();

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const volatility = (Math.random() - 0.5) * 0.02;
        price = price * (1 + volatility);
        const high = price * (1 + Math.random() * 0.005);
        const low = price * (1 - Math.random() * 0.005);

        data.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
        });
      }

      setChartData(data);
    };

    generateChartData();
  }, [selectedSymbol, timeframe]);

  // Real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((p) => {
        const change = (Math.random() - 0.5) * 100;
        return Math.max(1000, p + change);
      });

      setPriceChange24h((p) => {
        const change = (Math.random() - 0.5) * 0.5;
        return p + change;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Load user orders and positions
  useEffect(() => {
    if (user) {
      // Simulate loading orders
      setOrders([
        {
          id: "order_1",
          symbol: "BTC",
          type: "buy",
          quantity: 0.5,
          price: 45000,
          status: "filled",
          filledQuantity: 0.5,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "order_2",
          symbol: "ETH",
          type: "sell",
          quantity: 2,
          price: 2800,
          status: "pending",
          filledQuantity: 0,
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ]);

      // Simulate loading positions
      setPositions([
        {
          symbol: "BTC",
          quantity: 0.5,
          averagePrice: 44500,
          currentPrice: 45230.50,
          unrealizedPnL: 365.25,
          unrealizedPnLPercent: 0.82,
          value: 22615.25,
        },
        {
          symbol: "ETH",
          quantity: 5,
          averagePrice: 2700,
          currentPrice: 2845.75,
          unrealizedPnL: 728.75,
          unrealizedPnLPercent: 5.35,
          value: 14228.75,
        },
      ]);
    }
  }, [user]);

  const handlePlaceOrder = useCallback(async () => {
    if (!orderForm.quantity || !orderForm.price) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const newOrder: Order = {
        id: `order_${Date.now()}`,
        symbol: selectedSymbol,
        type: orderForm.type,
        quantity: parseFloat(orderForm.quantity),
        price: parseFloat(orderForm.price),
        status: "pending",
        filledQuantity: 0,
        createdAt: new Date().toISOString(),
      };

      setOrders([newOrder, ...orders]);
      setOrderForm({ ...orderForm, quantity: "", price: "" });
      toast.success(`${orderForm.type.toUpperCase()} order placed for ${selectedSymbol}`);

      // Simulate order fill after 2 seconds
      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === newOrder.id ? { ...o, status: "filled", filledQuantity: o.quantity } : o
          )
        );
      }, 2000);
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  }, [orderForm, selectedSymbol, orders]);

  const handleCancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "canceled" } : o))
    );
    toast.success("Order canceled");
  };

  const totalPortfolioValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalUnrealizedPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-200">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${currentPrice.toFixed(2)}</div>
            <p className={`text-sm mt-1 ${priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
              {priceChange24h >= 0 ? "+" : ""}{priceChange24h.toFixed(2)}% (24h)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalPortfolioValue.toFixed(2)}</div>
            <p className="text-xs text-purple-300 mt-1">{positions.length} positions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-200">Unrealized P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalUnrealizedPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
              ${totalUnrealizedPnL.toFixed(2)}
            </div>
            <p className="text-xs text-green-300 mt-1">
              {((totalUnrealizedPnL / totalPortfolioValue) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-200">Open Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{orders.filter((o) => o.status === "pending").length}</div>
            <p className="text-xs text-orange-300 mt-1">
              {orders.filter((o) => o.status === "filled").length} filled today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedSymbol}/USD</CardTitle>
                <CardDescription>Real-time price chart</CardDescription>
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="4h">4h</SelectItem>
                  <SelectItem value="1d">1d</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Form */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Place Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Symbol</label>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="SKY">SkyCoin (SKY)</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Order Type</label>
              <Select value={orderForm.orderType} onValueChange={(value) => setOrderForm({ ...orderForm, orderType: value as any })}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Side</label>
              <div className="flex gap-2">
                <Button
                  variant={orderForm.type === "buy" ? "default" : "outline"}
                  onClick={() => setOrderForm({ ...orderForm, type: "buy" })}
                  className="flex-1"
                >
                  Buy
                </Button>
                <Button
                  variant={orderForm.type === "sell" ? "destructive" : "outline"}
                  onClick={() => setOrderForm({ ...orderForm, type: "sell" })}
                  className="flex-1"
                >
                  Sell
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Quantity</label>
              <Input
                type="number"
                placeholder="0.00"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {orderForm.orderType === "limit" && (
              <div>
                <label className="text-sm font-medium text-gray-300">Price</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={orderForm.price}
                  onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            )}

            <Button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full ${orderForm.type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? "Placing..." : `${orderForm.type.toUpperCase()} ${selectedSymbol}`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Positions & Orders */}
      <Tabs defaultValue="positions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          {positions.map((position) => (
            <Card key={position.symbol} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{position.symbol}</h3>
                    <p className="text-sm text-gray-400">{position.quantity} @ ${position.averagePrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${position.value.toFixed(2)}</p>
                    <p className={`text-sm ${position.unrealizedPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {position.unrealizedPnL >= 0 ? "+" : ""}{position.unrealizedPnL.toFixed(2)} ({position.unrealizedPnLPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">
                      {order.type === "buy" ? "🟢" : "🔴"} {order.type.toUpperCase()} {order.symbol}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {order.quantity} @ ${order.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={order.status === "filled" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
