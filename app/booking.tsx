import DateTimePicker from "@react-native-community/datetimepicker";
import { Background } from "@src/components/AppBg";
import { useAuthContext } from "@src/context/AuthContext";
import { useBooking } from "@src/hooks/useBooking";
import { COLORS } from "@src/styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar, CheckCircle, Clock } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingScreen() {
  const { stationId, vehicleId, booking, chargingPoint } =
    useLocalSearchParams();
  console.log(vehicleId);
  const { createBooking } = useBooking();
  const { user } = useAuthContext();
  console.log(booking);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const existingBookings = useMemo(() => {
    if (Array.isArray(booking)) return booking;
    if (typeof booking === "string") {
      try {
        const parsed = JSON.parse(booking);
        return parsed.bookings || parsed || [];
      } catch {
        return [];
      }
    }
    return booking?.bookings || [];
  }, [booking]);

  // ✅ Tạo danh sách slot
  useEffect(() => {
    const startHour = 8;
    const endHour = 22;
    const newSlots = [];

    for (let h = startHour; h < endHour; h++) {
      newSlots.push({ start: `${h}:00`, end: `${h}:30` });
      newSlots.push({ start: `${h}:30`, end: `${h + 1}:00` });
    }

    setSlots(newSlots);
  }, []);

  // ✅ Hàm hỗ trợ tạo Date theo múi giờ VN
  const toVietnamDate = (dateStr, timeStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    // Tạo đối tượng Date theo giờ VN
    return new Date(year, month - 1, day, hour, minute);
  };

  // ✅ Kiểm tra slot bị đặt
  const isSlotBooked = (slot) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const slotStart = toVietnamDate(dateStr, slot.start.padStart(5, "0"));
    const slotEnd = toVietnamDate(dateStr, slot.end.padStart(5, "0"));

    return existingBookings.some((b) => {
      // ✅ Chuyển UTC từ API thành giờ Việt Nam
      const start = new Date(new Date(b.start_time).getTime() + 7 * 3600000);
      const end = new Date(new Date(b.end_time).getTime() + 7 * 3600000);

      return slotStart < end && slotEnd > start;
    });
  };

  // ✅ Xử lý chọn slot liên tiếp
  const handleSelectSlot = (slot) => {
    const isSelected = selectedSlots.find(
      (s) => s.start === slot.start && s.end === slot.end
    );

    if (isSelected) {
      setSelectedSlots([]);
      return;
    }

    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    const sorted = [...selectedSlots].sort((a, b) =>
      a.start.localeCompare(b.start)
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const canExtendAfter = last.end === slot.start;
    const canExtendBefore = slot.end === first.start;

    if (canExtendAfter) {
      setSelectedSlots([...sorted, slot]);
    } else if (canExtendBefore) {
      setSelectedSlots([slot, ...sorted]);
    } else {
      Alert.alert("Chọn sai vị trí", "Vui lòng chọn các khung giờ liền nhau.");
    }
  };

  // ✅ Xử lý đặt chỗ
  const handleBooking = async () => {
    if (selectedSlots.length === 0) {
      Alert.alert("Chưa chọn khung giờ", "Vui lòng chọn ít nhất 1 khung giờ.");
      return;
    }

    const sorted = [...selectedSlots].sort((a, b) =>
      a.start.localeCompare(b.start)
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const dateStr = selectedDate.toISOString().split("T")[0];
    const start = toVietnamDate(dateStr, first.start.padStart(5, "0"));
    const end = toVietnamDate(dateStr, last.end.padStart(5, "0"));

    // ✅ Giờ hiện tại theo múi giờ Việt Nam (UTC+7)
    const now = new Date();
    const nowVN = new Date(
      now.getTime() + now.getTimezoneOffset() * 60000 + 7 * 3600000
    );

    if (start <= nowVN) {
      Alert.alert(
        "Thời gian không hợp lệ",
        "Vui lòng chọn ngày và giờ trong tương lai."
      );
      return;
    }

    const startUTC = new Date(start.getTime() - 7 * 3600000);
    const endUTC = new Date(end.getTime() - 7 * 3600000);

    const bookingReq = {
      user_id: user?.userId,
      station_id: stationId,
      vehicle_id: vehicleId,
      chargingPoint_id: chargingPoint,
      start_time: startUTC,
      end_time: endUTC,
    };

    try {
      const res = await createBooking(bookingReq);
      if (res?.success) {
        Alert.alert(
          "Đặt chỗ thành công",
          `Bạn đã đặt từ ${first.start} đến ${last.end} ngày ${dateStr}`,
          [{ text: "OK", onPress: () => router.replace("/") }]
        );
      } else {
        Alert.alert("Thất bại", res?.message || "Không thể đặt chỗ.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi hệ thống", "Không thể kết nối đến máy chủ.");
    }
  };

  const renderDate = () =>
    selectedDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // ✅ Render UI
  return (
    <Background>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Chọn ngày và khung giờ sạc</Text>

        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Calendar color="#10B981" size={18} />
          <Text style={styles.dateText}>{renderDate()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}

        <View style={styles.slotGrid}>
          {slots.map((slot, idx) => {
            const booked = isSlotBooked(slot);
            const selected = selectedSlots.some(
              (s) => s.start === slot.start && s.end === slot.end
            );
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.slot,
                  booked && styles.slotBooked,
                  selected && styles.slotSelected,
                ]}
                disabled={booked}
                onPress={() => handleSelectSlot(slot)}
              >
                <Clock
                  color={booked ? "#040608ff" : selected ? "#fff" : "#070707ff"}
                  size={16}
                />
                <Text
                  style={[
                    styles.slotText,
                    booked && styles.slotTextBooked,
                    selected && styles.slotTextSelected,
                  ]}
                >
                  {slot.start} - {slot.end}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: selectedSlots.length ? "#10B981" : "#9CA3AF" },
          ]}
          disabled={!selectedSlots.length}
          onPress={handleBooking}
        >
          <CheckCircle color="#fff" size={20} />
          <Text style={styles.buttonText}>Xác nhận đặt</Text>
        </TouchableOpacity>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#059669",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: { textAlign: "center", color: "#6B7280", marginBottom: 20 },
  datePicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 10,
    backgroundColor: "#0a4e2eff",
    borderRadius: 10,
    marginBottom: 12,
  },
  dateText: { fontSize: 16, color: "#047857", fontWeight: "600" },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  slot: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    opacity: 1,
  },
  slotBooked: {
    backgroundColor: COLORS.inactive,
    borderColor: COLORS.black,
    opacity: 0.7,
  },
  slotSelected: {
    backgroundColor: "#10B981",
    borderColor: "#059669",
  },
  slotText: { fontSize: 13, fontWeight: "500", color: "#111" },
  slotTextBooked: { color: "#111" },
  slotTextSelected: { color: "#fff" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
