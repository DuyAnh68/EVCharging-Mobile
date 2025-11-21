import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import ModalPopup from "@src/components/ModalPopup";
import Card from "@src/components/vehicle/Card";
import Detail from "@src/components/vehicle/Detail";
import Form from "@src/components/vehicle/Form";
import { useAuthContext } from "@src/context/AuthContext";
import { useLoading } from "@src/context/LoadingContext";
import { usePayment } from "@src/context/PaymentContext";
import { useSubscription } from "@src/hooks/useSubscription";
import { useVehicle } from "@src/hooks/useVehicle";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SubscriptionPlan } from "@src/types/subscription";
import { VehicleDetail } from "@src/types/vehicle";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleScreen() {
  // State
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [subPlans, setSubPlans] = useState<SubscriptionPlan[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetail | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  // Hook
  const { getVehicles, deleteVehicle } = useVehicle();
  const { getSubPlans } = useSubscription();
  const { isLoading } = useLoading();
  const { user } = useAuthContext();
  const {
    paymentResult,
    setPaymentResult,
    isBack,
    setIsBack,
    type: typeContext,
    setType,
  } = usePayment();

  // Param
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  // Ref
  const flatListRef = useRef<FlatList>(null);

  // Api
  const fetchVehicles = useCallback(async () => {
    const res = await getVehicles();

    if (res.success && res.vehicles) {
      setVehicles(res.vehicles);
      return;
    }

    setErrorMsg(res.message || "Không thể lấy danh sách xe!");
    setShowError(true);
  }, [user]);

  const fetchSubPlans = async () => {
    const res = await getSubPlans();

    if (res.success && res.subscriptions) {
      setSubPlans(res.subscriptions);
      return;
    }

    setErrorMsg(res.message || "Không thể lấy danh sách gói đăng ký!");
    setShowError(true);
  };

  const fetchData = async () => {
    await Promise.allSettled([fetchVehicles(), fetchSubPlans()]);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVehicles();
    setRefreshing(false);
  }, [fetchVehicles]);

  // Handle logic
  const handleShowForm = useCallback(() => {
    setShowForm(true);
  }, []);

  const handleShowEdit = useCallback(
    (vehicle: VehicleDetail) => {
      setSelectedVehicle(vehicle);
      handleShowForm();
    },
    [handleShowForm]
  );

  const handleSuccess = (message: string) => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setSuccessMsg(message);
    setShowSuccess(true);

    setTimeout(() => {
      fetchVehicles();
    }, 3100);
  };

  const handleCloseForm = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }
    setShowForm(false);
  };

  const handleShowDetail = useCallback((vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    setShowDetail(true);
  }, []);

  const handleCloseDetail = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setShowDetail(false);
  };

  const handleShowDelete = useCallback((vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    setShowDelete(true);
  }, []);

  const handleCloseDelete = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setShowDelete(false);
  };

  const handleDelete = async () => {
    if (!selectedVehicle) return;
    setShowDelete(false);
    const res = await deleteVehicle(selectedVehicle?.id);

    if (res.success) {
      setSelectedVehicle(null);
      setSuccessMsg("Đã xóa thành công!");
      setShowSuccess(true);
      fetchData();
      return;
    }

    setSelectedVehicle(null);
    setErrorMsg(res.message || "Xóa xe thất bại!");
    setShowError(true);
  };

  const handleConfirmError = () => {
    fetchVehicles();
    setShowError(false);
    setErrorMsg("");
  };

  // Check
  const isCompany = user?.isCompany ?? false;

  // UseEffect
  useEffect(() => {
    if (paymentResult) return;
    fetchData();
  }, []);

  // UseFocusEffect
  useFocusEffect(
    useCallback(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      // Kiểm tra paymentResult chỉ khi screen này được focus
      if (paymentResult === "success") {
        if (type === "createSub") {
          setSuccessMsg("Thêm xe thành công!");
        } else {
          setSuccessMsg("Cập nhật xe thành công!");
        }

        setShowSuccess(true);

        fetchVehicles();

        setPaymentResult(null);
        setType(null);
      }

      if ((paymentResult === "failed" || isBack) && typeContext) {
        setMsg(
          "Xe của bạn đã được thêm nhưng thanh toán gói thất bại. Vui lòng đăng ký gói lại sau."
        );
        setShowMsg(true);
        setPaymentResult(null);
        setType(null);
        setIsBack(false);

        fetchVehicles();
      }
    }, [paymentResult, isBack])
  );

  // Render card
  const renderVehicleItem = useCallback(
    ({ item }: { item: VehicleDetail }) => (
      <Card
        vehicle={item}
        onPress={() => handleShowDetail(item)}
        onEdit={() => handleShowEdit(item)}
        onDelete={() => handleShowDelete(item)}
      />
    ),
    [handleShowDetail, handleShowEdit, handleShowDelete]
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.title}>Danh sách xe</Text>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{vehicles.length} </Text>
            <Ionicons name="car-sport" size={20} color={COLORS.white} />
          </View>
        </View>

        {!isCompany && (
          <TouchableOpacity style={styles.addButton} onPress={handleShowForm}>
            <Ionicons name="add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Vehicle List */}
      {vehicles.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          removeClippedSubviews={true}
        />
      ) : (
        !isLoading && (
          <View style={styles.emptyState}>
            <Ionicons name="car-sport" size={64} color={COLORS.gray500} />
            <Text style={styles.emptyTitle}>Chưa có xe nào!</Text>
            <Text style={styles.emptySubtitle}>
              Thêm xe đầu tiên của bạn để bắt đầu
            </Text>
          </View>
        )
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <View style={styles.overlay} />
          <Form
            visible={showForm}
            mode={selectedVehicle ? "edit" : "create"}
            userId={user?.userId || ""}
            vehicle={selectedVehicle}
            subPlans={subPlans}
            onClose={handleCloseForm}
            onSuccess={(message) => {
              handleSuccess(message);
            }}
          />
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selectedVehicle && (
        <>
          <View style={styles.overlay} />
          <Detail
            visible={showDetail}
            vehicle={selectedVehicle}
            onClose={handleCloseDetail}
          />
        </>
      )}

      {/* Delete Modal */}
      {showDelete && selectedVehicle && (
        <ModalPopup
          visible={showDelete}
          mode="confirm"
          titleText="Xác nhận xóa"
          contentText={`Bạn có chắc chắn muốn xóa xe có biển số "${selectedVehicle.plateNumber}" không?`}
          icon={<Ionicons name="trash" size={30} color={COLORS.white} />}
          iconBgColor="red"
          confirmBtnText="Xóa"
          confirmBtnColor="red"
          cancelBtnText="Đóng"
          cancelBtnColor="grey"
          onClose={handleCloseDelete}
          onConfirm={handleDelete}
          modalWidth={355}
        />
      )}

      {/* Toast Modal */}
      {showSuccess && (
        <ModalPopup
          visible={showSuccess}
          mode="toast"
          contentText={successMsg}
          icon={<FontAwesome5 name="check" size={30} color="white" />}
          iconBgColor="green"
          onClose={() => {
            setShowSuccess(false);
            setSuccessMsg("");
          }}
          modalWidth={355}
        />
      )}

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
          iconBgColor="yellow"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          onClose={() => {
            setShowMsg(false);
            setMsg("");
          }}
          modalWidth={355}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXTS.white,
    marginBottom: 4,
  },
  row: { flexDirection: "row" },
  subtitle: {
    fontSize: 14,
    color: TEXTS.white,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXTS.primary,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: TEXTS.secondary,
    marginTop: 8,
  },
});
