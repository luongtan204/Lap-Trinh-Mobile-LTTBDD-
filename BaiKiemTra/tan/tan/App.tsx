import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ProductList from "./components/ProductList";
import CartSummary from "./components/CartSummary";

export type Product = {
  id: string;
  name: string;
  price: number;
};

const products: Product[] = [
  { id: "1", name: "Cà phê sữa", price: 20000 },
  { id: "2", name: "Trà sữa trân châu", price: 30000 },
  { id: "3", name: "Sinh tố xoài", price: 25000 },
  { id: "4", name: "Nước cam", price: 15000 },
];

export default function App() {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.container}>
      <CartSummary count={cart.length} total={totalPrice} />
      <ProductList products={products} addToCart={addToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
});
