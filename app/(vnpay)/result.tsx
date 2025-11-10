import { FontAwesome5 } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { usePayment } from "@src/context/PaymentContext";
import { COLORS, TEXTS } from "@src/styles/theme";
import { formatVND } from "@src/utils/formatData";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function VNPayResult() {
  const { status, type, vehicleSubscriptionId, transactionNo, amount } =
    useLocalSearchParams<{
      status?: string;
      type?: string;
      vehicleSubscriptionId?: string;
      transactionNo?: string;
      amount?: string;
    }>();

  // Check
  const isSuccess = status === "success";

  // Hook
  const { resetPayment } = usePayment();

  // Handle logic
  const handleNavigate = () => {
    if (type === "createSub" || type === "updateSub")
      router.replace({
        pathname: "/(tabs)/vehicle",
        params: {
          type: type,
        },
      });
    else if (type === "charging_fee") router.replace("/(history)/invoice");
    else router.replace("/(tabs)");
    resetPayment();
  };

  return (
    <LinearGradient
      colors={isSuccess ? COLORS.gradient_5 : COLORS.gradient_6}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer]}>
          {isSuccess ? (
            <FontAwesome5
              name="check-circle"
              size={60}
              color={COLORS.success}
            />
          ) : (
            <FontAwesome5 name="times-circle" size={60} color={COLORS.danger} />
          )}
        </View>
        <Text style={[styles.title]}>
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </Text>

        {isSuccess ? (
          <>
            {transactionNo && (
              <View style={styles.row}>
                <Text style={styles.label}>Mã giao dịch: </Text>
                <Text style={styles.value}>{transactionNo}</Text>
              </View>
            )}
            {vehicleSubscriptionId && (
              <View style={styles.row}>
                <Text style={styles.label}>Mã gói đăng ký: </Text>
                <Text style={styles.value}>{vehicleSubscriptionId}</Text>
              </View>
            )}

            {amount && (
              <View style={styles.row}>
                <Text style={styles.label}>Số tiền: </Text>
                <Text style={styles.value}>{formatVND(amount)}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.value}>Vui lòng thử lại giao dịch.</Text>
        )}

        <View style={[styles.buttonContainer]}>
          <Button
            text="Quay lại"
            colorType="blue"
            onPress={handleNavigate}
            width={150}
            height={50}
            fontSize={16}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 35,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  label: {
    color: TEXTS.secondary,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: "600",
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});
