import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import LoadingOverlay from "@src/components/LoadingOverlay";
import ModalPopup from "@src/components/ModalPopup";
import { useInvoice } from "@src/hooks/useInvoice";
import { COLORS, TEXTS } from "@src/styles/theme";
import { InvoiceDetail } from "@src/types/invoice";
import { calcChargingDuration } from "@src/utils/calculateData";
import {
  formatDateTime,
  formatRoundedAmount,
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
  invoice: InvoiceDetail;
  onPaymentPress: () => void;
  onClose: (isPay: boolean) => void;
};

const Detail = ({ visible, invoice, onPaymentPress, onClose }: Props) => {
  // State
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTimeFormatted] = useState<string>("");
  const [endTime, setEndTimeFormatted] = useState<string>("");
  const [startTimeWithSeconds, setStartTimeWithSeconds] = useState<string>("");
  const [endTimeWithSeconds, setEndTimeWithSeconds] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState<boolean>(false);

  // Hook
  const { isLoading } = useInvoice();

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
  const isActive = invoice.vehicle.isActive;

  // HandleLogic
  const handlePaymentPress = () => {
    setShowCheckout(true);
  };

  const handleCheckoutConfirm = () => {
    onPaymentPress();
    onClose(true);
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {isLoading && <LoadingOverlay />}
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={handleClose} />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Hóa đơn</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.backContainer}
            >
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
                <View>
                  <Text style={styles.sectionTitle}>Thông tin xe</Text>
                  {!isActive && (
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: COLORS.danger + "20" },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: COLORS.danger },
                        ]}
                      />
                      <Text
                        style={[styles.statusText, { color: COLORS.danger }]}
                      >
                        Xe bị xóa
                      </Text>
                    </View>
                  )}
                </View>
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
                        {formatRoundedAmount(invoice.pricing.total_amount, {
                          asString: true,
                        })}
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
                      {formatRoundedAmount(invoice.pricing.charging_fee, {
                        asString: true,
                      })}
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

      {/* Checkout Modal */}
      {showCheckout && (
        <ModalPopup
          visible={showCheckout}
          mode="confirm"
          titleText="Xác nhận thanh toán"
          contentText="Bạn có chắc chắn sẽ thanh toán hóa đơn này không?"
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="yellow"
          confirmBtnText="Thanh toán"
          confirmBtnColor="green"
          cancelBtnText="Đóng"
          cancelBtnColor="grey"
          onClose={() => {
            setShowCheckout(false);
          }}
          onConfirm={handleCheckoutConfirm}
          modalWidth={355}
        />
      )}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    position: "absolute",
    right: 0,
    top: -5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
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
