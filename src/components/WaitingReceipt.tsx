import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Download, Clock, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface WaitingReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: {
    id: string;
    client_name: string;
    service: string;
    category: string;
    ticket_number: string;
  };
  serviceRequest?: {
    id: string;
    client_name: string;
    description: string;
    ticket_number: string;
  };
}

const COMPANY_NAME = "DigiServe";
const BRAND_NAME = "Godswill Tech Solutions";
const SERVED_BY = "Godswill Robwet";
const SUPPORT_NUMBER = "+254708580506";

export const WaitingReceipt = ({
  isOpen,
  onClose,
  booking,
  serviceRequest,
}: WaitingReceiptProps) => {
  const [generating, setGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const receiptRef = useRef<HTMLDivElement>(null);

  // Use booking or serviceRequest data
  const receiptData = booking || serviceRequest;
  const isBooking = !!booking;

  // Generate receipt ID only once when dialog opens
  const receiptId = useMemo(() => {
    return `WR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }, [isOpen]);

  // Generate QR code for the ticket number
  useEffect(() => {
    if (receiptData?.ticket_number) {
      QRCode.toDataURL(receiptData.ticket_number, {
        errorCorrectionLevel: "M",
        type: "image/png",
        quality: 0.85,
        margin: 1,
        width: 200,
      })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error("QR Code generation failed:", err));
    }
  }, [receiptData?.ticket_number]);

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

      pdf.save(`waiting-receipt-${receiptData?.ticket_number || receiptId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (!receiptData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Waiting Receipt</DialogTitle>
        </DialogHeader>

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
                <p className="font-semibold text-orange-600">WAITING RECEIPT</p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex justify-center py-4">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-400">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Ticket QR Code"
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
                  <p className="font-mono font-bold">{receiptId}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Date Issued</p>
                  <p className="font-mono">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 pt-3">
                <p className="text-gray-600 font-semibold">Client Name</p>
                <p className="font-bold text-lg">{receiptData.client_name}</p>
              </div>

              <div className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                <p className="text-gray-600 font-semibold">Service Description</p>
                <p className="font-semibold">
                  {isBooking ? booking.service : serviceRequest?.description}
                </p>
                {isBooking && booking.category && (
                  <p className="text-xs text-gray-600">Category: {booking.category}</p>
                )}
              </div>

              {/* Waiting Information */}
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold text-blue-800">Waiting Information</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Your Waiting Number:</span>
                    <span className="font-bold text-xl text-blue-600 bg-white px-3 py-1 rounded border">
                      {receiptData.ticket_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Service will be completed within 24 hours</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Please keep this receipt. You will be contacted when your service is ready.
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 pt-3 text-center space-y-2">
                <p className="text-green-700 font-semibold text-base">Thank you for choosing {COMPANY_NAME}!</p>
                <p className="text-gray-600 text-sm">
                  We are processing your request and will contact you soon.
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
                <p className="mt-1">For inquiries: {SUPPORT_NUMBER}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
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
      </DialogContent>
    </Dialog>
  );
};

export default WaitingReceipt;