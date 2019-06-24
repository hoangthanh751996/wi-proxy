FROM ubuntu:16.04

MAINTAINER I2G
ENV MYSQL_USER=mysql \
    MYSQL_VERSION=5.7.24 \
    MYSQL_DATA_DIR=/var/lib/mysql \
    MYSQL_RUN_DIR=/run/mysqld \
    MYSQL_LOG_DIR=/var/log/mysql
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
RUN apt-get update && apt-get install -y curl sudo
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install --yes nodejs
# Set workdir
WORKDIR /app
# Copy app source
COPY . /app
RUN mkdir -p /opt/download /opt/curve
# Install npm package
COPY package.json /app
RUN npm install

# Set Environment
ENV NODE_ENV=kubernetes

EXPOSE 3030

CMD ["node", "index.js"]
