# CivicAid Platform

A complete full-stack platform for managing civic complaints with automated task assignment to NGOs and Authorities.

## Project Structure

```
CivicAID_Mobile_APP/
├── backend/          # Node.js + Express + MongoDB backend
├── src/              # React Native mobile app
├── android/          # Android native configuration
└── package.json      # Mobile app dependencies
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civicaid
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

4. Start MongoDB (make sure MongoDB is running on your system)

5. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

## Mobile App Setup

1. Install dependencies:
```bash
npm install
```

### Development Options

This app supports both **Android Studio** (React Native CLI) and **Expo** development workflows:

#### Option 1: Using Android Studio (React Native CLI)

2. For Android:
```bash
# Make sure you have Android Studio and Android SDK installed
# Start an Android emulator or connect a physical device

# Start Metro bundler
npm start

# In another terminal, run the app
npm run android
# OR
npx react-native run-android
```

3. For iOS (Mac only):
```bash
cd ios && pod install && cd ..
npm run ios
# OR
npx react-native run-ios
```

#### Option 2: Using Expo

The app is configured to work with Expo's development tools:

```bash
# Start Expo development server
npm run expo:start

# Or start directly for Android
npm run expo:android

# Or start directly for iOS (Mac only)
npm run expo:ios

# Or start for web
npm run expo:web
```

**Note:** You can use either workflow interchangeably. The app uses Expo's "bare workflow" which allows you to:
- Use Android Studio for native Android development
- Use Expo CLI for faster development and testing
- Access all native modules and custom native code
- Build with either `expo build` or standard React Native build tools

## Features

### Backend
- ✅ User authentication (JWT)
- ✅ Role-based access control (user, admin, ngo, volunteer, authority)
- ✅ Complaint management
- ✅ Media upload (images/videos)
- ✅ Automated task assignment engine
- ✅ Admin dashboard with analytics
- ✅ Notifications system

### Mobile App
- ✅ User registration and login
- ✅ File complaints with media
- ✅ Track complaint status
- ✅ View assigned teams
- ✅ Notifications
- ✅ Admin panel (for admin users)
- ✅ User profile management

## API Endpoints

Base URL: `http://localhost:5000/api/v1` (or `http://10.0.2.2:5000/api/v1` for Android emulator)

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Complaints
- `POST /complaints/create` - Create complaint
- `GET /complaints/user` - Get user's complaints
- `GET /complaints/:id` - Get complaint details
- `POST /complaints/upload-media/:id` - Upload media to complaint

### Assignments
- `GET /assignments/complaint/:id` - Get assignment for complaint
- `GET /assignments/my-assignments` - Get my assignments (NGO/Authority)

### Admin
- `GET /admin/users` - Get all users
- `GET /admin/complaints` - Get all complaints
- `GET /admin/analytics` - Get analytics
- `GET /admin/reports` - Get reports

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read

## Automated Assignment Logic

The system automatically assigns complaints to NGOs or Authorities based on:
1. **Category Match** - Checks if NGO/Authority handles the complaint category
2. **Distance** - Calculates distance from complaint location
3. **Workload** - Considers current active assignments
4. **Capacity** - Respects maximum capacity limits

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)

### Mobile
- React Native (bare workflow with Expo support)
- Expo SDK
- React Navigation
- Axios
- AsyncStorage
- React Native Image Picker

## Troubleshooting

### Metro bundler not found
- Make sure `metro.config.js` exists in root directory
- Run `npm install` again

### Android build errors
- Make sure Android SDK is properly installed
- Check `android/local.properties` has correct SDK path
- Clean build: `cd android && ./gradlew clean && cd ..`

### Backend connection issues
- For Android emulator, use `10.0.2.2` instead of `localhost`
- Check MongoDB is running
- Verify backend is running on port 5000

## License

ISC


