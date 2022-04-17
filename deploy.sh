echo "Pulling from Master" 

git pull origin main

echo "Pulled successfully from master"

echo "Restarting server..."

pm2 restart 5

echo "Server restarted Successfully"