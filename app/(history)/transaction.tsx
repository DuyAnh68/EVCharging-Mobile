import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Card from "@src/components/history/transaction/Card";
import EmptyState from "@src/components/history/transaction/EmptyState";
import FilterType from "@src/components/history/transaction/FilterType";
import ModalPopup from "@src/components/ModalPopup";
import { useLoading } from "@src/context/LoadingContext";
import { useTransaction } from "@src/hooks/useTransaction";
import { COLORS, TEXTS } from "@src/styles/theme";
import { Summary, Transaction } from "@src/types/transaction";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TransactionScreen = () => {
  // State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>();
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Hook
  const { isLoading } = useLoading();
  const { getTransactions } = useTransaction();

  // Api
  const fetchTransactions = useCallback(async () => {
    const res = await getTransactions(filterType);

    if (res.success && res.transactions) {
      setTransactions(res.transactions);
      if (res.summary) {
        setSummary(res.summary);
      }
      return;
    }

    setErrorMsg(res.message || "Không thể lấy danh sách giao dịch!");
    setShowError(true);
  }, [filterType]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();

    setRefreshing(false);
  }, [fetchTransactions]);

  // Handle logic
  const handleBack = () => {
    router.replace("/(tabs)/profile");
  };

  const handleConfirmError = () => {
    fetchTransactions();
    setShowError(false);
    setErrorMsg("");
  };

  const handleFilterSelected = (type: string) => {
    setFilterType((prev) => (prev === type ? undefined : type));
  };

  // UseEffect
  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  // Render
  const renderItem = ({ item }: { item: Transaction }) => (
    <Card transaction={item} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Lịch sử giao dịch</Text>

        <TouchableOpacity style={styles.backContainer} onPress={handleBack}>
          <Ionicons name="chevron-back" size={25} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {summary && (
        <View style={styles.filterContainer}>
          <FilterType
            summary={summary}
            selected={filterType}
            onSelect={handleFilterSelected}
          />
        </View>
      )}

      {/* Transaction List */}
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !isLoading ? <EmptyState filter={filterType} /> : null
        }
        contentContainerStyle={
          transactions.length === 0
            ? styles.flatListEmpty
            : styles.listcontainer
        }
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />

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
};

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
    bottom: 20,
    left: 15,
  },
  filterContainer: {
    marginVertical: 10,
    maxHeight: 85,
    minHeight: 85,
  },
  listcontainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
    gap: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
  },
});

export default TransactionScreen;
