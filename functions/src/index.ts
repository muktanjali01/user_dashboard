import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Get all users
export const getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (e) {
    //res.status(500).send(e.message);
  }
});

// Add a new user
export const addUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
  }
  try {
    const user = req.body;
    const docRef = await db.collection('users').add(user);
    res.status(201).json({ id: docRef.id, ...user });
  } catch (error) {
    //res.status(500).send(error.message);
  }
});

// Update an existing user
export const updateUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    res.status(405).send('Method Not Allowed');
  }
  try {
    const { id } = req.query;
    const updatedUser = req.body;
    await db.collection('users').doc(String(id)).update(updatedUser);
    res.status(200).json({ id, ...updatedUser });
  } catch (error) {
    //res.status(500).send(error.message);
  }
});

// Delete a user
export const deleteUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Method Not Allowed');
  }
  try {
    const { id } = req.query;
    await db.collection('users').doc(String(id)).delete();
    res.status(200).send('User deleted');
  } catch (error) {
    //res.status(500).send(error.message);
  }
});
