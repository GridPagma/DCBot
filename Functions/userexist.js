const axios = require("axios");
const { config } = require("dotenv");
config();

async function checkUsernameExists(username) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/users?login=${username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITCH_OAUTH}`,
          "Client-ID": process.env.TWICH_CLIENT,
        },
      }
    );
    const data = response.data;
    if (data.data.length > 0) {
      // The username exists
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { checkUsernameExists };
