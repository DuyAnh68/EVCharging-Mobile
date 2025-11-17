import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "@src/components/Button";
import { Card } from "@src/components/history/invoice/Card";
import Checkout from "@src/components/history/invoice/Checkout";
import Detail from "@src/components/history/invoice/Detail";
import EmptyState from "@src/components/history/invoice/EmptyState";
import FilterStatus from "@src/components/history/invoice/FilterStatus";
import LoadingOverlay from "@src/components/LoadingOverlay";
import ModalPopup from "@src/components/ModalPopup";
import { useAuthContext } from "@src/context/AuthContext";
import { useLoading } from "@src/context/LoadingContext";
import { usePayment } from "@src/context/PaymentContext";
import { useInvoice } from "@src/hooks/useInvoice";
import { COLORS, TEXTS } from "@src/styles/theme";
import type {
  Invoice,
  InvoiceResponse,
  PayForChargingReq,
} from "@src/types/invoice";
import { calcTotalAmount } from "@src/utils/calculateData";
import { formatRoundedAmount } from "@src/utils/formatData";
import { router, useFocusEffect } from "expo-router";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const InvoiceScreen = () => {
  // State
  const [data, setData] = useState<InvoiceResponse>();
  const invoices = data?.invoices || [];
  const summary = data?.summary;
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );
  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<Invoice | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [selectedInvoiceList, setSelectedInvoiceList] = useState<
    Invoice[] | null
  >(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const totalOfList =
    selectedInvoiceList && selectedInvoiceList?.length > 0
      ? calcTotalAmount(selectedInvoiceList || [])
      : 0;
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  // Hook
  const { user } = useAuthContext();
  const { isLoading } = useLoading();
  const {
    getInvoices,
    getInvoiceDetail,
    payForCharging,
    isLoading: invoiceLoading,
  } = useInvoice();
  const { paymentResult, setPaymentResult, isBack, setIsBack } = usePayment();

  // Api
  const fetchInvoices = useCallback(async () => {
    if (!user) return;
    const res = await getInvoices(user?.userId, filterStatus);

    if (res.success && res.invoices) {
      setData(res.invoices);
      return;
    }

    setErrorMsg(res.message || "Không thể lấy danh sách giao dịch!");
    setShowError(true);
  }, [user, filterStatus]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInvoices();
    setRefreshing(false);
  }, [fetchInvoices]);

  const fetchInvoiceDetail = useCallback(
    async (invoiceId: string) => {
      const res = await getInvoiceDetail(invoiceId);

      if (res.success && res.invoice) {
        return res.invoice;
      }

      setErrorMsg(res.message || "Không thể lấy chi tiết giao dịch!");
      setShowError(true);
    },
    [getInvoiceDetail]
  );

  // Handle logic
  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleConfirmError = () => {
    fetchInvoices();
    setShowError(false);
    setErrorMsg("");
  };

  const handleAddPaymentPress = () => {
    setIsPayment((prev) => {
      const newValue = !prev;
      setFilterStatus(newValue ? "unpaid" : undefined);
      if (!newValue) setSelectedInvoiceIds([]);
      return newValue;
    });
  };

  const handleFilterSelected = (status: string) => {
    setFilterStatus((prev) => (prev === status ? undefined : status));
  };

  const handleInvoicePress = async (invoiceId: string) => {
    if (isPayment) {
      setSelectedInvoiceIds((prevIds) => {
        let newIds;
        if (prevIds.includes(invoiceId)) {
          newIds = prevIds.filter((id) => id !== invoiceId);
        } else {
          newIds = [...prevIds, invoiceId];
        }

        // Cập nhật list hóa đơn đã chọn
        const newList = invoices.filter((inv) =>
          newIds.includes(inv.invoice.id)
        );
        setSelectedInvoiceList(newList);

        return newIds;
      });
    } else {
      const invoiceData = await fetchInvoiceDetail(invoiceId);
      if (invoiceData) {
        setSelectedInvoiceData(invoiceData);
        setShowDetail(true);
      }
    }
  };

  const handleSelectAll = () => {
    const unpaidInvoices = invoices.filter(
      (item) => item.payment.paymentStatus === "unpaid"
    );

    const unpaidIds = unpaidInvoices.map((item) => item.invoice.id);

    setSelectedInvoiceIds(unpaidIds);
    setSelectedInvoiceList(unpaidInvoices);
  };

  const handleDeselectAll = () => {
    setSelectedInvoiceIds([]);
  };

  const handleCloseDetail = (isPay: boolean) => {
    setShowDetail(false);
    if (isPay) return;
    setSelectedInvoiceData(null);
  };

  const handlePayment = async () => {
    if (!user) return;

    const invoiceIds = selectedInvoiceData
      ? [selectedInvoiceData.invoice.id]
      : selectedInvoiceIds;

    const totalAmount = selectedInvoiceData
      ? formatRoundedAmount(selectedInvoiceData.pricing.chargingFee)
      : calcTotalAmount(selectedInvoiceList || []);

    const payload: PayForChargingReq = {
      userId: user?.userId,
      invoiceIds,
      amount: totalAmount + 10000,
    };

    const res = await payForCharging(payload);

    if (!res.success) {
      setMsg(res.message);
      setShowMsg(true);
    }

    resetSelectedInvoice();
  };

  const handleShowCheckout = () => {
    setShowCheckout(true);
  };

  const handleCheckoutConfirm = () => {
    handlePayment();
    setShowCheckout(false);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  const resetSelectedInvoice = () => {
    if (selectedInvoiceData) {
      setSelectedInvoiceData(null);
    } else {
      setSelectedInvoiceIds([]);
      setSelectedInvoiceList(null);
    }
  };

  // Check
  const hasSelectedInvoice = selectedInvoiceIds.length > 0;
  const isNoUnpaid = (summary?.unpaid?.count ?? 0) === 0;
  const isCompany = user?.isCompany;

  // UseEffect
  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  // UseFocusEffect
  useFocusEffect(
    useCallback(() => {
      // Kiểm tra paymentResult chỉ khi screen này được focus
      if (paymentResult === "success") {
        setFilterStatus(undefined);
        setIsPayment(false);
        fetchInvoices();
        setPaymentResult(null);
      }

      if (paymentResult === "failed" || isBack) {
        setMsg("Thanh toán thất bại. Vui lòng thử lại sau.");
        setShowMsg(true);
        setFilterStatus(undefined);
        setIsPayment(false);
        setPaymentResult(null);
        setIsBack(false);
        fetchInvoices();
      }
    }, [paymentResult, isBack])
  );

  // Render
  const renderItem = ({ item }: { item: Invoice }) => (
    <Card
      invoice={item}
      onPress={handleInvoicePress}
      isPayment={isPayment}
      isSelected={selectedInvoiceIds.includes(item.invoice.id)}
    />
  );

  return (
    <View style={styles.container}>
      {invoiceLoading && <LoadingOverlay />}
      {/* Header */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backContainer} onPress={handleBack}>
          <Ionicons name="chevron-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Thanh toán phí sạc</Text>

        {isCompany ? (
          <View></View>
        ) : (
          <TouchableOpacity
            onPress={handleAddPaymentPress}
            disabled={isNoUnpaid}
            style={isNoUnpaid && { opacity: 0.5 }}
          >
            <MaterialCommunityIcons
              name="credit-card-plus"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      {summary && (
        <View style={styles.filterContainer}>
          <FilterStatus
            summary={summary}
            selected={filterStatus}
            onSelect={handleFilterSelected}
            isPayment={isPayment}
          />
        </View>
      )}

      {/* Payment Selected */}
      {isPayment && (
        <View style={styles.paymentContainer}>
          <View style={styles.paymentIconContainer}>
            <TouchableOpacity
              style={styles.paymentRow}
              onPress={handleSelectAll}
            >
              <MaterialCommunityIcons
                name="credit-card-check"
                size={24}
                color={COLORS.success}
              />

              <Text style={styles.paymentLabel}>Chọn tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.paymentRow}
              onPress={handleDeselectAll}
            >
              <MaterialCommunityIcons
                name="credit-card-remove"
                size={24}
                color={COLORS.danger}
              />

              <Text style={styles.paymentLabel}>Bỏ chọn</Text>
            </TouchableOpacity>
          </View>
          <Button
            text={`Thanh toán (${selectedInvoiceIds.length})`}
            colorType={hasSelectedInvoice ? "primary" : "grey"}
            onPress={() => {
              handleShowCheckout();
            }}
            disabled={!hasSelectedInvoice}
            width={150}
            height={40}
            fontSize={15}
          />
        </View>
      )}

      {/* Invoice List */}
      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item) => item.invoice.id}
        ListEmptyComponent={
          !isLoading ? <EmptyState filter={filterStatus} /> : null
        }
        contentContainerStyle={
          invoices.length === 0 ? styles.flatListEmpty : styles.listcontainer
        }
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Invoice Detail */}
      {showDetail && selectedInvoiceData && (
        <>
          <View style={styles.overlay} />
          <Detail
            visible={showDetail}
            invoice={selectedInvoiceData}
            onPaymentPress={handlePayment}
            onClose={handleCloseDetail}
          />
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedInvoiceList && (
        <Checkout
          visible={showCheckout}
          invoices={selectedInvoiceList}
          total={totalOfList}
          onPaymentPress={handleCheckoutConfirm}
          onClose={handleCloseCheckout}
        />
      )}

      {/* Toast Modal */}
      {showError && (
        <ModalPopup
          visible={showError}
          mode="confirm"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          confirmBtnText="Thử lại"
          confirmBtnColor="blue"
          cancelBtnText="Đóng"
          cancelBtnColor="grey"
          onClose={() => {
            setShowError(false);
            setErrorMsg("");
          }}
          onConfirm={handleConfirmError}
          modalWidth={355}
        />
      )}

      {showMsg && (
        <ModalPopup
          visible={showMsg}
          mode="noti"
          contentText={msg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          onClose={() => {
            setShowMsg(false);
            setMsg("");
          }}
          modalWidth={355}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXTS.white,
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: TEXTS.white,
  },
  backContainer: {
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    marginVertical: 10,
    maxHeight: 85,
    minHeight: 85,
  },
  paymentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    alignItems: "center",
  },
  paymentIconContainer: {
    flexDirection: "row",
    gap: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  paymentLabel: {
    fontSize: 15,
    color: TEXTS.secondary,
    fontWeight: "500",
  },
  listcontainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
  },
});

export default InvoiceScreen;
