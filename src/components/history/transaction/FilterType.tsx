import { COLORS, TEXTS } from "@src/styles/theme";
import { Summary, SummaryItem } from "@src/types/transaction";
import { formatRoundedAmount } from "@src/utils/formatData";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FilterTypeProps {
  summary: Summary;
  selected?: string;
  onSelect: (status: string) => void;
}

const FilterType: React.FC<FilterTypeProps> = ({
  summary,
  selected,
  onSelect,
}) => {
  const filters = [
    {
      id: "1",
      title: "Gói",
      value: "subscription",
      color: COLORS.warning,
      summary: summary.subscription,
    },
    {
      id: "2",
      title: "Phí đặt chỗ",
      value: "base_fee",
      color: COLORS.info,
      summary: summary.base_fee,
    },
    {
      id: "3",
      title: "Phí sạc",
      value: "charging",
      color: COLORS.success,
      summary: summary.charging,
    },
  ];

  const renderFilterCard = (
    title: string,
    value: string,
    summary: SummaryItem,
    bgColor: string
  ) => {
    const isSelected = selected === value;

    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.filterCard,
          isSelected && {
            backgroundColor: `${bgColor}15`,
            borderLeftColor: bgColor,
          },
        ]}
        onPress={() => onSelect(value)}
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
          filter.color
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

export default FilterType;
