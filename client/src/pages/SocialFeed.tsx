import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SocialFeed() {
  const posts = [
    { id: 1, author: "Alice", avatar: "👩", content: "Just made 50% profit on my SKY position! 🚀", likes: 234, comments: 45, timestamp: "2h ago" },
    { id: 2, author: "Bob", avatar: "👨", content: "BTC breaking through resistance, bullish setup forming", likes: 567, comments: 89, timestamp: "4h ago" },
    { id: 3, author: "Charlie", avatar: "🧑", content: "New DeFi protocol launched, APY at 45%", likes: 890, comments: 156, timestamp: "6h ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Search className="w-5 h-5 text-gray-400" />
        <Input placeholder="Search posts..." className="bg-gray-800 border-gray-700 text-white" />
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{post.avatar}</span>
                <div>
                  <p className="font-bold text-white">{post.author}</p>
                  <p className="text-xs text-gray-400">{post.timestamp}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">{post.content}</p>
              <div className="flex gap-4 text-gray-400">
                <div className="flex items-center gap-1"><Heart className="w-4 h-4" /> {post.likes}</div>
                <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {post.comments}</div>
                <div className="flex items-center gap-1"><Share2 className="w-4 h-4" /> Share</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
