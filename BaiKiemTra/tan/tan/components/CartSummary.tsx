import React from "react";
import { Text, StyleSheet } from "react-native";

type Props = {
  count: number;
  total: number;
};

export default function CartSummary({ count, total }: Props) {
  return (
    <Text style={styles.cartInfo}>
       {count} sản phẩm | Tổng: {total.toLocaleString()} đ
    </Text>
  );
}

const styles = StyleSheet.create({
  cartInfo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
});
