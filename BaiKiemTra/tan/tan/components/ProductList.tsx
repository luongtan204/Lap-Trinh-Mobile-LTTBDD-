import React from "react";
import { FlatList } from "react-native";
import ProductItem from "./ProductItem";
import { Product } from "../App";

type Props = {
  products: Product[];
  addToCart: (product: Product) => void;
};

export default function ProductList({ products, addToCart }: Props) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductItem product={item} addToCart={addToCart} />
      )}
    />
  );
}
