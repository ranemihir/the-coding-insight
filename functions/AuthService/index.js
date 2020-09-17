const admin = require("firebase-admin");
const env = require("../environment/env.js");

/**
 * User authentication and claims service.
 */
class AuthService {
    /**
     * Validates UID and returns custom token which contains adminn rights.
     * @param {string} uid - UID of user who wants admin rights.
     * 
     * @returns {JSON object} response - custom token which contains admin rights (or error if the UID is wrong).
     */
    static async giveAdminClaimsToUser(uid) {
        try {
            if (uid === env.adminUid) {
                const customToken = await admin.auth().createCustomToken(uid, {
                    admin: true
                });

                return { "custom_token": customToken };
            } else {
                return { "error": "Access Denied" };
            }
        } catch (error) {
            console.error(error);
            return { "error": error };
        }
    }

    /**
     * Verifies idToken of the user for uthentication and returns custom token if authentication is successful.
     * @param {string} idToken - generated idToken of the user who signed in on the frontend.
     * 
     * @returns {JSON object} response - custom token is returned if idToken is verified successfully else error is returned.
     */
    static async authenticateUser(idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = await decodedToken.uid;

            if (uid) {
                const customToken = await admin.auth().createCustomToken(uid);

                if (customToken) {
                    return { "custom_token": customToken };
                } else {
                    return { "error": "Invalid User Id (uid)" };
                }
            } else {
                return { "error": "Invalid User Id (uid)" };
            }
        } catch (error) {
            console.error(error);
            return { "error": error };
        }
    }
}

module.exports = AuthService;