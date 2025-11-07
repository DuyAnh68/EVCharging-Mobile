import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "@src/components/Button";
import { Card } from "@src/components/history/invoice/Card";
import Detail from "@src/components/history/invoice/Detail";
import EmptyState from "@src/components/history/invoice/EmptyState";
import FilterStatus from "@src/components/history/invoice/FilterStatus";
import ModalPopup from "@src/components/ModalPopup";
import { useAuthContext } from "@src/context/AuthContext";
import { useLoading } from "@src/context/LoadingContext";
import { useInvoice } from "@src/hooks/useInvoice";
import { COLORS, TEXTS } from "@src/styles/theme";
import type {
  Invoice,
  InvoiceDetail,
  InvoiceResponse,
} from "@src/types/invoice";
import { router } from "expo-router";
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
    useState<InvoiceDetail | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [isPayment, setIsPayment] = useState<boolean>(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string[]>([]);

  // Hook
  const { user } = useAuthContext();
  const { isLoading } = useLoading();
  const { getInvoices, getInvoiceDetail } = useInvoice();

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
      if (!newValue) setSelectedInvoiceId([]);
      return newValue;
    });
  };

  const handleFilterSelected = (status: string) => {
    setFilterStatus((prev) => (prev === status ? undefined : status));
  };

  const handleInvoicePress = async (invoiceId: string) => {
    if (isPayment) {
      setSelectedInvoiceId((prev) => {
        if (prev.includes(invoiceId)) {
          // nếu đã chọn rồi thì bỏ chọn
          return prev.filter((itemId) => itemId !== invoiceId);
        } else {
          // nếu chưa có thì thêm vào
          return [...prev, invoiceId];
        }
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
    const unpaidIds = invoices
      .filter((item) => item.paymentStatus === "unpaid")
      .map((item) => item.id);
    setSelectedInvoiceId(unpaidIds);
  };

  const handleDeselectAll = () => {
    setSelectedInvoiceId([]);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedInvoiceData(null);
  };

  const handlePaymentPress = () => {
    // Logic for payment processing can be added here
  };

  // Check
  const hasSelectedInvoice = selectedInvoiceId.length > 0;

  // UseEffect
  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  // Render
  const renderItem = ({ item }: { item: Invoice }) => (
    <Card
      invoice={item}
      onPress={handleInvoicePress}
      isPayment={isPayment}
      isSelected={selectedInvoiceId.includes(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backContainer} onPress={handleBack}>
          <Ionicons name="chevron-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
        <TouchableOpacity onPress={handleAddPaymentPress}>
          <MaterialCommunityIcons
            name="credit-card-plus"
            size={25}
            color={COLORS.white}
          />
        </TouchableOpacity>
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
            text={`Thanh toán (${selectedInvoiceId.length})`}
            colorType={hasSelectedInvoice ? "primary" : "grey"}
            onPress={() => {
              handlePaymentPress();
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
        keyExtractor={(item) => item.id}
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
            onClose={handleCloseDetail}
          />
        </>
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
