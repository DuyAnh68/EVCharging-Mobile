import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { useVehicle } from "@src/hooks/useVehicle";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SubscriptionPlan } from "@src/types/subscription";
import { VehicleDetail, VehicleForm } from "@src/types/vehicle";
import { formatDuration, formatVND } from "@src/utils/format";
import { validateVehicle } from "@src/utils/validateInput";
import { useEffect, useState } from "react";
import {
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
import LoadingOverlay from "../LoadingOverlay";
import SubPlanModal from "./SubPlanModal";

type Props = {
  visible: boolean;
  mode: "create" | "edit";
  userId: string;
  vehicle?: VehicleDetail | null;
  subPlans: SubscriptionPlan[];
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

const Form = ({
  visible,
  mode,
  userId,
  vehicle,
  subPlans,
  onClose,
  onSuccess,
  onError,
}: Props) => {
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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPlanData, setSelectedPlanData] =
    useState<SubscriptionPlan | null>(null);
  const [isUnselectedPlan, setIsUnselectedPlan] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [showPlans, setShowPlans] = useState<boolean>(false);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [preSubId, setPreSubId] = useState<string | null>(null);
  const [isUpdateSub, setIsUpdateSub] = useState<boolean>(false);

  // Hook
  const { create, update, isLoading } = useVehicle();

  // Handle logic
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);

    const planData = subPlans.find((p) => p.id === planId);
    setSelectedPlanData(planData ?? null);

    if (preSubId !== planId) {
      setIsUpdateSub(true);
    } else {
      setIsUpdateSub(false);
    }
  };

  const handleToggleUnselected = () => {
    setIsUnselectedPlan((prev) => {
      const newValue = !prev;
      if (newValue) {
        setSelectedPlan(null);
        setSelectedPlanData(null);

        if (preSubId) {
          setIsUpdateSub(true);
        } else {
          setIsUpdateSub(false);
        }
      }
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

  const handleCreate = async () => {
    if (!isFormValid()) return;

    const payload = {
      userId: userId,
      model: form.model,
      plateNumber: form.plateNumber,
      batteryCapacity: form.batteryCapacity,
      subscriptionId: selectedPlan,
    };

    const res = await create(payload);

    if (res.success) {
      onSuccess("Thêm xe thành công!");
      handleClose();
      return;
    }

    switch (res.step) {
      case "createVehicle":
        onError(res.message || "Không thể tạo xe. Vui lòng thử lại.");
        break;

      case "createSubscription":
        if (res.vehicle) {
          // Xe vẫn được tạo, chỉ lỗi khi đăng ký gói
          onError(
            res.message ||
              "Xe đã được tạo thành công, nhưng đăng ký gói thất bại."
          );

          handleClose();
        } else {
          onError("Không thể đăng ký gói cho xe.");
        }
        break;

      default:
        onError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
    }
  };

  const handleUpdate = async () => {
    if (!isFormValid()) return;

    const payload = {
      userId: userId,
      vehicleId: vehicleId,
      model: form.model,
      plateNumber: form.plateNumber,
      batteryCapacity: form.batteryCapacity,
      isUpdateSub: isUpdateSub,
      preSubId: preSubId,
      subId: selectedPlan,
    };

    const res = await update(payload);

    if (res.success) {
      onSuccess("Cập nhật xe thành công!");
      handleClose();
      return;
    }

    onError(res.message);
    handleClose();
  };

  // Reset form
  const resetForm = () => {
    setForm({
      model: "",
      plateNumber: "",
      batteryCapacity: "",
      subscriptionId: "",
    });

    setVehicleId(null);
    setSelectedPlan(null);
    setSelectedPlanData(null);
    setPreSubId(null);
    setIsUpdateSub(false);
    setIsUnselectedPlan(false);
  };

  // Check valid
  const isFormValid = () => {
    const noErrors = Object.values(errors).every((err) => !err);

    const allFilled = Object.entries(form)
      .filter(([key]) => key !== "subscriptionId")
      .every(([, value]) => (value ?? "").toString().trim() !== "");

    const hasChoosePlan = selectedPlan !== null || isUnselectedPlan;

    return noErrors && allFilled && hasChoosePlan && !isEdit;
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

      setVehicleId(vehicle.id);
      setSelectedPlan(vehicle.subscription?.plan.id || null);
      setPreSubId(vehicle.subscription?.plan.id || null);
      setIsUnselectedPlan(!vehicle.subscriptionId);
    } else {
      resetForm();
    }
  }, [mode, vehicle]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      {isLoading && <LoadingOverlay />}

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
            <Text style={styles.title}>
              {mode === "create" ? "Tạo thêm xe" : "Cập nhật xe"}
            </Text>
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
                    placeholder="VD: 1.5"
                    placeholderTextColor={TEXTS.placeholder}
                    keyboardType="decimal-pad"
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

                {mode === "create" && (
                  <>
                    {!selectedPlanData ? (
                      <TouchableOpacity
                        disabled={isUnselectedPlan}
                        style={[
                          styles.subBtnContainer,
                          isUnselectedPlan && { opacity: 0.5 },
                        ]}
                        onPress={() => {
                          setShowPlans(true);
                        }}
                      >
                        <Text style={[styles.subBtnText]}>Chọn gói</Text>
                        <Text style={[styles.subBtnText]}>▼</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setShowPlans(true);
                        }}
                        style={[styles.subContainer, { marginBottom: 8 }]}
                      >
                        <View
                          style={[
                            styles.cardContainer,
                            {
                              backgroundColor: COLORS.green50,
                              width: "100%",
                            },
                          ]}
                        >
                          <Text style={styles.cardTitle}>
                            {selectedPlanData.name}
                          </Text>
                          <View style={styles.infoRow}>
                            <Text style={styles.cardLabel}>Thời hạn:</Text>
                            <Text style={styles.value}>
                              {formatDuration(selectedPlanData.billingCycle)}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.cardLabel}>Giá:</Text>
                            <Text style={styles.value}>
                              {formatVND(selectedPlanData.price)}
                            </Text>
                          </View>
                          <View style={styles.infoRow}>
                            <Text style={styles.cardLabel}>Giảm giá:</Text>
                            <Text style={styles.value}>
                              {selectedPlanData.discount}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}

                    <View style={styles.row}>
                      <TouchableOpacity
                        onPress={handleToggleUnselected}
                        style={styles.toggleContainer}
                      >
                        <MaterialIcons
                          name={
                            isUnselectedPlan
                              ? "check-box"
                              : "check-box-outline-blank"
                          }
                          size={24}
                          color={
                            isUnselectedPlan ? COLORS.primary : COLORS.black
                          }
                        />
                        <Text style={styles.toggleText}>Không đăng ký</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                {mode === "edit" && (
                  <>
                    {vehicle?.subscriptionId ? (
                      // Có gói → hiển thị card
                      <View style={styles.subContainer}>
                        {vehicle?.subscription?.plan && (
                          <View
                            style={[
                              styles.cardContainer,
                              {
                                backgroundColor: COLORS.green50,
                                width: "100%",
                              },
                            ]}
                          >
                            <Text style={styles.cardTitle}>
                              {vehicle.subscription.plan.name}
                            </Text>
                            <View style={styles.infoRow}>
                              <Text style={styles.cardLabel}>Thời hạn:</Text>
                              <Text style={styles.value}>
                                {formatDuration(
                                  vehicle.subscription.plan.billingCycle
                                )}
                              </Text>
                            </View>
                            <View style={styles.infoRow}>
                              <Text style={styles.cardLabel}>Giá:</Text>
                              <Text style={styles.value}>
                                {formatVND(vehicle.subscription.plan.price)}
                              </Text>
                            </View>
                            <View style={styles.infoRow}>
                              <Text style={styles.cardLabel}>Giảm giá:</Text>
                              <Text style={styles.value}>
                                {vehicle.subscription.plan.discount}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    ) : (
                      // Không có gói → hiển thị nút “Không đăng ký”
                      <>
                        {!selectedPlanData ? (
                          <TouchableOpacity
                            disabled={isUnselectedPlan}
                            style={[
                              styles.subBtnContainer,
                              isUnselectedPlan && { opacity: 0.5 },
                            ]}
                            onPress={() => {
                              setShowPlans(true);
                            }}
                          >
                            <Text style={[styles.subBtnText]}>Chọn gói</Text>
                            <Text style={[styles.subBtnText]}>▼</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setShowPlans(true);
                            }}
                            style={[styles.subContainer, { marginBottom: 8 }]}
                          >
                            <View
                              style={[
                                styles.cardContainer,
                                {
                                  backgroundColor: COLORS.green50,
                                  width: "100%",
                                },
                              ]}
                            >
                              <Text style={styles.cardTitle}>
                                {selectedPlanData.name}
                              </Text>
                              <View style={styles.infoRow}>
                                <Text style={styles.cardLabel}>Thời hạn:</Text>
                                <Text style={styles.value}>
                                  {formatDuration(
                                    selectedPlanData.billingCycle
                                  )}
                                </Text>
                              </View>
                              <View style={styles.infoRow}>
                                <Text style={styles.cardLabel}>Giá:</Text>
                                <Text style={styles.value}>
                                  {formatVND(selectedPlanData.price)}
                                </Text>
                              </View>
                              <View style={styles.infoRow}>
                                <Text style={styles.cardLabel}>Giảm giá:</Text>
                                <Text style={styles.value}>
                                  {selectedPlanData.discount}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )}

                        <View style={styles.row}>
                          <TouchableOpacity
                            onPress={handleToggleUnselected}
                            style={styles.toggleContainer}
                          >
                            <MaterialIcons
                              name={
                                isUnselectedPlan
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={24}
                              color={
                                isUnselectedPlan ? COLORS.primary : COLORS.black
                              }
                            />
                            <Text style={styles.toggleText}>Không đăng ký</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </>
                )}
              </View>

              <View style={styles.btnContainer}>
                <Button
                  text={mode === "create" ? "Tạo thêm" : "Cập nhật"}
                  colorType={isFormValid() ? "primary" : "grey"}
                  onPress={() => {
                    if (mode === "create") {
                      handleCreate();
                    } else {
                      handleUpdate();
                    }
                  }}
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

      {showPlans && (
        <SubPlanModal
          visible={showPlans}
          subPlans={subPlans}
          onSelected={handleSelectPlan}
          onClose={() => {
            setShowPlans(false);
          }}
        />
      )}
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

  subContainer: {
    marginTop: 10,
  },
  subBtnContainer: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.green50,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "50%",
  },
  subBtnText: {},
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
