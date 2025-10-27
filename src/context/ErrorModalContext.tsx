import { createContext, useContext, useState } from "react";
import ModalPopup from "@src/components/ModalPopup";
import { FontAwesome5 } from "@expo/vector-icons";

type ErrorModalContextType = {
  showError: (msg: string) => void;
};

const ErrorModalContext = createContext<ErrorModalContextType | null>(null);

export const ErrorModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  const showError = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}

      {visible && (
        <ModalPopup
          visible={visible}
          mode="toast"
          contentText={message}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="yellow"
          onClose={() => setVisible(false)}
          modalWidth={355}
        />
      )}
    </ErrorModalContext.Provider>
  );
};

export const useErrorModal = () => {
  const ctx = useContext(ErrorModalContext);
  if (!ctx) throw new Error("useErrorModal must be used inside ErrorModalProvider");
  return ctx;
};
