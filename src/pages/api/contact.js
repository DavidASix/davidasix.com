import axios from 'axios';
const p = require('src/assets/mailgun.json');

const delay = (milliseconds) => {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds);
    });
};

export default async function handler(req, res) {
    const {name, email, message} = req.body
    // TODO: Store IP Address in firestore and don't allow more than 5 emails from an IP per hour.
    const { remoteAddress } = req.connection;
    // Async delay is added to reduce potential for abuse.
    await delay(250)
    // Setup mailgun request and send email
    const credentials = btoa(`api:${p.mg_api}`);
    const mg_config =  {
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'multipart/form-data',
        }
    };
    const content = {
        from: `Jen Helmuth Website <contactForm@${p.mg_domain}>`,
        to: p.to,
        subject: `Contact Request from ${name}`,
        text: `You've got a contact request!
        Entered Name: ${name}
        Entered Email Address: ${email}
        Message:
        \n${message}`,
    }
    
    try {
        const url = `${p.mg_url}/messages`
        await axios.post(url, content, mg_config);
        res.status(200)
        res.json({success: true, message: 'Email Sent'});
        res.end()
      } catch (err) {
        console.error(err.message)
        res.status(500)
        res.statusMessage = 'Something went wrong, try again';
        res.end()
      }
  }
