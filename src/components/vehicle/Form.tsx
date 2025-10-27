import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SubscriptionPlan } from "@src/types/subscription";
import { VehicleDetail, VehicleForm } from "@src/types/vehicle";
import { formatVND } from "@src/utils/format";
import { validateVehicle } from "@src/utils/validateInput";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  visible: boolean;
  mode: "create" | "edit";
  vehicle?: VehicleDetail | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const Form = ({ visible, mode, vehicle, onClose, onSuccess }: Props) => {
  const plans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Gói Cơ bản",
      price: 99000,
      discount: 0,
      billingCycle: "1 tháng",
      limitType: "5 lượt sử dụng",
      description: "Phù hợp cho người mới bắt đầu trải nghiệm dịch vụ.",
      isActive: true,
      createdAt: "2025-01-10T08:00:00Z",
      updatedAt: "2025-02-01T09:30:00Z",
    },
    {
      id: "standard",
      name: "Gói Nâng cao",
      price: 249000,
      discount: 10,
      billingCycle: "3 tháng",
      limitType: "20 lượt sử dụng",
      description: "Tiết kiệm hơn, nhiều tiện ích hơn so với gói Cơ bản.",
      isActive: true,
      createdAt: "2025-01-15T08:00:00Z",
      updatedAt: "2025-02-10T10:00:00Z",
    },
    {
      id: "premium",
      name: "Gói Chuyên nghiệp",
      price: 449000,
      discount: 15,
      billingCycle: "6 tháng",
      limitType: "Không giới hạn lượt sử dụng",
      description: "Dành cho người dùng chuyên nghiệp với nhu cầu cao.",
      isActive: true,
      createdAt: "2025-02-01T08:00:00Z",
      updatedAt: "2025-02-20T11:00:00Z",
    },
    {
      id: "enterprise",
      name: "Gói Doanh nghiệp",
      price: 799000,
      discount: 20,
      billingCycle: "12 tháng",
      limitType: "Không giới hạn + ưu tiên hỗ trợ",
      description:
        "Giải pháp toàn diện cho doanh nghiệp, bao gồm hỗ trợ kỹ thuật riêng.",
      isActive: false,
      createdAt: "2025-02-10T08:00:00Z",
      updatedAt: "2025-03-01T09:00:00Z",
    },
  ];

  // State
  const [form, setForm] = useState<VehicleForm>({
    model: "",
    plateNumber: "",
    batteryCapacity: "",
    subscriptionId: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [isUnselectedSub, setIsUnselectedSub] = useState<boolean>(false);
  const [isRenew, setIsRenew] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Handle logic
  const handleSelectSub = (planId: string) => {
    // Nếu đang bật "Không đăng ký", thì bỏ chọn
    if (isUnselectedSub) return;

    // Nếu người dùng click lại vào cùng gói => bỏ chọn
    setSelectedSub((prev) => (prev === planId ? null : planId));
  };

  const handleToggleUnselected = () => {
    setIsUnselectedSub((prev) => {
      const newValue = !prev;
      if (newValue) setSelectedSub(null);
      return newValue;
    });
  };

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setIsEdit(true);
  };

  const handleBlur = (field: keyof typeof form) => {
    const error = validateVehicle(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error || "" }));
    setIsEdit(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    if (mode === "create") {
      console.log("Creating vehicle:", form);
      onSuccess("Thêm xe thành công!");
    } else if (mode === "edit" && vehicle) {
      console.log("Updating vehicle:", { id: vehicle.id, ...form });
      onSuccess("Cập nhật xe thành công!");
    }
    resetForm();
    onClose();
  };

  // Reset form
  const resetForm = () => {
    setForm({
      model: "",
      plateNumber: "",
      batteryCapacity: "",
      subscriptionId: "",
    });

    setSelectedSub(null);
    setIsUnselectedSub(false);
    setIsRenew(false);
  };

  // Check valid
  const isFormValid = () => {
    const noErrors = Object.values(errors).every((err) => !err);

    const allFilled = Object.entries(form)
      .filter(([key]) => key !== "subscriptionId")
      .every(([, value]) => (value ?? "").toString().trim() !== "");

    const hasChooseSub = selectedSub !== null || isUnselectedSub;

    return noErrors && allFilled && hasChooseSub && !isEdit;
  };

  // UseEffect
  useEffect(() => {
    if (mode === "edit" && vehicle) {
      setForm({
        model: vehicle.model || "",
        plateNumber: vehicle.plateNumber || "",
        batteryCapacity: vehicle.batteryCapacity?.toString() || "",
        subscriptionId: vehicle.subscriptionId || "",
      });

      setSelectedSub(vehicle.subscription?.plan.id || null);
      setIsUnselectedSub(!vehicle.subscriptionId);
      setIsRenew(vehicle.subscription?.autoRenew ?? false);
    } else {
      resetForm();
    }
  }, [mode, vehicle]);

  // Render
  const renderSubscriptionItem = ({ item }: { item: SubscriptionPlan }) => {
    const isSelected = selectedSub === item.id;
    const isDisabled = isUnselectedSub || mode === "edit";

    const handlePress = () => {
      if (isDisabled) return;
      handleSelectSub(item.id);
    };
    return (
      <TouchableOpacity
        activeOpacity={isDisabled ? 0.5 : 0.7}
        onPress={handlePress}
        style={[
          styles.cardContainer,
          isSelected && styles.selectedCard,
          isDisabled && { opacity: 0.5 },
        ]}
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Thời hạn:</Text>
          <Text style={styles.value}>{item.billingCycle}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.cardLabel}>Giá:</Text>
          <Text style={styles.value}>{formatVND(item.price)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      {/* Overlay nền mờ */}
      <Pressable style={styles.overlay} onPress={onClose} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        accessible={false}
      >
        {/* Modal nội dung (bottom sheet) */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Thêm phương tiện</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.backContainer}
            >
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Form nội dung */}
          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={Platform.OS === "ios" ? 20 : 120}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {/* Hãng */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Hãng xe</Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.model && {
                        borderColor: "red",
                        shadowColor: "red",
                      },
                    ]}
                    placeholder="VD: Tesla Model 3"
                    placeholderTextColor={TEXTS.placeholder}
                    value={form.model}
                    onChangeText={(text) => handleChange("model", text)}
                    onFocus={() => {
                      handleFocus("model");
                    }}
                    onBlur={() => {
                      handleBlur("model");
                    }}
                  />
                  <Text style={styles.errorText}>{errors.model || " "}</Text>
                </View>
              </View>

              {/* Biển số xe */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Biển số xe</Text>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.plateNumber && {
                        borderColor: "red",
                        shadowColor: "red",
                      },
                    ]}
                    placeholder="VD: 29A-12345"
                    placeholderTextColor={TEXTS.placeholder}
                    value={form.plateNumber}
                    onChangeText={(text) => handleChange("plateNumber", text)}
                    onFocus={() => {
                      handleFocus("plateNumber");
                    }}
                    onBlur={() => {
                      handleBlur("plateNumber");
                    }}
                  />
                  <Text style={styles.errorText}>
                    {errors.plateNumber || " "}
                  </Text>
                </View>
              </View>

              {/* Pin */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Dung lượng pin (kW)</Text>

                <View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.batteryCapacity && {
                        borderColor: "red",
                        shadowColor: "red",
                      },
                    ]}
                    placeholder="VD: 5000"
                    placeholderTextColor={TEXTS.placeholder}
                    keyboardType="phone-pad"
                    value={form.batteryCapacity}
                    onChangeText={(text) =>
                      handleChange("batteryCapacity", text)
                    }
                    onFocus={() => {
                      handleFocus("batteryCapacity");
                    }}
                    onBlur={() => {
                      handleBlur("batteryCapacity");
                    }}
                  />
                  <Text style={styles.errorText}>
                    {errors.batteryCapacity || " "}
                  </Text>
                </View>
              </View>

              {/* Gói */}
              <View>
                <Text style={styles.label}>Đăng ký gói</Text>

                <View style={styles.listContainer}>
                  <FlatList
                    data={plans}
                    renderItem={renderSubscriptionItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                  />
                </View>

                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={handleToggleUnselected}
                    style={styles.toggleContainer}
                    disabled={mode === "edit"}
                  >
                    <MaterialIcons
                      name={
                        isUnselectedSub
                          ? "check-box"
                          : "check-box-outline-blank"
                      }
                      size={24}
                      color={isUnselectedSub ? COLORS.primary : COLORS.black}
                    />
                    <Text style={styles.toggleText}>Không đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.btnContainer}>
                <Button
                  text={mode === "create" ? "Tạo thêm" : "Cập nhật"}
                  colorType={isFormValid() ? "primary" : "grey"}
                  onPress={handleSubmit}
                  disabled={!isFormValid()}
                  width={300}
                  height={50}
                  fontSize={18}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    width: "100%",
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
    padding: 20,
  },
  fieldContainer: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    marginLeft: -10,
  },
  list: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginRight: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    padding: 8,
  },
  selectedCard: {
    backgroundColor: COLORS.primaryLighter,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: 140,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "500",
  },
  btnContainer: {
    marginTop: 20,
    marginBottom: 5,
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

export default Form;
