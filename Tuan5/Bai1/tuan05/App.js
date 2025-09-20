import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const DATA = [
  {
    id: '1',
    title: 'Ca nấu lẩu, nấu mì mini...',
    shop: 'Shop Devang',
    image: require('./assets/ca_nau_lau.png'), // Add your real asset images here
  },
  {
    id: '2',
    title: '1KG KHÔ GÀ BƠ TỎI...',
    shop: 'Shop LTD Food',
    image: require('./assets/ga_bo_toi.png'),
  },
  {
    id: '3',
    title: 'Xe cần cẩu đa năng',
    shop: 'Shop Thế giới đồ chơi',
    image: require('./assets/xa_can_cau.png'),
  },
  {
    id: '4',
    title: 'Đồ chơi dạng mô hình',
    shop: 'Shop Thế giới đồ chơi',
    image: require('./assets/do_choi_dang_mo_hinh.png'),
  },
  {
    id: '5',
    title: 'Lãnh đạo giản đơn',
    shop: 'Shop Minh Long Book',
    image: require('./assets/lanh_dao_gian_don.png'),
  },
  {
    id: '6',
    title: 'Hiểu lòng con trẻ',
    shop: 'Shop Minh Long Book',
    image: require('./assets/hieu_long_con_tre.png'),
  },
];

type BookItemProps = {
  title: string;
  shop: string;
  image?: any;
};

const BookItem: React.FC<BookItemProps> = ({ title, shop, image }) => (
  <View style={styles.item}>
    <Image source={image} style={styles.img} resizeMode="cover" />
    <View style={styles.itemContent}>
      <Text numberOfLines={1} style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemShop}>
        <Text style={{ color: '#9E9E9E', fontWeight: '500' }}>Shop </Text>
        <Text style={{ color: 'red', fontWeight: '500' }}>{shop.replace('Shop ', '')}</Text>
      </Text>
    </View>
    <TouchableOpacity style={styles.chatBtn}>
      <Text style={styles.chatBtnText}>Chat</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.navbar}>
            <Image source={require('./assets/ant-design_arrow-left-outlined.png')} style={styles.navIcon} />
            <Text style={styles.navText}>Chat</Text>
            <Image source={require('./assets/bi_cart-check.png')} style={styles.navIcon} />
          </View>
          <View style={styles.main}>
            <View style={styles.noticeBar}>
              <Text style={styles.noticeText}>
                Bạn có thắc mắc với sản phẩm vừa xem đừng ngại chát với shop!
              </Text>
            </View>
            <FlatList
              data={DATA}
              renderItem={({ item }) => (
                <BookItem title={item.title} shop={item.shop} image={item.image} />
              )}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ backgroundColor: 'black' }}
            />
          </View>
           <View style={styles.navbar}>
            <Image source={require('./assets/Group 10.png')} style={styles.navIcon ,{tintColor:"black"}} />
            <Image source={require('./assets/Vector (Stroke).png')} style={styles.navIcon,{tintColor:"black"}} />
            <Image source={require('./assets/Vector 1 (Stroke).png')} style={styles.navIcon,{tintColor:"black"}} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1BA9FF' },
  container: { flex: 1, backgroundColor: '#1BA9FF' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1BA9FF',
    height: 60,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  navIcon: { width: 28, height: 28, tintColor: 'white' },
  navText: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  main: { flex: 1, backgroundColor: '#ecf0f1' },
  noticeBar: { backgroundColor: '#fff', padding: 10 },
  noticeText: { fontSize: 13, color: '#222', textAlign: 'center' },
  separator: { height: 2, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopColor:'grey',
    borderTopWidth:1,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  img: { width: 85, height: 85, marginRight: 10, borderRadius: 6, backgroundColor: '#eee' },
  itemContent: { flex: 1, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '500', marginBottom: 6, color: '#222' },
  itemShop: { fontSize: 15, marginBottom: 0, fontWeight: '500' },
  chatBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  chatBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 17 },
});