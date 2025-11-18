import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import alagaLogo from "@/assets/alaga-ayomi-logo.png";
import signature from "@/assets/signature.png";
import { toWords } from "number-to-words";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const receiptRef = useRef<HTMLDivElement>(null);

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



  const isFormComplete = () => {
    return (
      formData.receivedFrom.trim() !== "" &&
      formData.amountFigures.trim() !== "" &&
      formData.amountWords.trim() !== "" &&
      formData.paymentFor.trim() !== "" &&
      formData.amountCharged.trim() !== "" &&
      formData.advancePayment.trim() !== ""
    );
  };

  const handleViewReceipt = () => {
    navigate("/receipt-view", { state: formData });
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
      <div className="min-h-screen bg-muted p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Control Panel */}
        <div className="mb-6">
          <div className="bg-card rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-lg font-semibold">Receipt Generator</h2>
            <div className="flex gap-2">
              <Button onClick={handleViewReceipt} variant="outline" size="sm" disabled={!isFormComplete()}>
                <Eye className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
              <Button onClick={handleGenerateNew} size="sm">
                New Receipt
              </Button>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div ref={receiptRef} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-4">
          {/* Header with Logo and Title */}
        <div className="flex flex-row items-center justify-between mb-4 pb-2 border-b-2 border-secondary">
  <div className="flex items-center">
    <img
      src={alagaLogo}
      alt="Alaga Ayomi Logo"
      className="object-contain w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
    />
  </div>

            <div className="text-center md:text-right">
              <div className="inline-block bg-primary px-4 py-2 md:px-8 md:py-3 rounded-lg">
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

          {/* Form Fields */}
          <div className="space-y-2 md:space-y-4">
            {/* Received From */}
            <div className="flex items-center gap-2 md:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Received From:</Label>
              <div className="flex-1 border-b-2 border-primary">
                <Input
                  value={formData.receivedFrom}
                  onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                  placeholder="Enter payer name"
                />
              </div>
            </div>

            {/* Amount in Figures */}
            <div className="flex items-center gap-2 md:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount in Figures:</Label>
              <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
              <div className="flex-1 border-b-2 border-muted">
                <Input
                  value={formData.amountFigures}
                  onChange={(e) => setFormData({ ...formData, amountFigures: e.target.value })}
                  onBlur={(e) => setFormData({ ...formData, amountFigures: formatNumberWithCommas(e.target.value) })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                  placeholder="0.00"
                  type="text"
                />
              </div>
            </div>

            {/* Amount in Words */}
            <div className="flex items-center gap-2 md:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount in Words:</Label>
              <div className="flex-1 border-b-2 border-secondary">
                <Input
                  value={formData.amountWords}
                  onChange={(e) => setFormData({ ...formData, amountWords: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                  placeholder="Enter amount in words"
                />
              </div>
            </div>



            {/* Being Payment For */}
            <div className="flex items-center gap-2 md:gap-4">
              <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Being Payment For:</Label>
              <div className="flex-1 border-b-2 border-muted">
                <Input
                  value={formData.paymentFor}
                  onChange={(e) => setFormData({ ...formData, paymentFor: e.target.value })}
                  className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                  placeholder="Enter payment description"
                />
              </div>
            </div>

            {/* Amount Charged, Advance Payment, and Balance */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[160px]">Amount Charged:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formData.amountCharged}
                    onChange={(e) => setFormData({ ...formData, amountCharged: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, amountCharged: formatNumberWithCommas(e.target.value) })}
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[120px]">Advance Payment:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formData.advancePayment}
                    onChange={(e) => setFormData({ ...formData, advancePayment: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, advancePayment: formatNumberWithCommas(e.target.value) })}
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto text-xs md:text-sm"
                    placeholder="Enter advance"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                <Label className="text-xs md:text-base font-semibold min-w-[100px] md:min-w-[80px]">Balance:</Label>
                <span className="text-sm md:text-lg font-bold text-muted-foreground">₦</span>
                <div className="flex-1 border-b-2 border-muted">
                  <Input
                    value={formatNumberWithCommas(formData.balance)}
                    readOnly
                    className="border-0 focus-visible:ring-0 px-2 py-1 h-auto bg-muted/30 text-xs md:text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="flex justify-end mt-8">
              <div className="text-center">
                <img
                  src={signature}
                  alt="Signature"
                  className="w-32 h-16 object-contain"
                />
                <div className="border-t-2 border-primary mt-1 pt-1">
                  <span className="text-xs md:text-sm font-semibold">Authorized Signature</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Contact Info */}
          <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t-2 border-primary">
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
