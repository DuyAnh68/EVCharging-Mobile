import * as Linking from "expo-linking";

const prefix = Linking.createURL("/");

export default {
  prefixes: [prefix, "evchargingapp://"],
  config: {
    screens: {
      "(vnpay)": {
        screens: {
          subscription: "vnpay/subscription",
        },
      },
    },
  },
};
