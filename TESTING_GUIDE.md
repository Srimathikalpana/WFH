# Implementation Checklist & Testing Guide

## ✅ Completed Components

### Theme System
- [x] constants/theme.ts - Complete design system
- [x] Colors object with all variants
- [x] Typography object with sizes & weights
- [x] Spacing constants
- [x] BorderRadius constants
- [x] TextStyles preset definitions

### UI Components
- [x] Card.tsx - Surface container
- [x] Badge.tsx - Status badges (success, warning, error, info)
- [x] TextField.tsx - Form input with validation
- [x] GradientButton.tsx - CTA buttons
- [x] PillSelect.tsx - Status/mode selector
- [x] ScreenWrapper.tsx - Layout wrapper
- [x] CustomBottomTabBar.tsx - 5-tab navigation

### Screens
- [x] SplashScreen.tsx - Splash with animations
- [x] LoginScreen.tsx - Auth with role selection
- [x] DashboardScreen.tsx - Dashboard with stats/activity
- [x] AttendanceScreen.tsx - Check-in/out with status
- [x] LeaveScreen.tsx - Leave management
- [x] NotificationScreen.tsx - Notification center
- [x] AttendanceHistoryScreen.tsx - History & logs
- [x] ChatListScreen.tsx - Chat conversations
- [x] ProfileScreen.tsx - User profile management

### Navigation
- [x] RootNavigator.tsx - Auth routing
- [x] MainTabNavigator.tsx - Updated with 5 tabs + CustomBottomTabBar

## 🔴 TODO - Before Running App

### 1. Fix StatusScreen/remove if unused
```bash
# Check if StatusScreen is imported anywhere:
grep -r "StatusScreen" src/

# If not used, can leave as-is (won't be imported)
# If needed, update to use new design system
```

### 2. Verify all imports in screens
Screens should NOT have import errors. Check:
```
- Dashboard imports: useAttendance, getDashboard
- Attendance imports: useAttendance, Location  
- Leave imports: useLeave
- Profile imports: useAuth, getUserById, updateUser
- Chat imports: getConversations
```

### 3. Test Navigation Flow
```bash
npm start

# Manual testing path:
1. Splash screen should auto-dismiss after 3s
2. Login screen (test with sample credentials)
3. Dashboard loads
4. All 5 bottom tabs work:
   - Dashboard
   - Attendance 
   - Leave
   - Alerts (Notifications)
   - Profile
5. Navigation to sub-screens works
```

### 4. Check Dependencies
```bash
npm ls

# Required packages (should be installed):
✓ expo-linear-gradient
✓ expo-notifications
✓ @react-navigation/*
✓ expo-location
✓ socket.io-client
✓ axios
```

If missing:
```bash
npm install expo-linear-gradient expo-notifications
```

### 5. Common Import Fixes
If you see "module not found" errors:

**For Theme imports:**
```tsx
import { Colors, Typography, BorderRadius, Spacing } from '../constants/theme';
// Not: from '../constants/theme.ts' (don't add .ts)
```

**For UI components:**
```tsx
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
// Check the relative path matches your file location
```

**For screens:**
- Use: `import ScreenWrapper from '../components/ui/ScreenWrapper';`
- Use: `import Card from '../components/ui/Card';`
- All files should be in src/components/ui/ or src/screens/

### 6. Data Integration Points
Screens currently use:
- **useAttendance()** hook - update with real API
- **getDashboard()** service - update with real data
- **useLeave()** hook - update with real API
- **getConversations()** service - update with real chats
- **getNotifications()** - NOT YET CREATED - see below

### 7. Notifications Backend (NOT YET IMPLEMENTED)
Create these API endpoints:

```typescript
// src/services/notificationService.ts
export async function getNotifications(userId: string) {
  // GET /api/notifications?userId=...
  // Returns paginated notifications
}

export async function markAsRead(notifId: string) {
  // PATCH /api/notifications/:id/read
}

export async function deleteNotification(notifId: string) {
  // DELETE /api/notifications/:id
}
```

Update NotificationScreen.tsx to use these services instead of mock data.

## 🎯 Quick Start Commands

```bash
# 1. Install dependencies
cd HybridWorkforceMobileApp
npm install

# 2. Start app
npm start

# 3. Run on Android
npm run android

# 4. Run on iOS
npm run ios

# 5. Run on Web
npm run web

# 6. Run linter
npm run lint
```

## 📱 Screen Flow

```
SplashScreen (3 seconds)
    ↓
LoginScreen (email/password/role)
    ↓
RootNavigator (authenticated)
    ↓
MainTabNavigator (5 tabs)
    ├─ Dashboard
    │   ├─ Today's Activity
    │   └─ Status/Stats
    │
    ├─ Attendance
    │   ├─ Check In/Out
    │   ├─ Status Selection
    │   └─ Location Verification
    │
    ├─ Leave
    │   ├─ New Request
    │   ├─ My Requests
    │   └─ Team View
    │
    ├─ Alerts (Notifications)
    │   ├─ Today
    │   └─ Yesterday
    │
    └─ Profile
        ├─ Edit Profile
        ├─ Account Settings
        └─ Sign Out

Stack Routes (from any tab):
├─ ChatRoom (from Dashboard or Chat icons)
└─ AttendanceHistory (from Dashboard)
```

## 🐛 Common Issues & Fixes

### Issue: "Cannot find module 'expo-linear-gradient'"
**Fix:**
```bash
npm install expo-linear-gradient
```

### Issue: "ReferenceError: CustomBottomTabBar is not a component"
**Fix:** Ensure CustomBottomTabBar.tsx exists in src/components/ui/

### Issue: Colors not found errors
**Fix:** Check imports use: `Colors` from `'../constants/theme'`
NOT `Colors.dark` or `Colors.light` (those were old)

### Issue: Navigation shows old screens
**Fix:** Cold reload:
```bash
npm start -- --reset-cache
# Or: expo start --reset-cache  
```

### Issue: Styles look wrong
**Check:**
- Are you using the new theme? (`Colors` object)
- Are components importing from `../constants/theme`?
- Is text dark on dark? Should be `Colors.text.primary`

## 📋 Testing Checklist

### Visual Testing
- [ ] All screens render without errors
- [ ] Text is readable (proper contrast)
- [ ] Buttons are clickable and show active state
- [ ] Cards have proper border styles
- [ ] Badges show correct colors per variant
- [ ] Bottom navigation looks correct (5 tabs)
- [ ] Status colors match: green/orange/red

### Functional Testing
- [ ] Login works with credentials
- [ ] Navigation between tabs works
- [ ] Back button works correctly
- [ ] Scroll views work on all screens
- [ ] Buttons trigger correct actions
- [ ] Form inputs capture values
- [ ] Alerts/Notifications display correctly

### Responsive Testing
- [ ] Works on small phones (iPhone SE)
- [ ] Works on large phones (Android XL)
- [ ] Landscape mode (if supported)
- [ ] Tab bar doesn't overlap content
- [ ] Text doesn't overflow

## 💡 Pro Tips

1. **Use StatusBar Correctly:**
   - ScreenWrapper already handles this
   - Set to light-content with dark background

2. **Colors Reference:**
   - Backgrounds: Colors.background.*
   - Text: Colors.text.*
   - Status: Colors.success/warning/error/info
   - Borders: Colors.border.*

3. **Spacing Reference:**
   - xs: 2px, sm: 4px, md: 8px, lg: 12px, xl: 16px, 2xl: 24px, 3xl: 32px

4. **Typography Reference:**
   - Use TextStyles presets for consistency
   - Or build custom styles using Typography.fontSize & fontWeight

5. **Testing Hooks:**
   - All screens use custom hooks (useAttendance, useLeave, etc.)
   - These should be connected to real APIs, not mock data

## 🚨 Critical Files to Check

1. **src/components/ui/** - All UI components must exist
2. **src/screens/** - All screen files must exist
3. **src/constants/theme.ts** - Design system
4. **src/navigation/** - RootNavigator & MainTabNavigator
5. **src/context/AuthContext.tsx** - Auth state
6. **src/hooks/** - Custom hooks (must exist for screens)
7. **src/services/** - API services (must match hooks)

---

**Once you've completed these checks and fixed any issues, your app should be ready to launch!**
