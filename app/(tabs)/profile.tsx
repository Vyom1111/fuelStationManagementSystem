import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Mail, Phone, MapPin, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Camera, CreditCard, Calendar } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented.');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality will be implemented.');
  };

  const handleNotificationSettings = () => {
    Alert.alert('Notifications', 'Notification settings will be implemented.');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help and support functionality will be implemented.');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'supervisor':
        return 'Supervisor (SS)';
      case 'dsm':
        return 'DSM (Fuel Attendant)';
      case 'customer':
        return 'Customer';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return '#ef4444';
      case 'supervisor':
        return '#3b82f6';
      case 'dsm':
        return '#10b981';
      case 'customer':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <User size={40} color="#ffffff" />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user?.role || '') }]}>
              <Text style={styles.roleText}>{getRoleDisplayName(user?.role || '')}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail size={20} color="#6b7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Phone size={20} color="#6b7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone}</Text>
              </View>
            </View>
            
            {user?.employeeId && (
              <View style={styles.infoRow}>
                <CreditCard size={20} color="#6b7280" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Employee ID</Text>
                  <Text style={styles.infoValue}>{user.employeeId}</Text>
                </View>
              </View>
            )}
            
            {user?.customerId && (
              <View style={styles.infoRow}>
                <CreditCard size={20} color="#6b7280" />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Customer ID</Text>
                  <Text style={styles.infoValue}>{user.customerId}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Calendar size={20} color="#6b7280" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Member Since</Text>
                <Text style={styles.infoValue}>January 2025</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} onPress={handleNotificationSettings}>
              <Bell size={20} color="#6b7280" />
              <Text style={styles.settingText}>Notifications</Text>
              <Text style={styles.settingValue}>On</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
              <Shield size={20} color="#6b7280" />
              <Text style={styles.settingText}>Change Password</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow}>
              <MapPin size={20} color="#6b7280" />
              <Text style={styles.settingText}>Location Services</Text>
              <Text style={styles.settingValue}>Enabled</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} onPress={handleHelp}>
              <HelpCircle size={20} color="#6b7280" />
              <Text style={styles.settingText}>Help & Support</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingRow}>
              <Settings size={20} color="#6b7280" />
              <Text style={styles.settingText}>App Settings</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Petrol Pump Management System</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  settingsSection: {
    padding: 20,
    paddingTop: 0,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  supportSection: {
    padding: 20,
    paddingTop: 0,
  },
  logoutSection: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});