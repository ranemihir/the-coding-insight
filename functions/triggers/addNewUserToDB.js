const functions = require('firebase-functions');
const admin = require('firebase-admin')
const db = admin.firestore()

/**
 * Trigger to add new user's UID to cloud firestore.
 */
const addNewUserToDB = functions.auth.user().onCreate(async (user) => {
    try {
        const doc = await db.collection("users").doc(user.uid).set({
            followedTopics: [],
            savedPosts: [],
            darkMode: false
        });

        if (doc) {
            return "New user added to firestore";
        }
        else {
            throw new Error("New user not added to firestore");
        }
    }
    catch (error) {
        console.error(error);
        return null;
    }
});

module.exports = addNewUserToDB