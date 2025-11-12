import { Ionicons } from "@expo/vector-icons";
import Button from "@src/components/Button";
import { useAuthContext } from "@src/context/AuthContext";
import { useAuth } from "@src/hooks/useAuth";
import { COLORS, TEXTS } from "@src/styles/theme";
import { User, UserForm } from "@src/types/user";
import { validateUser } from "@src/utils/validateInput";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import LoadingOverlay from "../LoadingOverlay";

type Props = {
  visible: boolean;
  user: User;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

const Info = ({ visible, user, onClose, onSuccess, onError }: Props) => {
  // State
  const [form, setForm] = useState<UserForm>({
    username: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Hook
  const { setUser } = useAuthContext();
  const { updateInfo, isLoading } = useAuth();

  // Handle Logic
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setIsEdit(true);
  };

  const handleBlur = (field: keyof typeof form) => {
    const error = validateUser(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error || "" }));
    setIsEdit(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const res = await updateInfo(user.userId, form);

    if (res.success && res.data) {
      setUser(res.data);
      onSuccess("Cập nhật thành công!");
      onClose();
      return;
    }
    onError(res.message || "Cập nhật thất bại!");
  };

  // Check
  const isFormValid = () => {
    const noErrors = Object.values(errors).every((err) => !err);

    const allFilled = Object.values(form).every((v) => v.trim() !== "");

    return noErrors && allFilled && !isEdit;
  };

  const isChanged = () => {
    return (
      form.username !== user.username ||
      form.phone !== user.phone ||
      form.email !== user.email
    );
  };

  const canUpdate = isFormValid() && isChanged();

  const isCompany = user.isCompany;

  // UseEffect
  useEffect(() => {
    setForm({
      username: user.username || "",
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [user]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      {isLoading && <LoadingOverlay />}
      {/* Overlay nền mờ */}
      <View style={styles.overlay}>
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
              <Text style={styles.title}>Thông tin tài khoản</Text>
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
              enableAutomaticScroll={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentContainer}>
                {/* Username */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Tên tài khoản</Text>
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        errors.username && {
                          borderColor: "red",
                          shadowColor: "red",
                        },
                      ]}
                      placeholder="Nhập tên tài khoản"
                      placeholderTextColor={TEXTS.placeholder}
                      value={form.username}
                      onChangeText={(text) => handleChange("username", text)}
                      onFocus={() => {
                        handleFocus("username");
                      }}
                      onBlur={() => {
                        handleBlur("username");
                      }}
                    />
                    <Text style={styles.errorText}>
                      {errors.username || " "}
                    </Text>
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Số điện thoại</Text>
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        errors.phone && {
                          borderColor: "red",
                          shadowColor: "red",
                        },
                      ]}
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={TEXTS.placeholder}
                      keyboardType="phone-pad"
                      value={form.phone}
                      onChangeText={(text) => handleChange("phone", text)}
                      onFocus={() => {
                        handleFocus("phone");
                      }}
                      onBlur={() => {
                        handleBlur("phone");
                      }}
                    />
                    <Text style={styles.errorText}>{errors.phone || " "}</Text>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Email</Text>
                  <View>
                    <TextInput
                      style={[
                        styles.input,
                        errors.email && {
                          borderColor: "red",
                          shadowColor: "red",
                        },
                        isCompany && {
                          color: TEXTS.secondary,
                        },
                      ]}
                      placeholder="Nhập địa chỉ email"
                      placeholderTextColor={TEXTS.placeholder}
                      keyboardType="email-address"
                      value={form.email}
                      onChangeText={(text) => handleChange("email", text)}
                      onFocus={() => {
                        handleFocus("email");
                      }}
                      onBlur={() => {
                        handleBlur("email");
                      }}
                      editable={!isCompany}
                      selectTextOnFocus={!isCompany}
                    />
                    <Text style={styles.errorText}>{errors.email || " "}</Text>
                  </View>
                </View>

                <View style={styles.btnContainer}>
                  <Button
                    text="Cập nhật"
                    colorType={canUpdate ? "primary" : "grey"}
                    onPress={handleSubmit}
                    disabled={!canUpdate}
                    width={280}
                    height={50}
                    fontSize={18}
                  />
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </TouchableWithoutFeedback>
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
  btnContainer: {
    marginTop: 15,
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

export default Info;
