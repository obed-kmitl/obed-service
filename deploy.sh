GIT_BRANCH="main"
PM2_APP_NAME="obed-service"

echo
echo "[[ Step 1: Checkout ]]"
echo
git checkout $GIT_BRANCH
git fetch
git pull

echo
echo "[[ Step 2: Build ]]"
echo
yarn install
yarn build

echo
echo "[[ Step 3: Migrate ]]"
echo
yarn migrate

echo
echo "[[ Step 4: Deploy ]]"
echo
pm2 restart $PM2_APP_NAME

echo
echo "[[ COMPLETED ]]"
echo
exit