import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DiscoverScreen } from "@/screens/discover/DiscoverScreen";
import { MatchesScreen } from "@/screens/matches/MatchesScreen";
import { ProfileStack } from "@/navigation/ProfileStack";

export type MainTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E94057",
        tabBarInactiveTintColor: "#9CA3AF",
      }}
    >
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarLabel: "Matches",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}
