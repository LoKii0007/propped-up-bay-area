const { google } = require("googleapis");
const GoogleSheetUsers = require("../models/GoogleSheet");
const SuperUser = require("../models/superUser");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  process.env.REDIRECT_URI // Your app's redirect URI
);

// Step 1: Generate an authentication URL and direct the user to it
async function generateAuthUrl(req, res) {
  try {
    const user = await SuperUser.findById(req.user.userId) // Check if user exists

    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (user.role !== "admin" && user.role !== "superuser") {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const scopes = [
      'openid',                      // This is required to get id_token
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/userinfo.email',  // Email scope
      'https://www.googleapis.com/auth/userinfo.profile', // Profile scope
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline", // 'offline' for refresh token
      scope: scopes,
    });
    return res.status(200).json({url }); 
  } catch (error) {
    console.error('Error in google generateAuthUrl', error.message)
    return res.status(500).json({ msg : 'Error in google generateAuthUrl' })
  }
}


// Step 2: Exchange the authorization code for tokens
const getTokens = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // console.log(tokens)
    const decodedToken = jwt.decode(tokens.id_token);
    // console.log(decodedToken)
    const email = decodedToken?.email;
    if (!email) {
      return res.status(400).json({ msg: "Unable to retrieve user email from tokens." });
    }

    const existingUser = await GoogleSheetUsers.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "This Google account is already connected." });
    }

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Create spreadsheets for each type
    const openHouseOrdersSpreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: { title: "Propped Up OpenHouse Orders" },
      },
    });

    const postHouseOrdersSpreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: { title: "Propped Up PostHouse Orders" },
      },
    });

    const usersSpreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: { title: "Propped Up Users" },
      },
    });

    // Save all details in the database
    const user = await GoogleSheetUsers.create({
      email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      openHouseOrdersSpreadsheetId: openHouseOrdersSpreadsheet.data.spreadsheetId,
      postHouseOrdersSpreadsheetId: postHouseOrdersSpreadsheet.data.spreadsheetId,
      usersSpreadsheetId: usersSpreadsheet.data.spreadsheetId,
    });

    console.log("Saved to database:", user);
    res.status(200).json({ msg: "Authorization successful! Spreadsheets created." });
  } catch (error) {
    console.error("Error during authentication:", error.message);
    res.status(500).json({ msg: "Error during authentication." });
  }
};


// test api
const addDataToMultipleSheet = async(req, res)=>{
  try {
    console.log(req.body)
    const {data} = req.body
    
    try {
      addToGoogleSheet({data, targetSheet: 'openHouseOrders'})
      res.status(200).json({msg : 'success'})
    } catch (error) {
      console.log('error adding data to google sheets :', error.message)
      res.status(500).json({msg : 'Error in addDataToMultiple users'})
    }
  } catch (error) {
    console.log('server error adding data to google sheets', error.message )
    res.status(500).json({msg : 'Error in addDataToMultiple users'})
  }
}


// Step 3: Use the user's OAuth2 client to add data to their Google Sheet
async function addToGoogleSheet({ data, targetSheet }) {
  // Fetch users from the database
  const users = await GoogleSheetUsers.find();
  if (!users || users.length === 0) {
    console.error("No users found");
    return;
  }

  for (const user of users) {
    try {
      // Set credentials for the user
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken,
      });

      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      // Determine the target spreadsheet ID
      let spreadsheetId;
      switch (targetSheet) {
        case "openHouseOrders":
          spreadsheetId = user.openHouseOrdersSpreadsheetId;
          break;
        case "postHouseOrders":
          spreadsheetId = user.postHouseOrdersSpreadsheetId;
          break;
        case "users":
          spreadsheetId = user.usersSpreadsheetId;
          break;
        default:
          console.error(`Invalid targetSheet: ${targetSheet}`);
          continue; // Skip to the next user
      }

      if (!spreadsheetId) {
        console.warn(`Spreadsheet ID not found for targetSheet: ${targetSheet}`);
        continue; // Skip to the next user
      }

      // Append data to the specified sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A1", // Adjust range as needed
        valueInputOption: "RAW",
        resource: {
          values: [data], // Data to be added
        },
      });

      console.log(`Data added to ${targetSheet} (Spreadsheet ID: ${spreadsheetId})`);
    } catch (error) {
      console.error(`Error adding data to ${targetSheet}:`, error.message);
    }
  }
}



module.exports = { generateAuthUrl, getTokens, addToGoogleSheet, addDataToMultipleSheet };
