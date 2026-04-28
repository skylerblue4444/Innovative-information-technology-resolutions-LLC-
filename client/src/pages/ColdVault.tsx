import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/button";
import { Lock, Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ColdVault() {
  const [showBalances, setShowBalances] = useState(false);
  const assets = [
    { symbol: "BTC", amount: 2.5, value: 120000, address: "1A1z7aD..." },
    { symbol: "ETH", amount: 25, value: 80000, address: "0x742d..." },
    { symbol: "SKY", amount: 50000, value: 4000, address: "0x9f8c..." },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Cold Vault</h1>
        <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> Add Asset</Button>
      </div>

      <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300">Total Value</p>
              <p className="text-4xl font-bold text-white">{showBalances ? "$204,000" : "••••••"}</p>
            </div>
            <Button variant="ghost" onClick={() => setShowBalances(!showBalances)}>
              {showBalances ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {assets.map((asset) => (
          <Card key={asset.symbol} className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{asset.symbol}</p>
                  <p className="text-sm text-gray-400">{asset.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{asset.amount} {asset.symbol}</p>
                  <p className="text-gray-400">${showBalances ? asset.value.toLocaleString() : "••••"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
