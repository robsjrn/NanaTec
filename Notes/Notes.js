have Git installed
node version 10.33
install python speciffically version 2.7

Mongodb 
Redis Server
phantom js


step 1..npm install
step 2 ..bower install in client folder

add nginx configuration here 
*****************************

 
worker_processes  1;  ## Default: 1
error_log  D:/nginx-1.7.7/logs/error.log;
pid        D:/nginx-1.7.7/logs/nginx.pid;
worker_rlimit_nofile 8192;
 
events {
  worker_connections  4096;  ## Default: 1024
}
 
http {
     include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
   # access_log   /var/log/logs/access.log ;
    tcp_nopush   on;
    server_names_hash_bucket_size 128; # this seems to be required for some vhosts
 
   server {
        listen       80;
        server_name  localhost;


        location /web {
		    proxy_pass http://127.0.0.1:4000;
		    proxy_http_version 1.1;
		    proxy_set_header Upgrade $http_upgrade;
		    proxy_set_header Connection 'upgrade';
		    proxy_set_header Host $host;
		    proxy_cache_bypass $http_upgrade;
            }
		 
            location / {
		    root D:/production/Client;
	     }
 
   }

}


*****************************





    