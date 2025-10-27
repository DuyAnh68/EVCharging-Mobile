import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import ModalPopup from "@src/components/ModalPopup";
import Card from "@src/components/vehicle/Card";
import Detail from "@src/components/vehicle/Detail";
import Form from "@src/components/vehicle/Form";
import { useVehicle } from "@src/hooks/useVehicle";
import { COLORS, TEXTS } from "@src/styles/theme";
import { VehicleDetail } from "@src/types/vehicle";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleScreen() {
  // State
  const [vehicles, setVehicles] = useState<VehicleDetail[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetail | null>(
    null
  );

  // Hook
  const { getVehicles } = useVehicle();

  // Api
  const fetchVehicles = async () => {
    const res = await getVehicles();

    if (res.success && res.vehicles) {
      setVehicles(res.vehicles);
      return;
    }

    setErrorMsg(res.message || "Không thể lấy danh sách xe!");
    setShowError(true);
  };

  // Handle logic
  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleShowEdit = (vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    handleShowForm();
  };

  const handleSuccess = (message: string) => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setSuccessMsg(message);
    setShowSuccess(true);
  };

  const handleCloseForm = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }
    setShowForm(false);
  };

  const handleShowDetail = (vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setShowDetail(false);
  };

  const handleShowDelete = (vehicle: VehicleDetail) => {
    setSelectedVehicle(vehicle);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }

    setShowDelete(false);
  };

  const handleDelete = () => {
    console.log("Xóa xe", selectedVehicle?.plateNumber);
    if (setSelectedVehicle) {
      setSelectedVehicle(null);
    }
    setSuccessMsg("Đã xóa thành công!");
    setShowDelete(false);
    setShowSuccess(true);
  };

  const handleConfirmError = () => {
    fetchVehicles();
    setShowError(false);
    setErrorMsg("");
  };

  // UseEffect
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Render card
  const renderVehicleItem = ({ item }: { item: VehicleDetail }) => (
    <Card
      vehicle={item}
      onPress={() => handleShowDetail(item)}
      onEdit={() => handleShowEdit(item)}
      onDelete={() => handleShowDelete(item)}
    />
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
        <TouchableOpacity style={styles.addButton} onPress={handleShowForm}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Vehicle List */}
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          renderItem={renderVehicleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="car-sport" size={64} color={COLORS.gray500} />
          <Text style={styles.emptyTitle}>Chưa có xe nào!</Text>
          <Text style={styles.emptySubtitle}>
            Thêm xe đầu tiên của bạn để bắt đầu
          </Text>
        </View>
      )}

      {/* Form Modal */}
      {showForm && (
        <>
          <View style={styles.overlay} />
          <Form
            visible={showForm}
            mode={selectedVehicle ? "edit" : "create"}
            vehicle={selectedVehicle}
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
          contentText={`Bạn có muốn xóa xe có biển số "${selectedVehicle.plateNumber}" không?`}
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
