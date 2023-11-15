import axios from "axios";

export default async function sendSMS(phoneNumber, message) {
    try {
        let data = await axios.post(`https://api.pindo.io/v1/sms/`, {
            to: `+${phoneNumber}`,
            text: `${message}`,
            sender: "Smart Meter"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJub25lIn0.eyJpZCI6IjM0OSIsInJldm9rZWRfdG9rZW5fY291bnQiOjB9.',
                'Accept': '*/*'
            }
        })

        console.log(data);
    }catch(e) {
        console.log(e); 
    }
}
