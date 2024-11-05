const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Utility function to detect URLs in text
const detectUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

// Route to post a tweet
app.post('/post-tweet', async (req, res) => {
    const { access_token } = req.headers; // OAuth 2.0 Bearer Token
    const { text } = req.body; // Tweet content

    if (!access_token) {
        return res.status(400).json({ message: "Access token is required in headers" });
    }
    
    if (!text) {
        return res.status(400).json({ message: "Text for the tweet is required in the body" });
    }

    // Detect URLs in the tweet text
    const detectedUrls = detectUrls(text);
    if (detectedUrls.length > 0) {
        console.log("URLs detected in the tweet:", detectedUrls);
        // Optional: Modify tweet text or perform other actions with detected URLs
    }

    try {
        // Twitter API v2 endpoint for posting tweets
        const url = 'https://api.twitter.com/2/tweets';

        const response = await axios.post(
            url,
            { text }, // Tweet content
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ message: "Tweet posted successfully!", data: response.data });
    } catch (error) {
        res.status(500).json({ message: "Error posting tweet", error: error.response ? error.response.data : error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
