import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SubscriptionPlan } from "@src/types/subscription";
import { formatDuration, formatVND } from "@src/utils/formatData";
import { useState } from "react";
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
  subPlans: SubscriptionPlan[];
  onSelected: (subId: string) => void;
  onClose: () => void;
};

const SubPlanModal = ({ visible, subPlans, onSelected, onClose }: Props) => {
  // State
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  // Handle Logic
  const handleSelectPlan = (planId: string) => {
    // Nếu người dùng click lại vào cùng gói => bỏ chọn
    setSelectedPlan((prev) => (prev === planId ? "" : planId));
  };

  const handleClose = () => {
    onClose();
    setSelectedPlan("");
  };

  const handleSubmit = () => {
    onSelected(selectedPlan);
    onClose();
  };

  // Check valid
  const isModalValid = () => {
    return selectedPlan;
  };

  // Render
  const renderSubscriptionItem = ({ item }: { item: SubscriptionPlan }) => {
    const isSelected = selectedPlan === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleSelectPlan(item.id)}
        style={[styles.cardContainer, isSelected && styles.selectedCard]}
      >
        {/* Tên gói */}
        <Text style={styles.cardTitle}>{item.name}</Text>

        {/* Giá và giảm giá */}
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Giá:</Text>
          <Text style={styles.value}>{formatVND(item.price)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Giảm giá:</Text>
          <Text style={[styles.value, { color: COLORS.primary }]}>
            {item.discount}
          </Text>
        </View>

        {/* Chu kỳ thanh toán */}
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Thời hạn:</Text>
          <Text style={styles.value}>{formatDuration(item.billingCycle)}</Text>
        </View>

        {/* Mô tả gói */}
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  // UseEffect

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay nền mờ */}
      <View style={styles.overlay}>
        {/* Modal nội dung (bottom sheet) */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Chọn gói đăng ký</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.backContainer}
            >
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.listContainer}>
              <FlatList
                data={subPlans}
                renderItem={renderSubscriptionItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
              />
            </View>

            <View style={styles.btnContainer}>
              <Button
                text="Xác nhận"
                colorType={isModalValid() ? "primary" : "grey"}
                onPress={handleSubmit}
                disabled={!isModalValid()}
                width={260}
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
  selectedCard: {
    backgroundColor: COLORS.green50,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
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
  description: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.gray700,
    lineHeight: 18,
  },
  btnContainer: {
    marginTop: 10,
    marginHorizontal: "auto",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: -5,
  },
});

export default SubPlanModal;
