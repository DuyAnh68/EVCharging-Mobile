import { COLORS } from "@src/styles/theme";
import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoadingContextType = {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  resetLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const counterRef = useRef(0);

  const showLoading = () => {
    counterRef.current += 1;
    if (!isLoading) setIsLoading(true);
  };

  const hideLoading = () => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) setIsLoading(false);
  };

  const resetLoading = () => {
    counterRef.current = 0;
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{ isLoading, showLoading, hideLoading, resetLoading }}
    >
      <View style={{ flex: 1 }}>
        {children}

        {isLoading && (
          <View style={styles.overlay} pointerEvents="auto">
            <ActivityIndicator size="large" color={COLORS.primaryLighter} />
          </View>
        )}
      </View>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
});
