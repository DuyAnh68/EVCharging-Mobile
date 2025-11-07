import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { COLORS, TEXTS } from "@src/styles/theme";
import { InvoiceDetail } from "@src/types/invoice";
import { calcChargingDuration } from "@src/utils/calculateData";
import { formatDateTime, formatVND } from "@src/utils/formatData";
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
  invoice: InvoiceDetail;
  onClose: () => void;
};

const Detail = ({ visible, invoice, onClose }: Props) => {
  // State
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTimeFormatted] = useState<string>("");
  const [endTime, setEndTimeFormatted] = useState<string>("");
  const [startTimeWithSeconds, setStartTimeWithSeconds] = useState<string>("");
  const [endTimeWithSeconds, setEndTimeWithSeconds] = useState<string>("");

  // Use Effect
  useEffect(() => {
    if (invoice) {
      const { dateWithMinute: invoiceDateFormatted } = formatDateTime(
        invoice.invoice.createdAt
      );
      const {
        date: startDate,
        time: startTimeFormated,
        timeWithSeconds: startTimeFull,
      } = formatDateTime(invoice.session.startTime);
      const { time: endTimeFormated, timeWithSeconds: endTimeFull } =
        formatDateTime(invoice.session.endTime);

      setFormattedDate(invoiceDateFormatted);
      setStartDate(startDate);
      setStartTimeFormatted(startTimeFormated);
      setEndTimeFormatted(endTimeFormated);
      setStartTimeWithSeconds(startTimeFull);
      setEndTimeWithSeconds(endTimeFull);
    }
  }, [invoice]);

  // Tính duration
  const timeDisplay = calcChargingDuration(
    startTimeWithSeconds,
    endTimeWithSeconds
  );

  // Check
  const isPaid = invoice.payment.status === "paid";

  // HandleLogic
  const handlePaymentPress = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Hóa đơn</Text>
            <TouchableOpacity onPress={onClose} style={styles.backContainer}>
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <ScrollView
              style={styles.detailContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Invoice Info */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Thông tin hóa đơn</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mã hóa đơn</Text>
                  <Text style={styles.detailValue}>{invoice.invoice.id}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Ngày tạo</Text>
                  <Text style={styles.detailValue}>{formattedDate}</Text>
                </View>
              </View>

              {/* Station Info */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Thông tin trạm sạc</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tên trạm</Text>
                  <Text style={styles.detailValue}>{invoice.station.name}</Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Địa chỉ</Text>
                  <Text style={styles.detailValue}>
                    {invoice.station.address}
                  </Text>
                </View>
              </View>

              {/* Vehicle Info */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Thông tin xe</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hãng xe</Text>
                  <Text style={styles.detailValue}>
                    {invoice.vehicle.model}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Biển số xe</Text>
                  <Text style={styles.detailValue}>
                    {invoice.vehicle.plateNumber}
                  </Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Dung lượng pin</Text>
                  <Text style={styles.detailValue}>
                    {invoice.vehicle.batteryCapacity}
                  </Text>
                </View>
              </View>

              {/* Session Info */}
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Thông tin phiên sạc</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ngày</Text>
                  <Text style={styles.detailValue}>{startDate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thời gian</Text>
                  <Text style={styles.detailValue}>
                    {startTime} - {endTime}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Thời lượng</Text>
                  <Text style={styles.detailValue}>{timeDisplay}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pin</Text>
                  <Text style={styles.detailValue}>
                    {invoice.session.initialBattery} -{" "}
                    {invoice.session.finalBattery}
                  </Text>
                </View>

                <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>Lượng pin sạc được</Text>
                  <Text style={styles.detailValue}>
                    {invoice.session.batteryCharged}
                  </Text>
                </View>
              </View>

              {/* Pricing Info */}
              <View style={styles.divider} />
              <View
                style={[styles.detailSection, isPaid && { marginBottom: 80 }]}
              >
                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Lượng điện đã xài</Text>
                  <Text style={styles.feeValue}>
                    {invoice.session.energyDelivered}
                  </Text>
                </View>

                <View style={styles.feeRow}>
                  <Text style={styles.feeLabel}>Giá/kWh</Text>
                  <Text style={styles.feeValue}>
                    {formatVND(invoice.pricing.price)}
                  </Text>
                </View>

                {isPaid ? (
                  <>
                    <View style={styles.feeRow}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Text style={styles.feeLabel}>Phí sạc</Text>
                        <Text style={{ fontSize: 8, color: TEXTS.secondary }}>
                          (Lượng điện x Giá)
                        </Text>
                      </View>
                      <Text style={styles.feeValue}>
                        {formatVND(invoice.pricing.charging_fee)}
                      </Text>
                    </View>
                    <View style={styles.feeRow}>
                      <Text style={styles.feeLabel}>Phí đặt chỗ</Text>
                      <Text style={styles.feeValue}>
                        {formatVND(invoice.pricing.baseFee)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.detailRow,
                        styles.totalRow,
                        { borderBottomWidth: 0 },
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Text style={styles.totalLabel}>Tổng tiền</Text>
                        <Text style={{ fontSize: 9, color: COLORS.primary }}>
                          (Phí sạc + Phí đặt chỗ)
                        </Text>
                      </View>
                      <Text style={styles.totalValue}>
                        {formatVND(invoice.pricing.total_amount)}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={[
                      styles.detailRow,
                      styles.totalRow,
                      { borderBottomWidth: 0 },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Text style={styles.totalLabel}>Tổng tiền</Text>
                      <Text style={{ fontSize: 9, color: COLORS.primary }}>
                        (Lượng điện x Giá)
                      </Text>
                    </View>
                    <Text style={styles.totalValue}>
                      {formatVND(invoice.pricing.charging_fee)}
                    </Text>
                  </View>
                )}
              </View>

              {!isPaid && (
                <View style={styles.btnContainer}>
                  <Button
                    text="Thanh toán"
                    colorType="primary"
                    onPress={() => {
                      handlePaymentPress();
                    }}
                    width={300}
                    height={50}
                    fontSize={18}
                  />
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
    maxHeight: "85%",
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
  detailRow: {
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
  divider: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginBottom: 12,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  feeLabel: {
    fontSize: 11,
    color: TEXTS.secondary,
    fontWeight: "500",
  },
  feeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXTS.primary,
  },
  totalRow: {
    marginTop: 7,
    backgroundColor: COLORS.green50,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  btnContainer: {
    marginBottom: 85,
    marginHorizontal: "auto",
  },
});

export default Detail;
