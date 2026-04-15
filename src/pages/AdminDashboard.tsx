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
import { Loader2, LogOut, CalendarDays, ClipboardList, RefreshCw, Phone, Mail, FileText, ExternalLink, Trash2 } from "lucide-react";
import PaymentReceipt from "@/components/PaymentReceipt";
import WaitingReceipt from "@/components/WaitingReceipt";

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
  ticket_number: string | null;
  kcse_index: string | null;
  kcpe_index: string | null;
  kcse_year: string | null;
  course_name: string | null;
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
  ticket_number: string | null;
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
  const [waitingReceiptOpen, setWaitingReceiptOpen] = useState(false);
  const [selectedWaitingBooking, setSelectedWaitingBooking] = useState<Booking | null>(null);
  const [selectedWaitingRequest, setSelectedWaitingRequest] = useState<ServiceRequest | null>(null);
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

  const deleteCompletedBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this completed booking? This action cannot be undone.")) {
      return;
    }

    // Immediately remove from UI
    setBookings(prev => prev.filter(b => b.id !== id));

    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      fetchData(); // Refetch on error to restore state
    } else {
      toast({ title: "Booking deleted successfully" });
    }
  };

  const deleteCompletedRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this completed service request? This action cannot be undone.")) {
      return;
    }

    // Immediately remove from UI
    setRequests(prev => prev.filter(r => r.id !== id));

    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      fetchData(); // Refetch on error to restore state
    } else {
      toast({ title: "Service request deleted successfully" });
    }
  };

  const generateTicketNumber = async (table: "bookings" | "service_requests", id: string) => {
    // Generate a unique ticket number
    const ticketNumber = `T-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const { error } = await supabase.from(table).update({ ticket_number: ticketNumber }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return null;
    }

    toast({ title: "Ticket number generated", description: `Ticket: ${ticketNumber}` });
    fetchData();
    return ticketNumber;
  };

  const openWaitingReceipt = async (table: "bookings" | "service_requests", id: string) => {
    let ticketNumber = null;

    if (table === "bookings") {
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        ticketNumber = booking.ticket_number;
        if (!ticketNumber) {
          ticketNumber = await generateTicketNumber(table, id);
        }
        if (ticketNumber) {
          setSelectedWaitingBooking(booking);
          setWaitingReceiptOpen(true);
        }
      }
    } else {
      const request = requests.find(r => r.id === id);
      if (request) {
        ticketNumber = request.ticket_number;
        if (!ticketNumber) {
          ticketNumber = await generateTicketNumber(table, id);
        }
        if (ticketNumber) {
          setSelectedWaitingRequest(request);
          setWaitingReceiptOpen(true);
        }
      }
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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            ← Back to Website
          </Button>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
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
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <CardTitle className="text-base">{b.client_name}</CardTitle>
                          {b.ticket_number && <p className="text-xs font-bold text-blue-600 mt-1">Waiting No: {b.ticket_number}</p>}
                        </div>
                        <Badge className={statusColor(b.status)}>{b.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      {/* Client Contact Information */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold text-gray-700 mb-2">Contact Information</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{b.phone}</div>
                          {b.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{b.email}</div>}
                          {b.whatsapp_number && <p><span className="font-medium">WhatsApp:</span> {b.whatsapp_number}</p>}
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                          <ClipboardList className="h-5 w-5 text-slate-700" />
                          <p className="font-bold text-slate-900 text-lg">Service Details</p>
                        </div>
                        <div className="space-y-3">
                          {b.category && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Category *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.category}</p>
                            </div>
                          )}
                          {b.service && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Service *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.service}</p>
                            </div>
                          )}
                          {b.mode && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Mode *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.mode}</p>
                            </div>
                          )}
                          {b.kcse_index && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">KCSE Index Number *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.kcse_index}</p>
                            </div>
                          )}
                          {b.kcpe_index && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">KCPE Index Number *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.kcpe_index}</p>
                            </div>
                          )}
                          {b.kcse_year && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">KCSE Year *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.kcse_year}</p>
                            </div>
                          )}
                          {b.course_name && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Course Interested In *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.course_name}</p>
                            </div>
                          )}
                          {b.preferred_date && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Preferred Date *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.preferred_date}</p>
                            </div>
                          )}
                          {b.preferred_time && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Preferred Time *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.preferred_time}</p>
                            </div>
                          )}
                          {b.notes && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Notes</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{b.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                        <p className="font-semibold text-amber-900 mb-2">Appointment Details</p>
                        <div className="space-y-1 text-xs">
                          {b.preferred_date && <p><span className="font-medium">Date:</span> {b.preferred_date}</p>}
                          {b.preferred_time && <p><span className="font-medium">Time:</span> {b.preferred_time}</p>}
                          <p className="text-muted-foreground">Submitted: {new Date(b.created_at).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      {b.notes && (
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="font-semibold text-purple-900 mb-2">Remarks/Notes</p>
                          <p className="text-xs text-purple-800">{b.notes}</p>
                        </div>
                      )}

                      {/* Files */}
                      <div>
                        <span className="font-medium text-xs">Attachments:</span>
                        <FileLinks urls={b.file_urls} />
                      </div>

                      {/* Status Update */}
                      <Select value={b.status} onValueChange={v => updateStatus("bookings", b.id, v)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        {b.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openWaitingReceipt("bookings", b.id)}
                            className="w-full"
                          >
                            Generate Waiting Receipt
                          </Button>
                        )}
                        {b.status === "completed" && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteCompletedBooking(b.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete Booking
                          </Button>
                        )}
                      </div>
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
                      <TableHead>Contact</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead>Waiting No</TableHead>
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
                        <TableCell className="text-xs"><div>{b.phone}</div>{b.email && <div className="text-muted-foreground">{b.email}</div>}</TableCell>
                        <TableCell className="text-xs min-w-[260px] max-w-[340px] whitespace-normal break-words">
                          <div>
                            {b.category && <div className="mb-1">{b.category}</div>}
                            {b.service && <div className="font-medium text-xs mb-1">{b.service}</div>}
                            {b.course_name && <div className="text-muted-foreground mb-1">Course: {b.course_name}</div>}
                            {b.kcse_year && <div className="text-muted-foreground mb-1">KCSE Year: {b.kcse_year}</div>}
                            {b.kcse_index && <div className="text-muted-foreground mb-1">KCSE Index: {b.kcse_index}</div>}
                            {b.kcpe_index && <div className="text-muted-foreground">KCPE Index: {b.kcpe_index}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs whitespace-normal break-words">{b.preferred_date || "—"} {b.preferred_time || ""}{b.mode && <div className="text-muted-foreground">({b.mode})</div>}</TableCell>
                        <TableCell className="font-bold text-blue-600">{b.ticket_number || "—"}</TableCell>
                        <TableCell><FileLinks urls={b.file_urls} /></TableCell>
                        <TableCell><Badge className={statusColor(b.status)}>{b.status}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select value={b.status} onValueChange={v => updateStatus("bookings", b.id, v)}>
                              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            {b.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openWaitingReceipt("bookings", b.id)}
                              >
                                Receipt
                              </Button>
                            )}
                            {b.status === "completed" && (
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => deleteCompletedBooking(b.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
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
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <CardTitle className="text-base">{r.client_name}</CardTitle>
                          {r.ticket_number && <p className="text-xs font-bold text-blue-600 mt-1">Waiting No: {r.ticket_number}</p>}
                        </div>
                        <Badge className={statusColor(r.status)}>{r.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                      {/* Client Contact Information */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-semibold text-gray-700 mb-2">Contact Information</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{r.phone}</div>
                          {r.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{r.email}</div>}
                          {r.whatsapp_number && <p><span className="font-medium">WhatsApp:</span> {r.whatsapp_number}</p>}
                          {r.preferred_contact && <p><span className="font-medium">Preferred Contact:</span> {r.preferred_contact}</p>}
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-4">
                          <ClipboardList className="h-5 w-5 text-slate-700" />
                          <p className="font-bold text-slate-900 text-lg">Service Details</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-600 font-semibold">Description *</p>
                            <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{r.description}</p>
                          </div>
                          {r.urgency && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Urgency Level *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1 font-semibold text-amber-600">{r.urgency}</p>
                            </div>
                          )}
                          {r.preferred_contact && (
                            <div>
                              <p className="text-xs text-slate-600 font-semibold">Preferred Contact *</p>
                              <p className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200 mt-1">{r.preferred_contact}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Submission Details */}
                      <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400">
                        <p className="font-semibold text-amber-900 mb-2">Submission Information</p>
                        <div className="space-y-1 text-xs">
                          <p className="text-muted-foreground">Submitted: {new Date(r.created_at).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Files */}
                      <div>
                        <span className="font-medium text-xs">Attachments:</span>
                        <FileLinks urls={r.file_urls} />
                      </div>

                      {/* Status Update */}
                      <Select value={r.status} onValueChange={v => updateStatus("service_requests", r.id, v)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2">
                        {r.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openWaitingReceipt("service_requests", r.id)}
                            className="w-full"
                          >
                            Generate Waiting Receipt
                          </Button>
                        )}
                        {r.status === "completed" && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => deleteCompletedRequest(r.id)}
                            className="w-full"
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Delete Request
                          </Button>
                        )}
                      </div>
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
                      <TableHead>Contact</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Waiting No</TableHead>
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
                        <TableCell className="text-xs"><div>{r.phone}</div>{r.email && <div className="text-muted-foreground">{r.email}</div>}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-xs">{r.description}</TableCell>
                        <TableCell>{r.urgency || "—"}</TableCell>
                        <TableCell className="font-bold text-blue-600">{r.ticket_number || "—"}</TableCell>
                        <TableCell><FileLinks urls={r.file_urls} /></TableCell>
                        <TableCell><Badge className={statusColor(r.status)}>{r.status}</Badge></TableCell>
                        <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select value={r.status} onValueChange={v => updateStatus("service_requests", r.id, v)}>
                              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            {r.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openWaitingReceipt("service_requests", r.id)}
                              >
                                Receipt
                              </Button>
                            )}
                            {r.status === "completed" && (
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => deleteCompletedRequest(r.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
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

        {/* Waiting Receipt Dialog */}
        {(selectedWaitingBooking || selectedWaitingRequest) && (
          <WaitingReceipt
            isOpen={waitingReceiptOpen}
            onClose={() => {
              setWaitingReceiptOpen(false);
              setSelectedWaitingBooking(null);
              setSelectedWaitingRequest(null);
            }}
            booking={selectedWaitingBooking ? {
              id: selectedWaitingBooking.id,
              client_name: selectedWaitingBooking.client_name,
              service: selectedWaitingBooking.service || "Service",
              category: selectedWaitingBooking.category || "Service",
              ticket_number: selectedWaitingBooking.ticket_number || "",
            } : undefined}
            serviceRequest={selectedWaitingRequest ? {
              id: selectedWaitingRequest.id,
              client_name: selectedWaitingRequest.client_name,
              description: selectedWaitingRequest.description,
              ticket_number: selectedWaitingRequest.ticket_number || "",
            } : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
