# PolyLingo

PolyLingo is a cutting-edge multi-lingual group chat application designed to bridge language barriers, enabling users to communicate seamlessly in their native languages. Built with React, Node.js, Express, and Socket.io. PolyLingo leverages the power of Google Translate API and EdgeTTS for real-time translation and text-to-speech conversion.

## Features

- **Real-time Translation**: Instant translation of messages in multiple languages facilitates smooth communication.
- **Language Diversity**: Supports a wide range of languages, empowering users to converse effortlessly in their preferred language.
- **Text-to-Speech Conversion**: Translated messages are converted into speech using EdgeTTS, enhancing accessibility and user experience.
- **Chat History**: Keep track of conversations with built-in chat history functionality.
- **Chat Rooms**: Can handle multiple users in a single chat room, enabling group conversations.

## Tech Stack

- **Frontend**: React, Socket.io
- **Backend**: Node.js, Express, Socket.io
- **Translation Server**: Python, Flask, Google Translate API, EdgeTTS


## Run Locally

1. **Clone the Project**

```
git clone https://github.com/pavanmanishd/PolyLingo.git
```

2. **Navigate to the Project Directory**

```
cd PolyLingo
```

3. **Start the Server (Terminal 1)**

```
cd server
npm install
npm start
```

4. **Start the Client (Terminal 2)**

```
cd client
npm install
npm start
```

5. **Start the Translation Server (Terminal 3)**

```
cd translation
pip install -r requirements.txt
python app.py
```
