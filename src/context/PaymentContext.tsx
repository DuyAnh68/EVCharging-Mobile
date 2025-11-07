import { createContext, useContext, useState } from "react";

type PaymentContextType = {
  paymentResult: string | null;
  setPaymentResult: (res: string | null) => void;
};

const PaymentContext = createContext<PaymentContextType>({
  paymentResult: null,
  setPaymentResult: () => {},
});

export const PaymentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [paymentResult, setPaymentResult] = useState<string | null>(null);
  return (
    <PaymentContext.Provider value={{ paymentResult, setPaymentResult }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
