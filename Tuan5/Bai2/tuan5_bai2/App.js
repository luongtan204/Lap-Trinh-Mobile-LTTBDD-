import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
const DATA = [
  {
    id: '1',
    image: require('./assets/carbusbtops2 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
  {
    id: '2',
    image: require('./assets/daucam 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
  {
    id: '3',
    image: require('./assets/dauchuyendoi 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
  {
    id: '4',
    image: require('./assets/dauchuyendoipsps2 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
  {
    id: '5',
    image: require('./assets/daynguon 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
  {
    id: '6',
    image: require('./assets/giacchuyen 1.png'),
    title: 'Cáp chuyển từ Cổng USB sang PS2...',
    price: '69.900 đ',
    rating: 4,
    reviews: 15,
    discount: 39,
  },
];

const renderStars = (count: number) => (
  <View style={{ flexDirection: 'row', marginVertical: 1, alignItems: 'center' }}>
    {[...Array(5)].map((_, idx) => (
      <Text key={idx} style={{ color: idx < count ? '#FFD600' : '#ccc', fontSize: 15 }}>★</Text>
    ))}
  </View>
);

const ProductItem = ({ image, title, rating, reviews, price, discount }: any) => (
  <View style={styles.productItem}>
    <Image source={image} style={styles.productImage} />
    <Text style={styles.productTitle} numberOfLines={2}>{title}</Text>
    <View style={styles.ratingRow}>
      {renderStars(rating)}
      <Text style={styles.ratingNumber}>({reviews})</Text>
    </View>
    <View style={styles.priceRow}>
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.discount}>-{discount}%</Text>
    </View>
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1BA9FF' }}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.headerIcon} source={require('./assets/ant-design_arrow-left-outlined.png')} />
        <View style={styles.searchBar}>
          <Image style={{ width: 30, height: 30, marginRight: 6 }} source={require('./assets/whh_magnifier.png')} />
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Dây cáp usb"
            placeholderTextColor="#444"
            value="Dây cáp usb"
            editable={false}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Image style={styles.headerIcon} source={require('./assets/bi_cart-check.png')} />
            <View style={styles.cartBadge} />
          </View>
          <Image style={[styles.headerIcon, { marginLeft: 16 }]} source={require('./assets/Group 2 (1).png')} />
        </View>
      </View>
      {/* Product Grid */}
      <View style={styles.body}>
        <FlatList
          data={DATA}
          numColumns={2}
          renderItem={({ item }) => <ProductItem {...item} />}
          keyExtractor={item => item.id}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 10 }}
          contentContainerStyle={{ padding: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('./assets/Group 10.png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('./assets/Vector (Stroke).png')} style={styles.footerIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('./assets/Vector 1 (Stroke).png')} style={styles.footerIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1BA9FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  headerIcon: {
   
    tintColor: 'white',
    marginHorizontal: 4,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    marginHorizontal: 10,
    paddingHorizontal: 8,
    height: 40,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: -3,
    width: 13,
    height: 13,
    borderRadius: 8,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
  },
  body: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  productItem: {
    backgroundColor: '#fff',
    flex: 1,
    margin: 4,
    alignItems: 'flex-start',
    borderRadius: 6,
    overflow: 'hidden',
    minHeight: 180,
    maxWidth: '48%',
    padding: 6,
    elevation: 1,
  },
  productImage: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginBottom: 1,
    marginTop: 2,
    minHeight: 30,
    maxHeight: 34,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingNumber: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 6,
  },
  discount: {
    fontSize: 14,
    color: '#1BA9FF',
    fontWeight: '500',
  },
  footer: {
    height: 54,
    flexDirection: 'row',
    backgroundColor: '#1BA9FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  
  footerIcon: {
    tintColor:"black",
   justifyContent: 'space-between'
  },
});