import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../App";

type Props = {
  product: Product;
  addToCart: (product: Product) => void;
};

export default function ProductItem({ product, addToCart }: Props) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toLocaleString()} đ</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => addToCart(product)}>
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
