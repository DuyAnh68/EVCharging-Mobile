import { Ionicons } from "@expo/vector-icons";
import InvoiceItem from "@src/components/history/transaction/InvoiceItem";
import { COLORS, TEXTS } from "@src/styles/theme";
import { InvoiceTransaction } from "@src/types/invoice";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  invoices: InvoiceTransaction[];
  onClose: () => void;
};

const Detail = ({ visible, invoices, onClose }: Props) => {
  // Handle
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <Pressable style={styles.overlay} onPress={handleClose} />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Chi tiết giao dịch</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.backContainer}
            >
              <Ionicons name="close" size={25} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.listContainer}>
              <FlatList
                data={invoices}
                renderItem={({ item }) => <InvoiceItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalContent: {
    paddingHorizontal: 10,
  },
  headerSection: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXTS.white,
    textAlign: "center",
  },
  backContainer: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  listContainer: {
    maxHeight: "100%",
  },
  list: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
});

export default Detail;
