const {google} = require('googleapis');
const path = require("path");



const  KEYFILEPATH = path.join(__dirname,'api.json')
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
  keyFile:KEYFILEPATH,
  scopes:SCOPE
})


module.exports = auth;