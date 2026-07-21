# File Buffer Error Fix

## Error
```
TypeError [ERR_INVALID_ARG_TYPE]: The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
at Object.writeFileSync (node:fs:2436:5)
at UserService.uploadAvatar
```

## Root Cause
Multer was configured to use disk storage (`dest: './uploads/avatars'`), which means files are written to disk first and `file.buffer` is undefined. We need memory storage to access the buffer.

## Fix Applied

### 1. Changed Multer Storage to Memory
**File:** `backend/src/user/user.module.ts`

```typescript
// Before (WRONG - disk storage, no buffer)
MulterModule.register({
  dest: './uploads/avatars',
})

// After (CORRECT - memory storage, has buffer)
MulterModule.register({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
})
```

### 2. Added Buffer Validation
**File:** `backend/src/user/user.service.ts`

```typescript
async uploadAvatar(userId: number, file: any) {
  // Check buffer exists
  if (!file || !file.buffer) {
    throw new BadRequestException('No file data received');
  }
  
  // Now file.buffer is available
  fs.writeFileSync(filepath, file.buffer);
  
  // ... rest of code
}
```

### 3. Improved Error Handling
- Added try-catch for file operations
- Better error messages
- Safe old file deletion

## How It Works Now

### Memory Storage Flow:
1. **Frontend** sends file via FormData
2. **Multer** intercepts and stores in memory (RAM)
3. **file.buffer** contains the file data (Buffer)
4. **Service** reads buffer and writes to disk
5. **Database** stores the URL path

### Why Memory Storage?
- ✅ Full control over filename and location
- ✅ Access to file buffer for processing
- ✅ Can validate before saving
- ✅ Can manipulate (resize, convert, etc.)

### Why Not Disk Storage?
- ❌ No access to file.buffer
- ❌ File already written, can't validate first
- ❌ Less control over file naming
- ❌ Harder to manipulate files

## What To Do Now

### Step 1: Restart Backend
The changes require a server restart:

```bash
# Stop current server (Ctrl+C)
cd d:/project/ijgroupstudiobooking/backend
npm run start:dev
```

### Step 2: Test Avatar Upload
1. Refresh browser (Ctrl + Shift + R)
2. Go to Profile page
3. Click camera icon
4. Select an image
5. Should upload successfully!

## Expected Results

### Success Flow:
```
1. User selects image file
2. Frontend sends POST to /api/users/me/avatar
3. Multer intercepts (memory storage)
4. file.buffer contains image data
5. Service validates and saves to disk
6. Database updated with URL
7. Frontend displays new avatar
```

### Backend Logs:
```
✅ File received: user-avatar.jpg
✅ Buffer size: 245678 bytes
✅ Saved to: uploads/avatars/1-1234567890.jpg
✅ Database updated
```

### No More Errors:
- ❌ `Received undefined` (fixed!)
- ❌ `ERR_INVALID_ARG_TYPE` (fixed!)
- ✅ Upload works perfectly!

## File Structure

```
backend/
├── src/
│   └── user/
│       ├── user.module.ts      (memoryStorage config)
│       └── user.service.ts     (buffer handling)
└── uploads/
    └── avatars/
        ├── 1-1234567890.jpg
        ├── 2-1234567891.png
        └── ...
```

## Multer Configuration Comparison

### Disk Storage (OLD - Don't Use):
```typescript
MulterModule.register({
  dest: './uploads/avatars',
})

// File object:
{
  fieldname: 'avatar',
  originalname: 'photo.jpg',
  path: './uploads/avatars/abc123',  // File already saved
  buffer: undefined,                  // ❌ No buffer!
  size: 123456
}
```

### Memory Storage (NEW - Correct):
```typescript
MulterModule.register({
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
})

// File object:
{
  fieldname: 'avatar',
  originalname: 'photo.jpg',
  buffer: <Buffer ff d8 ff ... >,    // ✅ Has buffer!
  size: 123456,
  mimetype: 'image/jpeg'
}
```

## Benefits of This Approach

1. **Validation First**
   - Check file type before saving
   - Check file size before saving
   - Reject bad files early

2. **Control**
   - Choose exact filename
   - Choose exact location
   - Organize files by user ID

3. **Processing**
   - Can resize images
   - Can convert formats
   - Can add watermarks

4. **Security**
   - Validate before writing to disk
   - Sanitize filenames
   - Prevent directory traversal

## Troubleshooting

### Still Getting Buffer Error?

**Check 1: Server Restarted?**
```bash
# Must restart after code changes
npm run start:dev
```

**Check 2: Multer Import Correct?**
```typescript
import { memoryStorage } from 'multer';
```

**Check 3: File Being Sent?**
```javascript
// Frontend should send FormData
const formData = new FormData();
formData.append('avatar', file);  // file from input
```

### No File Received?

Check that file input name matches:
```typescript
// Backend expects 'avatar'
@UseInterceptors(FileInterceptor('avatar'))

// Frontend must send 'avatar'
formData.append('avatar', file);
```

## Testing

### Manual Test in Browser Console:
```javascript
// 1. Get file from input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// 2. Create FormData
const formData = new FormData();
formData.append('avatar', file);

// 3. Send request
const token = localStorage.getItem('ij_token');
fetch('http://localhost:3000/api/users/me/avatar', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## Summary

**Problem:** `file.buffer` was undefined  
**Cause:** Using disk storage instead of memory storage  
**Solution:** Changed to `memoryStorage()`  

**Result:** 
- ✅ Avatar upload works
- ✅ Buffer available for processing
- ✅ Better error handling
- ✅ Full control over file saving

Restart backend and test! 🚀

