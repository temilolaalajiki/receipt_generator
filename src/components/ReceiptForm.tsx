import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Printer, Download } from "lucide-react";
import alagaLogo from "@/assets/alaga-ayomi-logo.png";
import signature from "@/assets/signature.png";
import { toWords } from "number-to-words";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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

export const ReceiptForm = () => {
  const isMobile = useIsMobile();

  const formatNumberWithCommas = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    if (!numericValue) return "";
    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const [receiptNo, setReceiptNo] = useState(1);
  const [formData, setFormData] = useState<ReceiptData>({
    receiptNo: 1,
    date: format(new Date(), "dd/MM/yyyy"),
    receivedFrom: "",
    amountFigures: "",
    amountWords: "",
    paymentMethod: [],
    paymentFor: "",
    amountCharged: "",
    advancePayment: "",
    balance: "",
  });

  useEffect(() => {
    const numericValue = formData.amountFigures.replace(/[^0-9.]/g, "");
    if (numericValue && !isNaN(parseFloat(numericValue))) {
      const amount = parseFloat(numericValue);
      const nairaAmount = Math.floor(amount);
      const koboAmount = Math.round((amount - nairaAmount) * 100);
      
      let wordsStr = toWords(nairaAmount).toUpperCase() + " NAIRA";
      if (koboAmount > 0) {
        wordsStr += " AND " + toWords(koboAmount).toUpperCase() + " KOBO";
      }
      wordsStr += " ONLY";
      
      setFormData((prev) => ({ ...prev, amountWords: wordsStr, amountCharged: formData.amountFigures }));
    } else if (!numericValue) {
      setFormData((prev) => ({ ...prev, amountWords: "", amountCharged: "" }));
    }
  }, [formData.amountFigures]);

  useEffect(() => {
    const charged = parseFloat(formData.amountCharged.replace(/[^0-9.]/g, "")) || 0;
    const advance = parseFloat(formData.advancePayment.replace(/[^0-9.]/g, "")) || 0;
    const calculatedBalance = charged - advance;
    
    if (calculatedBalance >= 0) {
      setFormData((prev) => ({ ...prev, balance: Math.round(calculatedBalance).toString() }));
    } else {
      setFormData((prev) => ({ ...prev, balance: "0" }));
    }
  }, [formData.amountCharged, formData.advancePayment]);

  const handlePaymentMethodToggle = (method: string) => {
    setFormData((prev) => {
      const methods = prev.paymentMethod.includes(method)
        ? prev.paymentMethod.filter((m) => m !== method)
        : [...prev.paymentMethod, method];
      return { ...prev, paymentMethod: methods };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateNew = () => {
    const newReceiptNo = receiptNo + 1;
    setReceiptNo(newReceiptNo);
    setFormData({
      receiptNo: newReceiptNo,
      date: format(new Date(), "dd/MM/yyyy"),
      receivedFrom: "",
      amountFigures: "",
      amountWords: "",
      paymentMethod: [],
      paymentFor: "",
      amountCharged: "",
      advancePayment: "",
      balance: "",
    });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print and (max-width: 768px) {
            @page {
              size: landscape;
            }
          }
        `
      }} />
      <div className="min-h-screen bg-muted p-4 md:p-8 print:bg-transparent print:p-0 print:min-h-0">
      <div className="max-w-6xl mx-auto print:max-w-full">
        {/* Control Panel - Hidden when printing */}
        <div className="mb-6 print:hidden">
          <div className="bg-card rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-lg font-semibold">Receipt Generator</h2>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleGenerateNew} size="sm">
                <Download className="w-4 h-4 mr-2" />
                New Receipt
              </Button>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-12 print:shadow-none print:rounded-none print:p-12 print:break-inside-avoid">
          {/* Header with Logo and Title */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-0 md:gap-0 mb-4 pb-2 border-b-2 border-secondary print:mb-4 print:pb-2 print:flex-row">
  <div className="flex items-center -mt-12 md:mt-0 md:-ml-16 md:-mt-28 print:-ml-16 print:-mt-28">
    <img
      src={alagaLogo}
      alt="Alaga Ayomi Logo"
      className="object-contain w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 print:w-72 print:h-72"
    />
  </div>

            <div className="text-center md:text-right">
              <div className="inline-block bg-primary px-4 py-2 md:px-8 md:py-3 rounded-lg print:px-8 print:py-3">
                <h2 className="text-base sm:text-lg md:text-2xl font-bold text-primary-foreground tracking-wide print:text-2xl whitespace-nowrap">
                  PAYMENT RECEIPT
                </h2>
              </div>
              <div className="mt-0 print:mt-0 flex flex-col items-center md:items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium print:text-sm">Receipt No:</span>
                  <span className="text-sm md:text-lg font-bold text-primary print:text-lg">
                    {String(formData.receiptNo).padStart(3, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm font-medium print:text-sm">Date:</span>
                  <span className="text-xs md:text-base font-semibold text-primary print:text-base">
                    {formData.date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-2 md:space-y-4 print:space-y-4">
            {/* Received From */}
            <div className="flex items-center gap-2 md:gap-4 print:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px] print:text-base print:min-w-[160px]">Received From:</Label>
              <div className="flex-1 border-b-2 border-primary">
                <Input
                  value={formData.receivedFrom}
                  onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto print:bg-transparent text-xs md:text-sm"
                  placeholder="Enter payer name"
                />
              </div>
            </div>

            {/* Amount in Figures */}
            <div className="flex items-center gap-2 md:gap-4 print:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px] print:text-base print:min-w-[160px]">Amount in Figures:</Label>
              <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
              <div className="flex-1 border-b-2 border-muted">
                <Input
                  value={formData.amountFigures}
                  onChange={(e) => setFormData({ ...formData, amountFigures: e.target.value })}
                  onBlur={(e) => setFormData({ ...formData, amountFigures: formatNumberWithCommas(e.target.value) })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto print:bg-transparent text-xs md:text-sm"
                  placeholder="0.00"
                  type="text"
                />
              </div>
            </div>

            {/* Amount in Words */}
            <div className="flex items-start gap-2 md:gap-4 print:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px] print:text-base print:min-w-[160px] pt-2">Amount in Words:</Label>
              <div className="flex-1 border-b-2 border-secondary">
                <Textarea
                  value={formData.amountWords}
                  onChange={(e) => setFormData({ ...formData, amountWords: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 min-h-[60px] resize-none print:bg-transparent text-xs md:text-sm"
                  placeholder="Enter amount in words"
                />
              </div>
            </div>



            {/* Being Payment For */}
            <div className="flex items-start gap-2 md:gap-4 print:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px] print:text-base print:min-w-[160px] pt-2">Being Payment For:</Label>
              <div className="flex-1 border-b-2 border-muted">
                <Textarea
                  value={formData.paymentFor}
                  onChange={(e) => setFormData({ ...formData, paymentFor: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 min-h-[60px] resize-none print:bg-transparent text-xs md:text-sm"
                  placeholder="Enter payment description"
                />
              </div>
            </div>

            {/* Amount Charged, Advance Payment, and Balance */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 print:flex-row print:gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px] print:text-base print:min-w-[160px]">Amount Charged:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formData.amountCharged}
                    onChange={(e) => setFormData({ ...formData, amountCharged: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, amountCharged: formatNumberWithCommas(e.target.value) })}
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto print:bg-transparent text-xs md:text-sm"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[120px] print:text-base print:min-w-[120px]">Advance Payment:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formData.advancePayment}
                    onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, advancePayment: formatNumberWithCommas(e.target.value) })}
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto print:bg-transparent text-xs md:text-sm"
                    placeholder="Enter advance"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[80px] print:text-base print:min-w-[80px]">Balance:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formatNumberWithCommas(formData.balance)}
                    readOnly
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto print:bg-transparent bg-muted/30 text-xs md:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-8 print:mt-8">
              <div className="text-center">
                <img
                  src={signature}
                  alt="Signature"
                  className="w-32 h-16 object-contain print:w-32 print:h-16"
                />
                <div className="border-t-2 border-primary mt-1 pt-1">
                  <span className="text-xs md:text-sm font-semibold print:text-sm">Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Contact Info */}
          <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t-2 border-primary print:mt-12 print:pt-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[11px] print:flex-row print:text-[11px] print:gap-3">
              <div className="flex items-center gap-1 text-center">
                <span className="font-semibold text-primary">Address:</span>
                <span>12 Christ Avenue, Fimeama, Abuloma 500101, Rivers, Nigeria</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">Phone:</span>
                <span>+234 806 722 8843</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">Email:</span>
                <span>showbukolorf@gmail.com</span>
              </div>
            </div>
            <div className="mt-2 md:mt-3 flex flex-col sm:flex-row items-center gap-2 md:gap-4 text-xs justify-center print:flex-row print:mt-3 print:text-sm print:gap-4">
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
