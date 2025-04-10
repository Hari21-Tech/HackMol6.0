import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';

const shops = [
  {
    id: 1,
    name: 'Burger Bite',
    category: 'Food and Beverages',
    image: 'https://source.unsplash.com/featured/?burger',
  },
  {
    id: 2,
    name: 'Salon Xpress',
    category: 'Barbers',
    image: 'https://source.unsplash.com/featured/?barber',
  },
  {
    id: 3,
    name: 'Glow Beauty',
    category: 'Beauty Parlors',
    image: 'https://source.unsplash.com/featured/?beauty',
  },
  {
    id: 4,
    name: 'ElectroMart',
    category: 'Electronic Shops',
    image: 'https://source.unsplash.com/featured/?electronics',
  },
  {
    id: 5,
    name: 'AutoFix Garage',
    category: 'Automotive Garages',
    image: 'https://source.unsplash.com/featured/?garage',
  },
];

const categories = [
  'All',
  'Food and Beverages',
  'Barbers',
  'Beauty Parlors',
  'Electronic Shops',
  'Automotive Garages',
];

export default function QueuePage({ navigation }) {
  const [joinedShop, setJoinedShop] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);
  const [isSigninModalVisible, setIsSigninModalVisible] = useState(false);
  const [selectedShopForConfirmation, setSelectedShopForConfirmation] =
    useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);

  const handleJoinQueue = (shop) => {
    if (isUserSignedIn) {
      setSelectedShopForConfirmation(shop);
      setIsConfirmationModalVisible(true);
    } else {
      setIsSigninModalVisible(true);
    }
  };

  const closeSigninModal = () => {
    setIsSigninModalVisible(false);
  };

  const filteredShops =
    selectedCategory === 'All'
      ? shops
      : shops.filter((shop) => shop.category === selectedCategory);

  const renderShop = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <TouchableOpacity
          onPress={() => handleJoinQueue(item)}
          style={[styles.button]}
        >
          <Text style={styles.buttonText}>Join Queue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Select Category:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredShops}
        renderItem={renderShop}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
      />

      <Toast />

      <Modal
        transparent={true}
        visible={isSigninModalVisible}
        animationType="fade"
        onRequestClose={closeSigninModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={{ fontFamily: 'Inter_400Regular' }}>
              You need to sign in first.
            </Text>
            <Button
              title="Sign In"
              onPress={() => {
                navigation.navigate('Shop');
                setIsUserSignedIn(true);
                closeSigninModal();
              }}
            />
            <View style={{ height: 10 }} />
            <Button title="Cancel" onPress={closeSigninModal} />
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isConfirmationModalVisible}
        animationType="fade"
        onRequestClose={() => setIsConfirmationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>
              Are you sure you want to join the queue for{' '}
              <Text
                style={{ fontWeight: 'bold', fontFamily: 'Inter_400Regular' }}
              >
                {selectedShopForConfirmation?.name}
              </Text>
              ?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setJoinedShop(selectedShopForConfirmation.id);
                setIsConfirmationModalVisible(false);
                navigation.navigate('Shop', {
                  shop: selectedShopForConfirmation,
                });
              }}
            >
              <Text style={styles.modalButtonText}>Yes, Join Queue</Text>
            </TouchableOpacity>
            <View style={{ height: 10 }} />
            <TouchableOpacity
              style={styles.modalButtonOutline}
              onPress={() => setIsConfirmationModalVisible(false)}
            >
              <Text style={styles.modalButtonOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 60,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalCard: {
    width: '80%',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  modalButtonOutline: {
    borderWidth: 1,
    borderColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonOutlineText: {
    color: '#4f46e5',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});
