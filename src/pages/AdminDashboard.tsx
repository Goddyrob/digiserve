import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, CalendarDays, ClipboardList, RefreshCw, Phone, Mail, FileText, ExternalLink } from "lucide-react";
import PaymentReceipt from "@/components/PaymentReceipt";

type Booking = {
  id: string;
  client_name: string;
  phone: string;
  email: string | null;
  whatsapp_number: string | null;
  category: string | null;
  service: string | null;
  mode: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  file_urls: string[] | null;
};

type ServiceRequest = {
  id: string;
  client_name: string;
  phone: string;
  email: string | null;
  whatsapp_number: string | null;
  description: string;
  urgency: string | null;
  preferred_contact: string | null;
  status: string;
  created_at: string;
  file_urls: string[] | null;
};

const statusColor = (s: string) => {
  switch (s) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "confirmed": return "bg-green-100 text-green-800 border-green-300";
    case "completed": return "bg-blue-100 text-blue-800 border-blue-300";
    case "cancelled": return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-muted text-muted-foreground";
  }
};

const FileLinks = ({ urls }: { urls: string[] | null }) => {
  if (!urls || urls.length === 0) return <span className="text-muted-foreground text-xs">No files</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {urls.map((url, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
          <FileText className="h-3 w-3" /> File {i + 1} <ExternalLink className="h-2.5 w-2.5" />
        </a>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin-login");
        return;
      }
      setAuthChecked(true);
      fetchData();
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin-login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [bRes, sRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("service_requests").select("*").order("created_at", { ascending: false }),
    ]);
    if (bRes.data) setBookings(bRes.data as any);
    if (sRes.data) setRequests(sRes.data as any);
    setLoading(false);
  };

  const updateStatus = async (table: "bookings" | "service_requests", id: string, status: string) => {
    // For bookings with "completed" status, show receipt dialog instead
    if (table === "bookings" && status === "completed") {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        setSelectedBooking(booking);
        setPendingBookingId(id);
        setReceiptOpen(true);
      }
      return;
    }

    // For service requests with "completed" status, show receipt dialog instead
    if (table === "service_requests" && status === "completed") {
      const request = requests.find(r => r.id === id);
      if (request) {
        setSelectedRequest(request);
        setPendingRequestId(id);
        setReceiptOpen(true);
      }
      return;
    }

    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchData();
    }
  };

  const completeBooking = async () => {
    if (!pendingBookingId) return;
    const { error } = await supabase.from("bookings").update({ status: "completed" }).eq("id", pendingBookingId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking completed! Receipt generated." });
      setReceiptOpen(false);
      setPendingBookingId(null);
      setSelectedBooking(null);
      fetchData();
    }
  };

  const completeServiceRequest = async () => {
    if (!pendingRequestId) return;
    const { error } = await supabase.from("service_requests").update({ status: "completed" }).eq("id", pendingRequestId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Service request completed! Receipt generated." });
      setReceiptOpen(false);
      setPendingRequestId(null);
      setSelectedRequest(null);
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  if (!authChecked) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const pendingRequests = requests.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-primary">{bookings.length}</p><p className="text-sm text-muted-foreground">Total Bookings</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-yellow-600">{pendingBookings}</p><p className="text-sm text-muted-foreground">Pending Bookings</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-primary">{requests.length}</p><p className="text-sm text-muted-foreground">Service Requests</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p><p className="text-sm text-muted-foreground">Pending Requests</p></CardContent></Card>
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="bookings" className="gap-1"><CalendarDays className="h-4 w-4" /> Bookings</TabsTrigger>
            <TabsTrigger value="requests" className="gap-1"><ClipboardList className="h-4 w-4" /> Service Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : bookings.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No bookings yet</CardContent></Card>
            ) : (
              <div className="space-y-4 md:hidden">
                {bookings.map(b => (
                  <Card key={b.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{b.client_name}</CardTitle>
                        <Badge className={statusColor(b.status)}>{b.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{b.phone}</div>
                      {b.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{b.email}</div>}
                      {b.category && <p><span className="font-medium">Category:</span> {b.category}</p>}
                      {b.service && <p><span className="font-medium">Service:</span> {b.service}</p>}
                      {b.mode && <p><span className="font-medium">Mode:</span> {b.mode}</p>}
                      {b.preferred_date && <p><span className="font-medium">Date:</span> {b.preferred_date}</p>}
                      {b.preferred_time && <p><span className="font-medium">Time:</span> {b.preferred_time}</p>}
                      {b.notes && <p><span className="font-medium">Notes:</span> {b.notes}</p>}
                      <div><span className="font-medium">Files:</span> <FileLinks urls={b.file_urls} /></div>
                      <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleString()}</p>
                      <Select value={b.status} onValueChange={v => updateStatus("bookings", b.id, v)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loading && bookings.length > 0 && (
              <div className="hidden md:block overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium">{b.client_name}</TableCell>
                        <TableCell>{b.phone}</TableCell>
                        <TableCell>{b.category}{b.service ? ` — ${b.service}` : ""}</TableCell>
                        <TableCell>{b.preferred_date || "—"} {b.preferred_time || ""}</TableCell>
                        <TableCell>{b.mode || "—"}</TableCell>
                        <TableCell><FileLinks urls={b.file_urls} /></TableCell>
                        <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select value={b.status} onValueChange={v => updateStatus("bookings", b.id, v)}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : requests.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">No service requests yet</CardContent></Card>
            ) : (
              <div className="space-y-4 md:hidden">
                {requests.map(r => (
                  <Card key={r.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{r.client_name}</CardTitle>
                        <Badge className={statusColor(r.status)}>{r.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{r.phone}</div>
                      {r.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{r.email}</div>}
                      <p>{r.description}</p>
                      {r.urgency && <p><span className="font-medium">Urgency:</span> {r.urgency}</p>}
                      <div><span className="font-medium">Files:</span> <FileLinks urls={r.file_urls} /></div>
                      <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                      <Select value={r.status} onValueChange={v => updateStatus("service_requests", r.id, v)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            {!loading && requests.length > 0 && (
              <div className="hidden md:block overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Files</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.client_name}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{r.description}</TableCell>
                        <TableCell>{r.urgency || "—"}</TableCell>
                        <TableCell><FileLinks urls={r.file_urls} /></TableCell>
                        <TableCell><Badge className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select value={r.status} onValueChange={v => updateStatus("service_requests", r.id, v)}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Receipt Dialog */}
        {(selectedBooking || selectedRequest) && (
          <PaymentReceipt
            isOpen={receiptOpen}
            onClose={() => {
              setReceiptOpen(false);
              if (selectedBooking) {
                completeBooking();
              } else if (selectedRequest) {
                completeServiceRequest();
              }
            }}
            booking={{
              id: selectedBooking?.id || selectedRequest?.id || "",
              client_name: selectedBooking?.client_name || selectedRequest?.client_name || "",
              service: selectedBooking?.service || selectedRequest?.description || "Service",
              category: selectedBooking?.category || "Service Request",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
