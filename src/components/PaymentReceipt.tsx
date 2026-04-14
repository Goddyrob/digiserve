import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Download } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface PaymentReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    client_name: string;
    service: string;
    category: string;
  };
}

const PAYMENT_NUMBER = "+254708580506";
const COMPANY_NAME = "DigiServe";
const BRAND_NAME = "Godswill Tech Solutions";
const SERVED_BY = "Godswill Robwet";

export const PaymentReceipt = ({
  isOpen,
  onClose,
  booking,
}: PaymentReceiptProps) => {
  const [amount, setAmount] = useState("");
  const [generating, setGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const receiptRef = useRef<HTMLDivElement>(null);

  // Generate payment ID only once when dialog opens
  const paymentId = useMemo(() => {
    return `DS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }, [isOpen]);

  // Generate QR code when amount changes
  useEffect(() => {
    if (amount) {
      QRCode.toDataURL(paymentId, {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.85,
        margin: 1,
        width: 200,
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error("QR Code generation failed:", err));
    }
  }, [amount]);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setGenerating(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 1.5,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.75);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`receipt-${paymentId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  const formatCurrency = (value: string) => {
    if (!value) return "KES 0.00";
    return `KES ${parseFloat(value).toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Payment Receipt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Service Amount (KES) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="100"
              required
            />
          </div>

          {amount && (
            <div className="space-y-4">
              {/* Receipt Preview */}
              <div
                ref={receiptRef}
                className="p-8 bg-white border-2 border-gray-300 rounded-lg space-y-4"
              >
                {/* Header */}
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold text-primary">{COMPANY_NAME}</h1>
                  <p className="text-sm font-semibold text-blue-600">{BRAND_NAME}</p>
                  <p className="text-sm text-gray-600">Professional Service Providers</p>
                  <div className="border-t-2 border-b-2 border-gray-400 py-2">
                    <p className="font-semibold">PAYMENT RECEIPT</p>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex justify-center py-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-400">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-32 h-32"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                        <p className="text-gray-600 text-sm">Loading...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Receipt Details */}
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 font-semibold">Receipt ID</p>
                      <p className="font-mono font-bold">{paymentId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Date</p>
                      <p className="font-mono">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-300 pt-3">
                    <p className="text-gray-600 font-semibold">Client Name</p>
                    <p className="font-bold text-lg">{booking.client_name}</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded border-l-4 border-primary">
                    <p className="text-gray-600 font-semibold">Service Description</p>
                    <p className="font-semibold">{booking.service}</p>
                    <p className="text-xs text-gray-600">Category: {booking.category}</p>
                  </div>

                  <div className="border-t-2 border-b-2 border-gray-300 py-4">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg">Amount Due</p>
                      <p className="font-bold text-2xl text-primary">
                        {formatCurrency(amount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-blue-50 p-3 rounded">
                    <p className="text-gray-600 font-semibold">Payment Details</p>
                    <div className="text-sm space-y-1">
                      <p className="flex justify-between">
                        <span>Payment Number:</span>
                        <span className="font-mono font-bold">{PAYMENT_NUMBER}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>Payment ID:</span>
                        <span className="font-mono font-bold text-xs">{paymentId}</span>
                      </p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-300 pt-3 text-center space-y-2">
                    <p className="text-green-700 font-semibold text-base">Thank you for using {COMPANY_NAME}!</p>
                    <p className="text-gray-600 text-sm">
                      We appreciate your business and trust in our services.
                    </p>
                  </div>

                  <div className="text-center pt-3 space-y-1">
                    <p className="font-semibold">Served by</p>
                    <p className="font-bold text-lg text-primary">{SERVED_BY}</p>
                    <p className="text-gray-600">Professional Service Provider</p>
                  </div>

                  <div className="border-t-2 border-gray-300 pt-3 text-center text-xs text-gray-600">
                    <p className="font-semibold text-blue-600">{BRAND_NAME}</p>
                    <p>{COMPANY_NAME} © {new Date().getFullYear()}</p>
                    <p>All rights reserved</p>
                    <p className="mt-1">For inquiries: {PAYMENT_NUMBER}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={downloadReceipt} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceipt;
