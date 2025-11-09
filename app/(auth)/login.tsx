import { FontAwesome5 } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ModalPopup from "@src/components/ModalPopup";
import { useAuthContext } from "@src/context/AuthContext";
import { useAuth } from "@src/hooks/useAuth";
import { COLORS, TEXTS } from "@src/styles/theme";
import { validateLogin } from "@src/utils/validateInput";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  // Hook
  const { login } = useAuth();
  const { setUser } = useAuthContext();

  // State
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Ref
  const emailContainerRef = useRef<View | null>(null);
  const [emailFocused, setEmailFocused] = useState<boolean>(false);

  const passwordContainerRef = useRef<View | null>(null);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  // Hanlde focus
  const focusEmail = () => {
    emailContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setEmailFocused(true);
  };

  const blurEmail = () => {
    emailContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setEmailFocused(false);
  };

  const focusPassword = () => {
    passwordContainerRef.current?.setNativeProps({
      style: styles.inputContainerFocused,
    });
    setPasswordFocused(true);
  };

  const blurPassword = () => {
    passwordContainerRef.current?.setNativeProps({
      style: styles.inputContainer,
    });
    setPasswordFocused(false);
  };

  // Handle logic
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field: keyof typeof form) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleLogin = async () => {
    const newErrors = validateLogin(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return;
    }

    const res = await login(form);

    if (res.success && res.user) {
      setUser(res.user);
      setForm({
        email: "",
        password: "",
      });
      router.replace("/(tabs)");
      return;
    }

    setErrorMsg(res?.message || "Đăng nhập thất bại!");
    setTimeout(() => setErrorModal(true), 100);
  };

  const handleRegister = () => {
    router.replace("/(auth)/register");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Hệ Thống Quản Lý Trạm Sạc Thông Minh
        </Text>
        <View style={styles.taglineContainer}>
          <FontAwesome5 name="leaf" size={20} color={COLORS.primaryLight} />
          <Text style={styles.tagline}>
            Năng Lượng Xanh · Tương Lai Bền Vững
          </Text>
          <FontAwesome5 name="leaf" size={20} color={COLORS.primaryLight} />
        </View>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.body}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
          accessible={false}
        >
          <View style={styles.content}>
            <BlurView
              intensity={20}
              tint="dark"
              style={styles.formCard}
              pointerEvents="box-none"
            >
              <View style={styles.form}>
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
                      onBlur={blurEmail}
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
                      onBlur={blurPassword}
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

                {/* FORGOT */}
                <TouchableOpacity style={styles.forgotPasswordTop}>
                  <Text style={styles.forgotPasswordTopText}>
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>

                {/* BTN LOGIN */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <LinearGradient
                    colors={COLORS.gradient_1}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                    <View style={styles.buttonIconContainer}>
                      <AntDesign name="thunderbolt" size={20} color="white" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* DIVIDER */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>HOẶC</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* BTN REGISTER */}
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleRegister}
                >
                  <View style={styles.secondaryButtonContent}>
                    <Text style={styles.secondaryButtonText}>
                      Đăng Ký Tài Khoản Mới
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* MODAL */}
      {errorModal && (
        <ModalPopup
          visible={errorModal}
          mode="toast"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          onClose={() => {
            setErrorModal(false);
            setErrorMsg("");
          }}
          modalWidth={355}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    alignItems: "center",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    color: TEXTS.white,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  tagline: {
    fontSize: 13,
    color: TEXTS.white,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  formCard: {
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
    height: 62,
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
  forgotPasswordTop: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordTopText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
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
  loginButtonText: {
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
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    color: COLORS.gray600,
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  secondaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.inputBorderFocused,
    backgroundColor: COLORS.green50,
  },
  secondaryButtonContent: {
    height: 62,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: -5,
  },
});

export default Login;
