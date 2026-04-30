"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getCustomizationRequests, updateCustomizationRequest } from "@/lib/data";
import { CustomizationRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, User } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function ArtisanCustomizationsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CustomizationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  useEffect(() => {
    if (user) loadRequests();
  }, [user]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await getCustomizationRequests({ artisanId: user!.uid });
    setRequests(data);
    setLoading(false);
  };

  const handleRespond = async (id: string, status: "accepted" | "rejected") => {
    if (!responseMessage.trim()) return;
    setResponding(id);
    try {
      await updateCustomizationRequest(id, {
        status,
        responseMessage,
        proposedPrice: proposedPrice ? Number(proposedPrice) : undefined,
      });
      setResponseMessage("");
      setProposedPrice("");
      loadRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-950">Customization Requests</h1>
        <p className="text-gray-600">Respond to customer personalization requests</p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <MessageSquare className="h-12 w-12 text-amber-300 mx-auto mb-4" />
          <h3 className="font-semibold text-amber-950">No requests yet</h3>
          <p className="text-sm text-gray-500 mt-1">Customization requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={statusColors[req.status] || "bg-gray-100 text-gray-800"}>{req.status}</Badge>
                      <span className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-amber-950">{req.productName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" /> {req.customerName} ({req.customerEmail})
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Customer Message:</p>
                  <p className="text-gray-800">{req.message}</p>
                </div>

                {req.responseMessage && (
                  <div className="bg-green-50/50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Your Response:</p>
                    <p className="text-gray-800">{req.responseMessage}</p>
                    {req.proposedPrice && (
                      <p className="text-sm font-medium text-amber-900 mt-1">Proposed Price: ₹{req.proposedPrice.toLocaleString()}</p>
                    )}
                  </div>
                )}

                {req.status === "pending" && (
                  <div className="space-y-3 border-t pt-4">
                    <Textarea
                      placeholder="Write your response to the customer..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={3}
                    />
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="number"
                          placeholder="Proposed price (optional)"
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRespond(req.id, "rejected")}
                        disabled={responding === req.id || !responseMessage.trim()}
                      >
                        {responding === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                      </Button>
                      <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => handleRespond(req.id, "accepted")}
                        disabled={responding === req.id || !responseMessage.trim()}
                      >
                        {responding === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
