import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/StaffInventoryDesign';

const StaffInventory = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <Image source={require('../../assets/paw1.png')} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>PawCruz</Text>
      </View>

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>Inventory</Text>
        {/* Linked to StaffNotif */}
        <TouchableOpacity onPress={() => navigation.navigate('StaffNotif')}>
          <Image source={require('../../assets/Bell_Icon.png')} style={styles.bellIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.tabGroup}>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>All</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}><Text style={styles.activeTabText}>Medicines</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Vaccines</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addItemBtn}>
          <Text style={styles.addItemText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TextInput style={styles.searchBar} placeholder="Search inventory" placeholderTextColor="#999" />
      </View>

      <ScrollView>
        {/* Item 1: Bravecto */}
        <View style={styles.inventoryCard}>
          <View style={styles.iconBox}>
             <Image source={require('../../assets/Medical_Icon.png')} style={styles.itemIcon} />
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.itemName}>Bravecto</Text>
            <Text style={styles.itemSub}>USR-000076 | maria@example.com</Text>
            <View style={[styles.tag, {backgroundColor: '#72a0a6'}]}>
              <Text style={styles.tagText}>MEDICINES</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Item 2: Rabies Vaccine (Low Stock) */}
        <View style={styles.inventoryCard}>
          <View style={styles.iconBox}>
             <Image source={require('../../assets/Medical_Icon.png')} style={styles.itemIcon} />
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.itemName}>Rabies Vaccine</Text>
            <Text style={styles.itemSub}>USR-00000 | mark.lopez@example.com</Text>
            <View style={[styles.tag, {backgroundColor: '#d9a15c'}]}>
              <Text style={styles.tagText}>LOW STOCK</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('staff-screen')}>
          <Image source={require('../../assets/Dashboard_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        {/* Messages */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffMessages')}>
          <Image source={require('../../assets/Message_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        
        {/* Account - Linked to StaffProfile */}
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('StaffProfile')}>
          <Image source={require('../../assets/User_Icon.png')} style={[styles.navIcon, {tintColor: '#000'}]} resizeMode="contain" />
          <Text style={styles.navLabel}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StaffInventory;