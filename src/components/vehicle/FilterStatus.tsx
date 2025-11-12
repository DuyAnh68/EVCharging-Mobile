import { COLORS, TEXTS } from "@src/styles/theme";
import type { Summary, SummaryItem } from "@src/types/invoice";
import { formatRoundedAmount } from "@src/utils/formatData";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterStatusProps {
  summary: Summary;
  selected?: string;
  onSelect: (status: string) => void;
  isPayment?: boolean;
}

const FilterStatus: React.FC<FilterStatusProps> = ({
  summary,
  selected,
  onSelect,
  isPayment = false,
}) => {
  const filters = [
    {
      id: "1",
      title: "Đã thanh toán",
      value: "paid",
      color: COLORS.success,
      summary: summary.paid,
    },
    {
      id: "2",
      title: "Chưa thanh toán",
      value: "unpaid",
      color: COLORS.danger,
      summary: summary.unpaid,
    },
  ];

  const renderFilterCard = (
    title: string,
    value: string,
    summary: SummaryItem,
    bgColor: string,
    disabled: boolean = false
  ) => {
    const isSelected = selected === value;
    const isPaidDisabled = disabled && value === "paid";

    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.filterCard,
          isSelected && {
            backgroundColor: `${bgColor}15`,
            borderLeftColor: bgColor,
          },
          isPaidDisabled && { opacity: 0.5 },
        ]}
        onPress={() => onSelect(value)}
        disabled={disabled}
        activeOpacity={isPaidDisabled ? 0.5 : disabled ? 1 : 0.7}
      >
        <Text style={styles.filterLabel}>{title}</Text>
        <Text style={[styles.filterCount, isSelected && { color: bgColor }]}>
          {summary.count}
        </Text>
        <Text
          style={[styles.filterAmount, isSelected && { color: COLORS.black }]}
        >
          {formatRoundedAmount(summary.totalAmount, { asString: true })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) =>
        renderFilterCard(
          filter.title,
          filter.value,
          filter.summary,
          filter.color,
          isPayment
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
    marginHorizontal: 16,
  },
  filterCard: {
    flex: 1,
    borderLeftWidth: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 80,
    backgroundColor: COLORS.gray100,
    borderLeftColor: COLORS.gray300,
  },
  filterLabel: {
    fontSize: 12,
    color: TEXTS.secondary,
    fontWeight: "500",
    marginBottom: 4,
  },
  filterCount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  filterAmount: {
    fontSize: 13,
    color: TEXTS.secondary,
    fontWeight: "600",
  },
});

export default FilterStatus;
