const axios = require('axios');


const apiKey = process.env.SMSAPI

async function sendSMSToList(phoneNumbers, message) {
  if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    console.error('Error: Phone numbers must be a non-empty array.');
    return;
  }

  if (!message || message.trim() === '') {
    console.error('Error: Message cannot be empty.');
    return;
  }

  for (const phoneNumber of phoneNumbers) {
    try {
      const response = await axios.post(
        'https://api.sms.to/sms/send',
        {
          to: phoneNumber,
          message: message,
          sender_id: "BorteyManApt",
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      const data = response.data;

      if (response.status >= 200 && response.status < 300 && data.success) {
        console.log(`SMS sent successfully to ${phoneNumber}. Message ID: ${data.message_id}`);
      } else {
        console.error(`Failed to send SMS to ${phoneNumber}. Error: ${data.error || response.statusText}`);
      }
    } catch (error) {
      console.error(`An error occurred while sending SMS to ${phoneNumber}:`, error.message);
      if (error.response && error.response.data) {
        console.error('API Response:', error.response.data);
      }
    }
  }
}

module.exports = {sendSMSToList}