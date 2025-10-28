import { useSession } from "@src/hooks/useSession";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

const SessionDetail = () => {
  const [session, setSession] = useState(null);
  const { bookingId } = useLocalSearchParams();
  const { generateQR } = useSession();
  const generateQRForSession = async () => {
    try {
      const res = await generateQR(bookingId);
      if (res.success) {
        setSession(res.data);
      }
    } catch (error) {
      Alert.alert("Fail");
    }
  };

  useEffect(() => {
    generateQRForSession();
  }, [bookingId]);

  console.log(session);
  return <View></View>;
};

export default SessionDetail;
