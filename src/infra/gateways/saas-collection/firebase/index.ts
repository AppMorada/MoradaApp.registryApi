// import { initializeApp /*cert*/ } from 'firebase-admin/app';
// import admin from 'firebase-admin';

// const rawCred = process.env.FIREBASE_SECRET;
// const firebaseCredential = rawCred ? JSON.parse(rawCred) : undefined;

// initializeApp({
// credential: rawCred ? cert(firebaseCredential) : undefined,
// 	projectId: process.env.GOOGLE_CLOUD_QUOTA_PROJECT as string,
// });
//
// const refToBeUsed = admin.firestore();
//
// refToBeUsed.settings({
// 	ignoreUndefinedProperties: true,
// });
//
// export namespace FirebaseInstances {
// 	export const firestore = refToBeUsed;
// }
