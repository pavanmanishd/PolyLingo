#!/bin/bash

# Start the server
cd server
npm install
npm start &

# Start the client
cd ../client
npm install
npm run preview &