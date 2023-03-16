
## Project Setup

Install Project dependency by :

```bash
  npm install
```
After that you will need to create  .env file and fill these variable :

```bash
TWILIO_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_VERIFY_SID=
SECRET_KEY=
```

Now that you have assign the value, now we need to migrate by :

```bash
  npx prisma migrate dev --name init
```

and lastly for running the project :

```bash
  npm run dev
```
