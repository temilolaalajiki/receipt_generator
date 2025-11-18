import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import alagaLogo from "@/assets/alaga-ayomi-logo.png";
import signature from "@/assets/signature.png";
import html2canvas from "html2canvas";

interface ReceiptData {
  receiptNo: number;
  date: string;
  receivedFrom: string;
  amountFigures: string;
  amountWords: string;
  paymentMethod: string[];
  paymentFor: string;
  amountCharged: string;
  advancePayment: string;
  balance: string;
}

const ReceiptView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const formData = location.state as ReceiptData;

  if (!formData) {
    return (
      <div className="min-h-screen bg-muted p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No receipt data found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    if (!numericValue) return "";
    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      // Detect device width and set scale accordingly
      const width = window.innerWidth;
      let scale: number;
      if (width < 480) {
        scale = 1.6; // Small phones
      } else if (width < 768) {
        scale = 2.0; // Large phones
      } else if (width < 1024) {
        scale = 2.5; // Tablets
      } else {
        scale = 3; // Desktop
      }

      // Add class for PNG-specific styling
      receiptRef.current.classList.add('png-download');

      const canvas = await html2canvas(receiptRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        logging: false,
      });

      // Remove class after capture
      receiptRef.current.classList.remove('png-download');

      // Create download link for the image
      const link = document.createElement('a');
      link.download = `receipt-${String(formData.receiptNo).padStart(3, "0")}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      // Ensure classes are removed on error
      if (receiptRef.current) {
        receiptRef.current.classList.remove('png-download');
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
.png-download img.logo {
  width: 180px !important;
  height: auto !important;
  object-fit: contain !important;
  margin-left: -20px !important;
}

          .png-download .px-2.py-1 {
  padding-top: 6px !important;
  padding-bottom: 10px !important;
  line-height: 2.35 !important;
}

.mobile-landscape {
  transform: rotate(90deg) !important;
  transform-origin: center !important;
}
        `
      }} />
      <div className="min-h-screen bg-muted p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Control Panel */}
          <div className="mb-6">
            <div className="bg-card rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-lg font-semibold">Receipt Preview</h2>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/")} variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
                <Button onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </div>
            </div>
          </div>

          {/* Receipt */}
          <div ref={receiptRef} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-4">
            {/* Header with Logo and Title */}
            <div className="flex flex-row items-center justify-between mb-4 pb-2 border-b-2 border-secondary">
              <div className="flex items-center">
                {/* <img
                  src={alagaLogo}
                  alt="Alaga Ayomi Logo"
                  className="object-contain w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 print:w-56 print:h-56"
                /> */}
                <img
  src={alagaLogo}
  alt="Alaga Ayomi Logo"
  className="h-40 w-auto sm:h-48 md:h-56 object-contain logo"
/>
              </div>

              <div className="text-center md:text-right">
                <div className="bg-primary px-4 py-2 md:px-8 md:py-3 rounded-lg">
                  <h2 className="text-base sm:text-lg md:text-2xl font-bold text-primary-foreground tracking-wide whitespace-nowrap">
                    PAYMENT RECEIPT
                  </h2>
                </div>
                <div className="mt-0 flex flex-col items-center md:items-end gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-medium">Receipt No:</span>
                    <span className="text-sm md:text-lg font-bold text-primary">
                      {String(formData.receiptNo).padStart(3, "0")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-medium">Date:</span>
                    <span className="text-xs md:text-base font-semibold text-primary">
                      {formData.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields - Read Only */}
            <div className="space-y-2 md:space-y-4">
              {/* Received From */}
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Received From:</span>
                <div className="flex-1 border-b-2 border-primary">
                  <span className="px-2 py-1 text-xs md:text-sm leading-tight" style={{ marginTop: '-4px' }}>{formData.receivedFrom || "Not specified"}</span>
                </div>
              </div>

              {/* Amount in Figures */}
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount in Figures:</span>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <span className="px-2 py-1 text-xs md:text-sm leading-tight" style={{ marginTop: '-4px' }}>{formData.amountFigures || "0.00"}</span>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount in Words:</span>
                <div className="flex-1 border-b-2 border-secondary">
                  <span className="px-2 py-1 text-xs md:text-sm leading-tight" style={{ marginTop: '-4px' }}>{formData.amountWords || "Not specified"}</span>
                </div>
              </div>

              {/* Being Payment For */}
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Being Payment For:</span>
                <div className="flex-1 border-b-2 border-muted">
                  <span className="px-2 py-1 text-xs md:text-sm leading-tight" style={{ marginTop: '-4px' }}>{formData.paymentFor || "Not specified"}</span>
                </div>
              </div>

              {/* Amount Charged, Advance Payment, and Balance */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                  <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount Charged:</span>
                  <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                  <div className="flex-1 border-b-2 border-muted">
                    <span className="px-2 py-1 text-xs md:text-sm">{formData.amountCharged || "0.00"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                  <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[120px]">Advance Payment:</span>
                  <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                  <div className="flex-1 border-b-2 border-muted">
                    <span className="px-2 py-1 text-xs md:text-sm">{formData.advancePayment || "0.00"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                  <span className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[80px]">Balance:</span>
                  <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                  <div className="flex-1 border-b-2 border-muted">
                    <span className="px-2 py-1 text-xs md:text-sm">{formatNumberWithCommas(formData.balance) || "0"}</span>
                  </div>
                </div>
              </div>

              {/* Signature */}
              <div className="flex justify-end mt-8">
                <div className="text-center">
                  <img
                    src={signature}
                    alt="Signature"
                    className="w-24 h-12 object-contain"
                  />
                  <div className="border-t-2 border-primary mt-1">
                    <span className="text-xs md:text-sm font-semibold">Authorized Signature</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Contact Info */}
            <div className="mt-4 md:mt-12 pt-4 md:pt-6 border-t-2 border-primary">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[11px]">
                <div className="flex items-center gap-1 text-center">
                  <span className="font-semibold text-primary">Address:</span>
                  <span>12 Christ Avenue, Fimeama, Abuloma 500101, Rivers, Nigeria</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary">Phone:</span>
                  <span>+234 806 722 8843</span>
                </div> */}
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary">Email:</span>
                  <span>showbukolorf@gmail.com</span>
                </div>
              </div>
              <div className="mt-2 md:mt-3 flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-xs justify-center">
                <div className="flex items-center gap-1">
                  <span>📷</span>
                  <span>@alaga_ayomi</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💬</span>
                  <span>+234 806 722 8843</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptView;
