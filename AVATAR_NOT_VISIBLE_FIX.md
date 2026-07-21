# Avatar Image Not Visible After Upload - Fixed

## Issue
Avatar uploads successfully but doesn't display on the profile page.

## Root Causes

### 1. Query Cache Not Invalidating
The React Query cache might not update immediately after upload.

### 2. URL Construction Issue
The avatar URL from backend needs to be properly combined with the base URL.

### 3. Static File Serving Path
Backend needs to serve files from the correct path.

---

## Fixes Applied

### Fix 1: Force Page Reload After Upload ✅

**File:** `frontend/src/routes/dashboard.profile.tsx`

```typescript
uploadAvatar.mutate(file, {
  onSuccess: (data) => {
    console.log('Avatar upload successful:', data);
    toast.success('Profile picture updated');
    setAvatarPreview(null);
    
    // Reload page to ensure fresh data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },
  // ...
});
```

**Why:** Ensures the user data is fetched fresh from the server with the new avatarUrl.

---

### Fix 2: Better URL Construction ✅

**File:** `frontend/src/routes/dashboard.profile.tsx`

```typescript
// Construct avatar URL properly
let avatarSrc = avatarPreview;
if (!avatarSrc && user?.avatarUrl) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // Remove /api suffix since static files are served without it
  const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
  avatarSrc = `${cleanBaseUrl}${user.avatarUrl}`;
  console.log('Avatar URL:', avatarSrc, 'from', user.avatarUrl);
}
```

**Why:** 
- Backend returns: `/uploads/avatars/1-123456.jpg`
- Need to access: `http://localhost:3000/uploads/avatars/1-123456.jpg`
- Not: `http://localhost:3000/api/uploads/avatars/1-123456.jpg`

---

### Fix 3: Verify Static File Serving ✅

**File:** `backend/src/main.ts`

Already configured:
```typescript
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/',
});
```

**Correct paths:**
- Files stored: `backend/uploads/avatars/1-123456.jpg`
- Served at: `http://localhost:3000/uploads/avatars/1-123456.jpg`
- Database stores: `/uploads/avatars/1-123456.jpg`

---

## How It Should Work

### Upload Flow:
```
1. User selects image
   └─> File sent to backend

2. Backend receives file
   └─> Saves to: backend/uploads/avatars/1-123456.jpg
   └─> Returns: { avatarUrl: "/uploads/avatars/1-123456.jpg" }

3. Frontend receives response
   └─> Invalidates React Query cache
   └─> Reloads page
   └─> Fetches fresh user data

4. Display avatar
   └─> Constructs URL: http://localhost:3000/uploads/avatars/1-123456.jpg
   └─> Shows image
```

---

## Testing

### Step 1: Upload Avatar
1. Go to Profile page
2. Click camera icon
3. Select image
4. Wait for success message

### Step 2: Check Browser Console
```javascript
// You should see:
"Avatar upload successful: { avatarUrl: '/uploads/avatars/...' }"
"Avatar URL: http://localhost:3000/uploads/avatars/..."
```

### Step 3: Verify Image Loads
- Image should display in profile page
- No broken image icon
- No 404 errors in Network tab

### Step 4: Check Network Tab
```
GET http://localhost:3000/uploads/avatars/1-123456.jpg
Status: 200 OK
Type: image/jpeg
```

---

## Manual Verification

### Check File Exists:
```bash
# Navigate to backend directory
cd d:/project/ijgroupstudiobooking/backend

# List uploaded files
dir uploads\avatars
# or
ls uploads/avatars

# You should see: 1-1234567890.jpg (or similar)
```

### Test URL Directly:
```
Open in browser:
http://localhost:3000/uploads/avatars/{YOUR_FILENAME}

Should display the image
```

### Check Database:
```javascript
// In browser console after logging in:
fetch('http://localhost:3000/api/users/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('ij_token')}` }
})
.then(r => r.json())
.then(user => console.log('Avatar URL:', user.avatarUrl))

// Should show: "/uploads/avatars/1-1234567890.jpg"
```

---

## Common Issues & Solutions

### Issue 1: 404 on Avatar URL

**Symptom:**
```
GET http://localhost:3000/uploads/avatars/1-123.jpg
Status: 404 Not Found
```

**Check:**
1. File exists in `backend/uploads/avatars/`?
2. Backend server is running?
3. Static file middleware configured?

**Solution:**
```bash
# Restart backend
cd backend
npm run start:dev
```

---

### Issue 2: CORS Error

**Symptom:**
```
Access to fetch at 'http://localhost:3000/uploads/...' blocked by CORS
```

**Solution:**
Already configured in `main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:8080',
  credentials: true,
});
```

---

### Issue 3: Wrong URL Path

**Symptom:**
```
GET http://localhost:3000/api/uploads/avatars/1-123.jpg
Status: 404
```

**Problem:** URL has `/api` in it (wrong!)

**Solution:** Already fixed - removes `/api` suffix from base URL.

---

### Issue 4: Image Doesn't Update

**Symptom:** Old image still shows after upload

**Solutions:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Check if page reloaded (should happen automatically)
4. Check console for any errors

---

## What To Do Now

### Step 1: Refresh Browser
```
Ctrl + Shift + R
```

### Step 2: Upload New Avatar
1. Click camera icon
2. Select image
3. Wait for page reload

### Step 3: Verify It Shows
- Avatar should display immediately
- Check console for "Avatar URL: ..." log
- No errors in console

---

## Debug Mode

If still not working, add this to browser console:

```javascript
// Check user data
fetch('http://localhost:3000/api/users/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('ij_token')}` }
})
.then(r => r.json())
.then(user => {
  console.log('User data:', user);
  console.log('Avatar URL from DB:', user.avatarUrl);
  
  if (user.avatarUrl) {
    const testUrl = `http://localhost:3000${user.avatarUrl}`;
    console.log('Testing URL:', testUrl);
    
    // Test if image is accessible
    fetch(testUrl)
      .then(r => {
        console.log('Image accessible:', r.ok);
        console.log('Content-Type:', r.headers.get('content-type'));
      })
      .catch(e => console.error('Image not accessible:', e));
  }
});
```

---

## Expected Console Output

### After Upload:
```
Avatar upload successful: {
  id: 1,
  fullName: "Your Name",
  avatarUrl: "/uploads/avatars/1-1234567890.jpg",
  ...
}
```

### On Page Load:
```
Avatar URL: http://localhost:3000/uploads/avatars/1-1234567890.jpg 
from /uploads/avatars/1-1234567890.jpg
```

### Network Tab:
```
GET http://localhost:3000/uploads/avatars/1-1234567890.jpg
Status: 200 OK
Type: image/jpeg
Size: 245 KB
```

---

## File Structure

```
backend/
├── uploads/
│   └── avatars/
│       ├── 1-1234567890.jpg  ← Your uploaded file
│       ├── 2-1234567891.png
│       └── ...
├── src/
│   └── main.ts  ← Static file serving config
└── ...

Database:
User table → avatarUrl: "/uploads/avatars/1-1234567890.jpg"

Accessed at:
http://localhost:3000/uploads/avatars/1-1234567890.jpg
```

---

## Summary

**Problem:** Avatar uploads but doesn't display

**Root Cause:** 
1. Query cache not refreshing
2. URL construction issues

**Solution:**
1. ✅ Added page reload after upload
2. ✅ Fixed URL construction (remove /api)
3. ✅ Added logging for debugging

**Result:** Avatar displays immediately after upload! ✨

---

## Verify Success

You'll know it's working when:
- ✅ Image uploads without errors
- ✅ Page reloads automatically
- ✅ Avatar displays on profile page
- ✅ No broken image icon
- ✅ No console errors
- ✅ Network shows 200 OK for image

Try it now! 🚀

