import { COLORS, TEXTS } from "@src/styles/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export type ColorType = "grey" | "red" | "green" | "yellow" | "blue";

type Props = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  colorType?: ColorType;
  width?: number;
  height?: number;
  fontSize?: number;
};

const getColors = (type: ColorType) => {
  switch (type) {
    case "red":
      return {
        backgroundColor: COLORS.danger,
        shadowColor: COLORS.dangerDark,
        textColor: TEXTS.white,
      };
    case "yellow":
      return {
        backgroundColor: COLORS.warning,
        shadowColor: COLORS.warningDark,
        textColor: TEXTS.white,
      };
    case "green":
      return {
        backgroundColor: COLORS.success,
        shadowColor: COLORS.successDark,
        textColor: TEXTS.white,
      };
    case "blue":
      return {
        backgroundColor: COLORS.info,
        shadowColor: COLORS.infoDark,
        textColor: TEXTS.white,
      };
    case "grey":
    default:
      return {
        backgroundColor: COLORS.inactive,
        shadowColor: COLORS.inactiveDark,
        textColor: TEXTS.white,
      };
  }
};

const Button = ({
  text,
  onPress,
  disabled,
  colorType = "grey",
  width = 100,
  height = 45,
  fontSize = 14,
}: Props) => {
  const colors = getColors(colorType);

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          backgroundColor: colors.backgroundColor,
          shadowColor: colors.shadowColor,
          width,
          height,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.btnText, { color: colors.textColor, fontSize }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    letterSpacing: 0.3,
    fontWeight: "600",
  },
});

export default Button;
