import { createContext, useContext, useState } from "react";

type PaymentContextType = {
  paymentUrl: string | null;
  setPaymentUrl: (url: string | null) => void;
  paymentResult: string | null;
  setPaymentResult: (res: string | null) => void;
  type: string | null;
  setType: (value: string | null) => void;
  resetPayment: () => void;
  isBack: boolean;
  setIsBack: (value: boolean) => void;
};

const PaymentContext = createContext<PaymentContextType>({
  paymentUrl: null,
  setPaymentUrl: () => {},
  paymentResult: null,
  setPaymentResult: () => {},
  type: null,
  setType: () => {},
  resetPayment: () => {},
  isBack: false,
  setIsBack: () => {},
});

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [isBack, setIsBack] = useState(false);

  const handleSetIsBack = (value: boolean) => {
    if (value) {
      setIsBack(true);
    } else {
      setIsBack(false);
    }
  };

  const resetPayment = () => {
    setPaymentUrl(null);
  };

  return (
    <PaymentContext.Provider
      value={{
        paymentUrl,
        setPaymentUrl,
        paymentResult,
        setPaymentResult,
        type,
        setType,
        resetPayment,
        isBack,
        setIsBack: handleSetIsBack,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
