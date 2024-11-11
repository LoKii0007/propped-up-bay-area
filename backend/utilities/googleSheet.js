const { google } = require('googleapis');
const sheets = google.sheets('v4');
require("dotenv").config()

const GOOGLE_SHEETS_CREDENTIALS = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)

// Load Google Service Account credentials
const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_SHEETS_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Function to add data to Google Sheets
async function addToSheet(data) {
  try {
    const authClient = await auth.getClient();
    const sheetId = '1FOMy3KrOQYXePlmBap_MVIUVXqmkmo7KrvtI0OFQHnA';  
    const range = 'Sheet1!A1'; 

    const response = await sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [data], // Data to be added
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error adding data to sheet:', error.message)
  }
}

module.exports = { addToSheet };
