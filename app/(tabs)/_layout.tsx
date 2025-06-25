import { Tabs } from 'expo-router';
import { Chrome as Home, Users, DollarSign, TrendingDown, FileText, UserCheck, CreditCard, ChartBar as BarChart3, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) return null;

  const getTabsForRole = () => {
    switch (user.role) {
      case 'owner':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'attendance', title: 'Attendance', icon: UserCheck },
          { name: 'salary', title: 'Salary', icon: DollarSign },
          { name: 'losses', title: 'Losses', icon: TrendingDown },
          { name: 'customers', title: 'Customers', icon: CreditCard },
          { name: 'reports', title: 'Reports', icon: BarChart3 },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      case 'supervisor':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'attendance', title: 'Attendance', icon: UserCheck },
          { name: 'losses', title: 'Losses', icon: TrendingDown },
          { name: 'customers', title: 'Customers', icon: CreditCard },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      case 'dsm':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'attendance', title: 'My Duty', icon: UserCheck },
          { name: 'salary', title: 'Salary', icon: DollarSign },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      case 'customer':
        return [
          { name: 'index', title: 'My Account', icon: Home },
          { name: 'transactions', title: 'History', icon: FileText },
          { name: 'profile', title: 'Profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      {tabs.map(tab => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ size, color }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}