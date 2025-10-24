import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalPopup from "@src/components/ModalPopup";
import { useAuth } from "@src/hooks/useAuth";
import { COLORS, TEXTS } from "@src/styles/theme";
import { RegisterReq } from "@src/types/auth";
import { validateRegister } from "@src/utils/validateInput";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Register = () => {
  // Hook
  const { register } = useAuth();

  // State
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Ref
  const usernameContainerRef = useRef<View | null>(null);
  const [usernameFocused, setUsernameFocused] = useState<boolean>(false);

  const phoneContainerRef = useRef<View | null>(null);
  const [phoneFocused, setPhoneFocused] = useState<boolean>(false);

  const emailContainerRef = useRef<View | null>(null);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);

  const passwordContainerRef = useRef<View | null>(null);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  const confirmPassContainerRef = useRef<View | null>(null);
  const [confirmPassFocused, setConfirmPassFocused] = useState<boolean>(false);

  // Hanlde focus
  const focusUsername = () => {
    usernameContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setUsernameFocused(true);
    setIsEdit(true);
  };

  const blurUsername = () => {
    usernameContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setUsernameFocused(false);
    setIsEdit(false);
  };

  const focusPhone = () => {
    phoneContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setPhoneFocused(true);
    setIsEdit(true);
  };

  const blurPhone = () => {
    phoneContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setPhoneFocused(false);
    setIsEdit(false);
  };

  const focusEmail = () => {
    emailContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setEmailFocused(true);
    setIsEdit(true);
  };

  const blurEmail = () => {
    emailContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setEmailFocused(false);
    setIsEdit(false);
  };

  const focusPassword = () => {
    passwordContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setPasswordFocused(true);
    setIsEdit(true);
  };

  const blurPassword = () => {
    passwordContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setPasswordFocused(false);
    setIsEdit(false);
  };

  const focusConfirmPass = () => {
    confirmPassContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setConfirmPassFocused(true);
    setIsEdit(true);
  };

  const blurConfirmPass = () => {
    confirmPassContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setConfirmPassFocused(false);
    setIsEdit(false);
  };

  // Handle logic
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFocus = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: keyof typeof form) => {
    const error = validateRegister(field, form[field], form);
    setErrors((prev) => ({ ...prev, [field]: error || "" }));
  };

  const handleRegister = async () => {
    setSuccessModal(false);
    setErrorModal(false);
    setErrorMsg("");

    const data: RegisterReq = {
      username: form.username,
      email: form.email,
      phone: form.phone,
      password: form.password,
    };

    const res = await register(data);

    if (res.success) {
      setForm({
        username: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setSuccessModal(true);

      setTimeout(() => router.replace("/(auth)/login"), 2500);
      return;
    }

    setErrorMsg(res?.message || "Đăng ký thất bại!");
    setTimeout(() => setErrorModal(true), 100);
  };

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  // Check Valid
  const isFormValid = () => {
    const noErrors = Object.values(errors).every((err) => !err);

    const allFilled = Object.values(form).every((v) => v.trim() !== "");

    return noErrors && allFilled && !isEdit;
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
        accessible={false}
      >
        <View style={styles.content}>
          <View style={styles.formCard}>
            <BlurView
              intensity={20}
              tint="dark"
              style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            ></BlurView>
            <KeyboardAwareScrollView
              enableOnAndroid
              extraScrollHeight={Platform.OS === "ios" ? 20 : 120}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.form}>
                {/* USERNAME */}
                <View style={styles.row}>
                  <View
                    ref={usernameContainerRef}
                    style={[
                      styles.inputContainer,
                      errors.username && { borderColor: "red" },
                    ]}
                  >
                    <View style={styles.inputIconWrapper}>
                      <Feather
                        name="user"
                        size={20}
                        color={
                          usernameFocused ? COLORS.primary : COLORS.gray600
                        }
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập tên tài khoản"
                      placeholderTextColor={TEXTS.placeholder}
                      value={form.username}
                      onChangeText={(text) => handleChange("username", text)}
                      onFocus={() => {
                        handleFocus("username");
                        focusUsername();
                      }}
                      onBlur={() => {
                        blurUsername();
                        handleBlur("username");
                      }}
                    />
                  </View>
                  {errors.username ? (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  ) : null}
                </View>

                {/* PHONE */}
                <View style={styles.row}>
                  <View
                    ref={phoneContainerRef}
                    style={[
                      styles.inputContainer,
                      errors.phone && { borderColor: "red" },
                    ]}
                  >
                    <View style={styles.inputIconWrapper}>
                      <Feather
                        name="phone"
                        size={20}
                        color={phoneFocused ? COLORS.primary : COLORS.gray600}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập số điện thoại"
                      placeholderTextColor={TEXTS.placeholder}
                      keyboardType="phone-pad"
                      value={form.phone}
                      onChangeText={(text) => handleChange("phone", text)}
                      onFocus={() => {
                        handleFocus("phone");
                        focusPhone();
                      }}
                      onBlur={() => {
                        blurPhone();
                        handleBlur("phone");
                      }}
                    />
                  </View>
                  {errors.phone ? (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                  ) : null}
                </View>

                {/* EMAIL */}
                <View style={styles.row}>
                  <View
                    ref={emailContainerRef}
                    style={[
                      styles.inputContainer,
                      errors.email && { borderColor: "red" },
                    ]}
                  >
                    <View style={styles.inputIconWrapper}>
                      <MaterialCommunityIcons
                        name="email-outline"
                        size={20}
                        color={emailFocused ? COLORS.primary : COLORS.gray600}
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập địa chỉ email"
                      placeholderTextColor={TEXTS.placeholder}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={form.email}
                      onChangeText={(text) => handleChange("email", text)}
                      onFocus={() => {
                        handleFocus("email");
                        focusEmail();
                      }}
                      onBlur={() => {
                        blurEmail();
                        handleBlur("email");
                      }}
                    />
                  </View>
                  {errors.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                {/* PASSWORD */}
                <View style={styles.row}>
                  <View
                    ref={passwordContainerRef}
                    style={[
                      styles.inputContainer,
                      errors.password && { borderColor: "red" },
                    ]}
                  >
                    <View style={styles.inputIconWrapper}>
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={20}
                        color={
                          passwordFocused ? COLORS.primary : COLORS.gray600
                        }
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor={TEXTS.placeholder}
                      secureTextEntry={!showPassword}
                      value={form.password}
                      onChangeText={(text) => handleChange("password", text)}
                      onFocus={() => {
                        handleFocus("password");
                        focusPassword();
                      }}
                      onBlur={() => {
                        blurPassword();
                        handleBlur("password");
                      }}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <MaterialCommunityIcons
                          name="eye"
                          size={20}
                          color={COLORS.gray600}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off"
                          size={20}
                          color={COLORS.gray600}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.row}>
                  <View
                    ref={confirmPassContainerRef}
                    style={[
                      styles.inputContainer,
                      errors.confirmPassword && { borderColor: "red" },
                    ]}
                  >
                    <View style={styles.inputIconWrapper}>
                      <MaterialCommunityIcons
                        name="lock-outline"
                        size={20}
                        color={
                          confirmPassFocused ? COLORS.primary : COLORS.gray600
                        }
                      />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Nhập xác nhận mật khẩu"
                      placeholderTextColor={TEXTS.placeholder}
                      secureTextEntry={!showConfirmPass}
                      value={form.confirmPassword}
                      onChangeText={(text) =>
                        handleChange("confirmPassword", text)
                      }
                      onFocus={() => {
                        handleFocus("confirmPassword");
                        focusConfirmPass();
                      }}
                      onBlur={() => {
                        blurConfirmPass();
                        handleBlur("confirmPassword");
                      }}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      {showConfirmPass ? (
                        <MaterialCommunityIcons
                          name="eye"
                          size={20}
                          color={COLORS.gray600}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="eye-off"
                          size={20}
                          color={COLORS.gray600}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>

                {/* BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    !isFormValid() && { opacity: 0.6 },
                  ]}
                  onPress={handleRegister}
                  disabled={!isFormValid()}
                >
                  <LinearGradient
                    colors={COLORS.gradient_1}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.registerButtonText}>Đăng Ký</Text>
                    <View style={styles.buttonIconContainer}>
                      <AntDesign name="thunderbolt" size={20} color="white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* NAVIGATE */}
                <View style={styles.haveAccountContainer}>
                  <Text style={styles.haveAccountText}>
                    Bạn đã có tài khoản?
                  </Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.haveAccountLink}>Đăng nhập.</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* MODAL */}
      {successModal && (
        <ModalPopup
          key={`success-${successModal}`}
          visible={successModal}
          mode="toast"
          contentText="Đăng ký thành thông!"
          icon={<FontAwesome5 name="check" size={30} color="white" />}
          iconBgColor="green"
          onClose={() => setSuccessModal(false)}
          modalWidth={355}
        />
      )}

      {errorModal && (
        <ModalPopup
          visible={errorModal}
          mode="noti"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          confirmBtnText="Đóng"
          confirmBtnColor="grey"
          onClose={() => {
            setErrorModal(false);
            setErrorMsg("");
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
  content: {
    flex: 1,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  formCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  form: {
    padding: 20,
  },
  row: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    height: 55,
  },
  inputContainerFocused: {
    borderColor: COLORS.inputBorderFocused,
    backgroundColor: COLORS.inputBgFocused,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIconWrapper: {
    width: 40,
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: TEXTS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 8,
  },
  haveAccountContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  haveAccountLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  haveAccountText: {
    color: COLORS.gray600,
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  registerButtonText: {
    color: TEXTS.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 6,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: -5,
  },
});

export default Register;
