/* =========================
   BASE COLOR PALETTES
========================= */
const GREEN = {
  green900: "#064E3B",
  green800: "#047857",
  green700: "#059669",
  green600: "#10B981", // main green
  green500: "#22C55E",
  green400: "#34D399",
  green300: "#6EE7B7",
  green200: "#A7F3D1",
  green100: "#D1FAE5",
  green50: "#F0FDF4",
};

const BLUE = {
  blue50: "#EFF6FF",
  blue100: "#DBEAFE",
  blue200: "#BFDBFE",
  blue300: "#93C5FD",
  blue400: "#60A5FA",
  blue500: "#3B82F6", // main blue
  blue600: "#2563EB",
  blue700: "#1D4ED8",
  blue800: "#1E40AF",
  blue900: "#1E3A8A",
};

const GRAY = {
  gray100: "#F3F4F6",
  gray300: "#D3D3D3",
  gray400: "#A9A9A9",
  gray500: "#9CA3AF", // placeholder
  gray600: "#6B7280", // icon default
  gray700: "#4B5563", // secondary
};

/* =========================
   MERGED COLORS
========================= */
export const COLORS = {
  ...GREEN,
  ...BLUE,
  ...GRAY,

  white: "#FFFFFF",
  black: "#000000",

  /* =========================
   COLOR ALIASES
========================= */
  primary: GREEN.green600,
  primaryDark: GREEN.green700,
  primaryDarker: GREEN.green800,
  primaryLight: GREEN.green400,
  primaryLighter: GREEN.green300,

  secondary: BLUE.blue600,
  secondaryDark: BLUE.blue700,
  secondaryDarker: BLUE.blue800,
  secondaryLight: BLUE.blue300,
  secondaryLighter: BLUE.blue100,

  /* =========================
     STATUS COLORS
  ========================= */
  warning: "#FFC400",
  warningDark: "#E0A800",
  warningLight: "#FFF4CC",

  danger: "#ED3500",
  dangerDark: "#B71C1C",
  dangerLight: "#FDECEC",

  success: GREEN.green500,
  successDark: GREEN.green700,
  successLight: GREEN.green100,

  info: BLUE.blue400,
  infoDark: BLUE.blue700,
  infoLight: BLUE.blue100,

  inactive: GRAY.gray400,
  inactiveDark: GRAY.gray700,
  inactiveLight: GRAY.gray100,

  /* =========================
     GRADIENTS
  ========================= */
  gradient_1: ["#10B981", "#059669", "#047857"] as const,
  gradient_2: ["#064E3B", "#047857", "#10B981", "#34D399", "#6EE7B7"] as const,
  gradient_3: ["#FFFFFF", "#D1FAE5", "#6EE7B7", "#10B981"] as const,
  gradient_4: ["#F0FDF4", "#E2FAE9", "#D3F0FF", "#EFF6FF"] as const,

  /* =========================
     INPUT & FORM COLORS
  ========================= */
  inputBg: "#F0FDF4CC",
  inputBgFocused: "#FFFFFF",
  inputBorder: "#10B98133",
  inputBorderFocused: "#10B98199",

  /* =========================
     CIRCLES / DECORATIVE ELEMENTS
  ========================= */
  circle1: "#34D39926",
  circle2: "#6EE7B81F",
  circle3: "#34D39933",
  circle4: "#A7F3D12E",
  circle5: "#34D3991A",

  /* =========================
     BACKGROUNDS
  ========================= */
  background: "#F5F5F5",
  blurBg: "#FFFFFFF2",
};

/* =========================
   TEXT COLORS
========================= */
export const TEXTS = {
  primary: COLORS.black,
  secondary: COLORS.gray700,
  placeholder: COLORS.gray500,
  white: COLORS.white,
  link: COLORS.primary,
};
