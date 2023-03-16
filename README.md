# trackrr-api

This is a rest api for trackrr App

#Instruction

First, create .env file in root project folder
Add a value for

- TWILIO_API_KEY
- TWILIO_ACCOUNT_SID
- TWILIO_VERIFY_SID
- SECRET_KEY

After that run : npx prisma migrate dev --name init
Lastly, run the server by : npm run dev
