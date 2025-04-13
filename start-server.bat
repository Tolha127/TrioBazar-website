echo "Starting MongoDB and Server..."
start mongod
timeout /t 5
cd server
npm install
npm start
