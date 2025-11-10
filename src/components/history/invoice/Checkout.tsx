import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { COLORS, TEXTS } from "@src/styles/theme";
import { Invoice } from "@src/types/invoice";
import { formatRoundedAmount } from "@src/utils/formatData";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  invoices?: Invoice[];
  total: number;
  onClose: () => void;
  onPaymentPress: () => void;
};

const Checkout = ({
  visible,
  invoices,
  total,
  onClose,
  onPaymentPress,
}: Props) => {
  // Handle logic
  const handleClose = () => {
    onClose();
  };

  const handlePaymentPress = () => {
    onPaymentPress();
  };

  // Render
  const renderSubscriptionItem = ({ item }: { item: Invoice }) => {
    return (
      <View style={[styles.cardContainer]}>
        {/* Biển số xe */}
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Biển số xe:</Text>
          <Text style={styles.value}>{item.vehicle.plateNumber}</Text>
        </View>

        {/* Hãng */}
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Hãng:</Text>
          <Text style={[styles.value]}>{item.vehicle.model}</Text>
        </View>

        {/* Tiền */}
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Tiền:</Text>
          <Text style={styles.value}>
            {formatRoundedAmount(item.totalAmount, { asString: true })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay nền mờ */}
      <View style={styles.overlay}>
        {/* Modal nội dung */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Tổng các hóa đơn</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.backContainer}
            >
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            <View style={styles.listContainer}>
              <FlatList
                data={invoices}
                renderItem={renderSubscriptionItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
              />
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng tiền</Text>
              <Text style={styles.totalValue}>
                {formatRoundedAmount(total, { asString: true })}
              </Text>
            </View>

            <View style={styles.btnContainer}>
              <Button
                text="Thanh toán"
                colorType="primary"
                onPress={handlePaymentPress}
                width={280}
                height={50}
                fontSize={18}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: 100,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    width: "90%",
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXTS.white,
    textAlign: "center",
  },
  backContainer: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 8,
    maxHeight: 400,
  },
  list: {
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.green300,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    padding: 8,
    width: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.secondary,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  value: {
    fontSize: 14,
    color: TEXTS.primary,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 5,
    paddingHorizontal: 16,
  },
  totalLabel: {
    color: TEXTS.secondary,
    fontSize: 18,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  btnContainer: {
    marginTop: 15,
    marginHorizontal: "auto",
  },
});

export default Checkout;
