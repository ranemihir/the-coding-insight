/**
 * .env setup.
 */
require('dotenv').config()

/**
 * Initializing firebase admin application for using cloud functions and other admin services.
 */
const admin = require('firebase-admin')

/**
 * Contains service account details.
 */
// eslint-disable-next-line import/order
const serviceAccount = require('./admin-config.json')

/**
 * Initializing firebase admin app.
 */
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

//===========================================================================================================//

const functions = require('firebase-functions')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const handleRequest = require('./nuxt-server/index.js')
const authService = require('./AuthService/index.js')
const addNewUserToDB = require('./triggers/addNewUserToDB.js')

/**
 * Creates an express app.
 */
const app = express()

/**
 * Parses cookies in requets object.
 */
app.use(cookieParser())

/**
 * Allow cross origin access.
 */
app.use(cors({ origin: true }))

/**
 * Handles the request for admin claim.
 */
app.post('/adminClaim', async (req, res) => {
  await res.set('Access-Control-Allow-Origin', '*')
  const response = await authService.giveAdminClaimsToUser(req.body.uid)
  return res.send(response)
})

/**
 * Handles authentication requests.
 */
app.post('/auth', async (req, res) => {
  await res.set('Access-Control-Allow-Origin', '*')
  const response = await authService.authenticateUser(req.body.id_token)
  res.send(response)
})

app.get('*', handleRequest)
app.use(handleRequest)

/**
 * Cloud function which uses the express app.
 */
exports.nuxtssr = functions.https.onRequest(app)

exports.addNewUserToDB = addNewUserToDB
