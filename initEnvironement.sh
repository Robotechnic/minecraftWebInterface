#! /usr/bin/sh

echo "Welcome to environement setup"

echo "server port:"
read serverPort
echo "minecraft host:"
read host
echo "minecraft port:"
read port
echo "minecraft password:"
read password
echo "minecraft path (absolute or relative):"
read path
echo "amount of ram used by server:"
read ram
echo "server public ip"
read serverIp
echo "database host"
read dbHost
echo "database user"
read dbUser
echo "databasePassword"
read dbPassword
echo "databaseName"
read dbName

(echo "CONFIG_OK=true") > .env
(echo "MINECRAFT_HOST=$host") >> .env
(echo "MINECRAFT_PORT=$port") >> .env
(echo "MINECRAFT_PASSWORD=$password") >> .env
(echo "MINECRAFT_PATH=$path") >> .env
(echo "MINECRAFT_RAM=$ram") >> .env
(echo "MINECRAFT_IP=$serverIp") >> .env
(echo "PORT=$serverPort") >> .env
(echo "DB_HOST=$dbHost") >> .env
(echo "DB_USER=$dbUser") >> .env
(echo "DB_PASSWORD=$dbPassword") >> .env
(echo "DB_DATABASE=$dbName") >> .env
