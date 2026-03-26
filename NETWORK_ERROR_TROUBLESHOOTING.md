# 🔧 Network Error Troubleshooting Guide

## Problem
Getting network errors when trying to login:
- ❌ "No response from server"
- ❌ "Network Error"
- ❌ Can't connect to backend

---

## 🎯 Quick Debug Checklist

Follow these steps in order:

### 1️⃣ Check Backend is Running

**Windows (PowerShell):**
```powershell
# Navigate to backend folder (adjust path as needed)
cd "C:\path\to\backend"

# Start backend server
npm run server
# OR
npm run dev
```

You should see something like:
```
✅ Server running on http://localhost:5000
✅ MongoDB connected
```

If backend is NOT running → That's your problem! Start it first.

---

### 2️⃣ Get Your Local IP Address

**Windows (PowerShell):**
```powershell
ipconfig
```

Look for **IPv4 Address** on your WiFi adapter (usually starts with 192.168.x.x)

Example output:
```
Wireless LAN adapter WiFi:
   IPv4 Address. . . . . . . . . : 192.168.1.25
   Subnet Mask . . . . . . . . . : 255.255.255.0
```

**Copy this IP address** (e.g., `192.168.1.25`)

---

### 3️⃣ Update API Configuration

Edit: `HybridWorkforceMobileApp/src/config/api.ts`

Find this line:
```typescript
const LOCAL_IP = "192.168.1.25"; // ← UPDATE THIS
```

Replace with **YOUR** IP address from step 2:
```typescript
const LOCAL_IP = "192.168.1.YOUR_IP"; // ← Your actual IP
```

**Save the file!**

---

### 4️⃣ Verify Device is on Same WiFi

✅ Both your **laptop** and **phone/emulator** must be on the same WiFi network

- Laptop: Connected to WiFi (running backend on port 5000)
- Phone: Connected to **same WiFi network**

If on different networks → Network error will occur! Switch to same WiFi.

---

### 5️⃣ Test Network Connectivity

**From your device (Android), open Terminal and run:**
```bash
# Test if you can reach backend IP
ping 192.168.1.25:5000

# OR check with curl (if available)
curl -I http://192.168.1.25:5000/api/health
```

If ping fails → Device can't reach your laptop. Check WiFi/Firewall.

---

### 6️⃣ Check Firewall (Windows)

Windows Firewall might be blocking port 5000:

1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Look for your backend application (Node.js)
4. Make sure **Public** and **Private** are both checked
5. If not listed, click **"Allow another app"** and add it

**Quick PowerShell command:**
```powershell
# Allow port 5000
netsh advfirewall firewall add rule name="Node.js 5000" dir=in action=allow protocol=tcp localport=5000
```

---

### 7️⃣ Restart App with Clean Cache

After updating the IP address:

```bash
cd HybridWorkforceMobileApp

# Stop the current app
# Press Ctrl+C in the terminal running: npm start

# Clear cache and restart
npm start -- --reset-cache
```

---

## 🔍 Reading Terminal Errors

After you reload the app, watch the **Expo terminal** for error logs:

### ✅ Good Sign - API Configured Correctly:
```
🔗 API CONFIGURATION:
   Platform: android
   Backend Port: 5000
   Local IP: 192.168.1.25
   API URL: http://192.168.1.25:5000/api
   Socket URL: http://192.168.1.25:5000
```

### ❌ Network Error (No Response):
```
❌ NETWORK ERROR (No Response from Server):
   URL: http://192.168.1.25:5000/api/auth/login
   Method: POST
   Message: Network Error

🔧 TROUBLESHOOTING:
   1. ✅ Is backend running?
   2. ✅ Correct IP address?
   3. ✅ Same WiFi network?
   4. ✅ Backend port correct?
   5. ✅ Firewall blocking?
```

### ❌ Server Error (401, 500, etc):
```
❌ API ERROR (Server Responded):
   Status: 401
   URL: http://192.168.1.25:5000/api/auth/login
   Method: POST
   Response: {"message":"Invalid email or password"}
```

This is a **valid response** - just wrong credentials. Use correct login.

---

## 📋 Complete Debugging Workflow

### Step 1: Start Backend
```bash
cd [BACKEND_FOLDER]
npm run server
# Wait for: ✅ Server running on http://localhost:5000
```

### Step 2: Get Your IP
```powershell
ipconfig
# Copy IPv4 Address (e.g., 192.168.1.25)
```

### Step 3: Update api.ts
Edit `src/config/api.ts`:
```typescript
const LOCAL_IP = "192.168.1.25"; // Replace with YOUR IP
```

### Step 4: Reload App
```bash
npm start -- --reset-cache
```

### Step 5: Check Terminal Logs
Watch for:
- ✅ API configuration displayed
- ✅ Login attempt shows in logs
- ✅ Check if network error or auth error

### Step 6: Test Login
Use test credentials on the login screen

---

## 🆘 Still Not Working?

### Common Issues:

| Error | Solution |
|-------|----------|
| "Network Error" | Backend not running, wrong IP, or wrong WiFi |
| "Invalid email or password" | Use correct test credentials |
| "401 Unauthorized" | Token expired or not sent properly |
| "Connection refused" | Backend port is not 5000 or not running |
| "Timeout" | Backend is slow or not responding |

### Quick Tests:

```bash
# Test if backend is accessible from laptop
curl http://localhost:5000/api/health

# Test if device can access backend
# (Run on device or emulator)
curl http://192.168.1.25:5000/api/health
```

Both should return something (health check response).

---

## 📱 For Emulator Only

If using **Android Emulator** (not a real device):

Change `api.ts` to:
```typescript
// Android Emulator special alias to localhost
const LOCAL_IP = "10.0.2.2"; // Don't change this for emulator!
```

---

## 🔐 Test Credentials

Check your backend for test users. Common defaults:
```
Email: test@example.com
Password: password123

OR

Email: admin@example.com
Password: admin123
```

Ask your backend developer for valid test credentials.

---

## ✅ Verification Checklist

Before testing the app:

- [ ] Backend server running (`npm run server` shows ✅)
- [ ] IP address updated in `src/config/api.ts`
- [ ] Phone/Emulator on same WiFi as backend laptop
- [ ] Port 5000 is open (firewall check)
- [ ] App restarted with `npm start -- --reset-cache`
- [ ] Terminal shows correct API URL when app loads
- [ ] Using valid test credentials for login

---

## 📞 If Still Stuck

Collect this info and share with your backend team:

1. **Full terminal error log** (copy entire error)
2. **Your IP address** (from ipconfig)
3. **Backend URL** showing in API Configuration
4. **Backend logs** (any errors on backend side?)
5. **Device type** (Android phone, Android emulator, etc.)

---

## 🚀 Next Steps After Network Works

Once network error is fixed and you can login:

1. ✅ Implement real auth backend endpoints
2. ✅ Add token refresh logic
3. ✅ Set up Notifications API
4. ✅ Connect Chat WebSocket
5. ✅ Test all screens with real data
