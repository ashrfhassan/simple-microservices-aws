##**Install guide**

1- in docker-base directory copy .env.example to .env .<br/>
2- in users-service directory copy .env.example to .env .<br/>
3- cd to users-service and run `composer install & php artisan migrate` .<br/>
4- cd to docker-base directory and run `docker-compose up` .<br/>
5- browse to http://localhost:1337 (konga admin) and create konga user .<br/>
6- add konga connection  => refer to point 6 in technical notes .<br/>
7- register your services in kong to proxy them => refer to points 7,8 in technical notes .<br/>
8- apply JWT plugin on your backend services except for authentication_service using konga gui .<br/>
##**technical Notes**

1- to create containers will clean volumes run `sudo docker-compose down -v`.<br/> 
2- to clear containers cached in docker run `sudo docker-compose down` then run `sudo docker-compose up --force-recreate`.<br/>
3- to check something inside of any container know that each container has its own name, so you can run from another terminal `sudo docker exec -it ${container name} /bin/bash` for example: `sudo docker exec -it agent_manager_container /bin/bash` (important note: to do this you have to change base image of container in `Dockerfile.dev` to :latest as we use alpine version for all containers which doesn't include bashing).<br/>
4- all containers are volume mapped with network localhost, so you code changes effects directly into containers but in case you want to restart any container run `sudo docker restart ${contaner name}`.<br/>
5- to trace specific service log run `docker-compose logs ${service name}`.<br/>
6- for development mode on local when adding konga connection to kong gateway use http://kong:8001 not (http://localhost:8001) as they are internal services on a private network.<br/>
7- for development mode on local when adding service to kong gateway use http://{service-host-name}:{service-port} not (http://localhost:8001) as they are internal services on a private network and not exposed to public network.<br/>
8- remember to add `/socket.io` prefix path for chat service in kong to make it work.<br/>
9- to test users service production container on local you can run `docker build . -t users-test --no-cache & docker run -e DB_HOST=mysql --network=docker-base_chat-proxy -p 7070:80 users-test` note: that others services can use same approach.<br/>

##**issues you may face**

1- reaching limit of watcher files of docker volumes rum `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`.<br/>

##**TODO List**
1- update terraform to meet project needs on aws.<br/>