import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// HTTPS Function - Health Check
export const healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'firebase-functions',
    version: '1.0.0'
  });
});

// Firestore Trigger - User Creation
export const onUserCreate = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;
    
    console.log(`New user created: ${userId}`);
    
    // Create user profile
    await db.collection('profiles').doc(userId).set({
      userId: userId,
      displayName: userData.name,
      bio: '',
      avatar: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Send welcome notification
    await db.collection('notifications').add({
      userId: userId,
      type: 'welcome',
      title: 'Welcome!',
      message: 'Welcome to our platform!',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`User profile and welcome notification created for ${userId}`);
  });

// Firestore Trigger - User Update
export const onUserUpdate = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const userId = context.params.userId;
    
    // Update profile if name changed
    if (beforeData.name !== afterData.name) {
      await db.collection('profiles').doc(userId).update({
        displayName: afterData.name,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`Profile updated for user ${userId}`);
    }
  });

// Firestore Trigger - User Delete
export const onUserDelete = functions.firestore
  .document('users/{userId}')
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    
    console.log(`User deleted: ${userId}`);
    
    // Clean up related data
    const batch = db.batch();
    
    // Delete user profile
    batch.delete(db.collection('profiles').doc(userId));
    
    // Delete user sessions
    const sessionsSnapshot = await db.collection('sessions')
      .where('userId', '==', userId)
      .get();
    
    sessionsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete user notifications
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .get();
    
    notificationsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Cleaned up data for deleted user ${userId}`);
  });

// Scheduled Function - Clean up expired sessions
export const cleanupExpiredSessions = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const expiredSessions = await db.collection('sessions')
      .where('expiresAt', '<', now)
      .get();
    
    if (expiredSessions.empty) {
      console.log('No expired sessions to clean up');
      return;
    }
    
    const batch = db.batch();
    expiredSessions.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Cleaned up ${expiredSessions.size} expired sessions`);
  });

// Scheduled Function - Send daily digest
export const sendDailyDigest = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9 AM
  .timeZone('UTC')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get active users
    const usersSnapshot = await db.collection('users')
      .where('isActive', '==', true)
      .get();
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      
      // Create daily digest notification
      await db.collection('notifications').add({
        userId: userId,
        type: 'digest',
        title: 'Daily Digest',
        message: 'Here\'s what happened yesterday...',
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    console.log(`Sent daily digest to ${usersSnapshot.size} users`);
  });

// HTTP Function - Get user statistics
export const getUserStats = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = context.auth.uid;
  
  // Check if user is admin
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  // Get statistics
  const [usersSnapshot, sessionsSnapshot, postsSnapshot] = await Promise.all([
    db.collection('users').get(),
    db.collection('sessions').get(),
    db.collection('posts').get()
  ]);
  
  return {
    totalUsers: usersSnapshot.size,
    activeSessions: sessionsSnapshot.size,
    totalPosts: postsSnapshot.size,
    timestamp: new Date().toISOString()
  };
});