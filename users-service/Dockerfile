FROM php:7.4-fpm

#receiving ARG, used in building docker phase
ARG MYSQLHOSTNAME=localhost
#display mysql arg host name
RUN echo 'applied mysql hostname is: '$MYSQLHOSTNAME

#environment variables, used in runing container phase in cmd also for container env
Env APP_NAME Lumen
Env APP_ENV local
Env APP_KEY ''
Env APP_DEBUG true
Env APP_URL 'http://localhost'
Env APP_TIMEZONE UTC
Env LOG_CHANNEL stack
Env LOG_SLACK_WEBHOOK_URL ''
Env CACHE_DRIVER file
Env QUEUE_CONNECTION sync
Env DB_CONNECTION mysql
Env DB_HOST localhost
Env DB_PORT 3306
Env DB_DATABASE users
Env DB_USERNAME root
Env DB_PASSWORD root

# Copy composer.lock and composer.json
COPY ./composer.lock* ./composer.json* /var/www/

# Set working directory
WORKDIR /var/www

#install nginx
RUN apt-get update -y \
    && apt-get install -y nginx

# Install dependencies
RUN apt-get update && apt-get install -y \
build-essential \
libpng-dev \
libjpeg62-turbo-dev \
libfreetype6-dev \
libonig-dev \
libzip-dev \
libmcrypt-dev \
zlib1g-dev \
libxml2-dev \
graphviz \
locales \
zip \
jpegoptim optipng pngquant gifsicle \
unzip \
curl

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring bcmath zip exif pcntl sockets
RUN docker-php-ext-install gd
RUN pecl install -o -f redis \
&&  rm -rf /tmp/pear \
&&  docker-php-ext-enable redis

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Will uese the script to wait untill the application be up so we can run
# composer install or Db migration commands: https://github.com/vishnubob/wait-for-it
COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# Copy existing application directory contents
COPY . /var/www

# Copy nginx config file
COPY ./nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/conf.d/default.conf /etc/nginx/sites-available/default
COPY ./nginx/conf.d/default.conf /etc/nginx/sites-enabled/default

# laravel settings
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 . /var/www

# Expose nginx port
EXPOSE 80 443

#install laravel dependencies then run the app
CMD composer install; wait-for-it ${DB_HOST}:3306 -- php artisan migrate; service nginx start; php-fpm;
