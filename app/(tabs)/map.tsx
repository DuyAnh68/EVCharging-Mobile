import StationsMap from "@src/components/Map/StationsMap";
import { useStation } from "@src/hooks/useStation";
import { Station } from "@src/types/station";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const Map = () => {
  const { getStations } = useStation();
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    const fetchStations = async () => {
      const res = await getStations();
      if (res?.success) {
        setStations(res?.stations);
      }
    };
    fetchStations();
  }, []);
  return (
    <View style={styles.container}>
      <StationsMap stations={stations} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Map;
