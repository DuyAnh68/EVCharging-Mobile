import { Ionicons } from "@expo/vector-icons";
import { COLORS, TEXTS } from "@src/styles/theme";
import { VehicleDetail } from "@src/types/vehicle";
import {
  formatDateTime,
  formatDuration,
  formatVND,
} from "@src/utils/formatData";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  vehicle: VehicleDetail;
  onClose: () => void;
};

const Detail = ({ visible, vehicle, onClose }: Props) => {
  // State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // UseEffect
  useEffect(() => {
    if (vehicle.subscription) {
      const { date: startDateFormatted } = formatDateTime(
        vehicle.subscription.startDate
      );
      const { date: endDateFormatted } = formatDateTime(
        vehicle.subscription.endDate
      );

      setStartDate(startDateFormatted);
      setEndDate(endDateFormatted);
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [vehicle.subscription]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Chi tiết</Text>
            <TouchableOpacity onPress={onClose} style={styles.backContainer}>
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ScrollView
              style={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Basic Info */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Thông tin xe</Text>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Biển số xe</Text>
                  <Text style={styles.detailValue}>{vehicle.plateNumber}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Hãng xe</Text>
                  <Text style={styles.detailValue}>{vehicle.model}</Text>
                </View>

                <View style={[styles.detailItem, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Dung lượng pin</Text>
                  <Text style={styles.detailValue}>
                    {vehicle.batteryCapacity} kW
                  </Text>
                </View>
              </View>

              {/* Subscription Info */}
              {vehicle.subscription && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Thông tin gói đăng ký</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tên gói</Text>
                    <Text style={styles.detailValue}>
                      {vehicle.subscription.plan.name}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Giá</Text>
                    <Text style={styles.detailValue}>
                      {formatVND(vehicle.subscription.plan.price)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Giảm giá</Text>
                    <Text style={styles.detailValue}>
                      {vehicle.subscription.plan.discount}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Thời hạn</Text>
                    <Text style={styles.detailValue}>
                      {formatDuration(vehicle.subscription.plan.billingCycle)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Ngày bắt đầu</Text>
                    <Text style={styles.detailValue}>{startDate}</Text>
                  </View>

                  <View
                    style={[
                      styles.detailItem,
                      !vehicle.company && { marginBottom: 60 },
                      { borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={styles.detailLabel}>Ngày kết thúc</Text>
                    <Text style={styles.detailValue}>{endDate}</Text>
                  </View>
                </View>
              )}

              {/* Company Info */}
              {vehicle.company && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Thông tin công ty</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tên công ty</Text>
                    <Text style={styles.detailValue}>
                      {vehicle.company.name}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Địa chỉ</Text>
                    <Text style={styles.detailValue}>
                      {vehicle.company.address}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.detailItem,
                      { marginBottom: 60, borderBottomWidth: 0 },
                    ]}
                  >
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>
                      {vehicle.company.email}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    overflow: "hidden",
  },
  modalContent: {
    paddingHorizontal: 20,
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
  detailContent: {
    paddingTop: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  detailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  detailLabel: {
    fontSize: 12,
    color: TEXTS.secondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXTS.primary,
  },
});

export default Detail;
