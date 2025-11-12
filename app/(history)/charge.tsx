import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Card from "@src/components/history/charge/Card";
import EmptyState from "@src/components/history/charge/EmptyState";
import ModalPopup from "@src/components/ModalPopup";
import { useAuthContext } from "@src/context/AuthContext";
import { useLoading } from "@src/context/LoadingContext";
import { useSession } from "@src/hooks/useSession";
import { COLORS, TEXTS } from "@src/styles/theme";
import { SessionDetail } from "@src/types/session";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Charge() {
  // State
  const [sessions, setSessions] = useState<SessionDetail[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const selectedFilter = "completed";
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Hook
  const { user } = useAuthContext();
  const { isLoading } = useLoading();
  const { getSessionsCompleted } = useSession();

  // Api
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    const res = await getSessionsCompleted(user?.userId);

    if (res.success && res.sessions) {
      setSessions(res.sessions);
      return;
    }

    setErrorMsg(res.message || "Không thể lấy lịch sử sạc!");
    setShowError(true);
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSessions();
    setRefreshing(false);
  }, [fetchSessions]);

  // Handle logic
  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleConfirmError = () => {
    fetchSessions();
    setShowError(false);
    setErrorMsg("");
  };

  // UseEffect
  useEffect(() => {
    fetchSessions();
  }, []);

  // Render item
  const renderSession = ({ item }: { item: SessionDetail }) => (
    <Card session={item} />
  );

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View>
          <Text style={styles.title}>Lịch sử sạc</Text>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{sessions.length} </Text>
            <Ionicons name="flash" size={20} color={COLORS.white} />
          </View>
        </View>
        <TouchableOpacity style={styles.backContainer} onPress={handleBack}>
          <Ionicons name="chevron-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* List */}
      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      ) : (
        !isLoading && <EmptyState filter={selectedFilter} />
      )}

      {/* Toast Modal */}
      {showError && (
        <ModalPopup
          visible={showError}
          mode="confirm"
          contentText={errorMsg}
          icon={<FontAwesome5 name="exclamation" size={30} color="white" />}
          iconBgColor="red"
          confirmBtnText="Thử lại"
          confirmBtnColor="blue"
          cancelBtnText="Đóng"
          cancelBtnColor="grey"
          onClose={() => {
            setShowError(false);
            setErrorMsg("");
          }}
          onConfirm={handleConfirmError}
          modalWidth={355}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: TEXTS.white,
    marginBottom: 4,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 14,
    color: TEXTS.white,
  },
  backContainer: {
    position: "absolute",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 40,
    left: 15,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
});
