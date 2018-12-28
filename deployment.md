# installation steps

1. npm install
1. sudo chmod -R 777 logs
1. sudo chmod -R 777 public/orders

## prod

cd /usr/share/nginx/html/pikbuk_api/pikbuk_api/
sudo git reset --hard HEAD
sudo git pull origin master
pm2 restart 1

## dev

cd /var/lib/jenkins/workspace/pikbuk-api-dev
sudo git reset --hard HEAD
sudo git pull origin develop
pm2 restart 2
