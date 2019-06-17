FROM node:8.12.0

MAINTAINER I2G

# Set workdir
WORKDIR /app
# Copy app source
COPY . /app
RUN mkdir -p /opt/download
# Install npm package
COPY package.json /app
RUN npm install

# Set Environment
ENV NODE_ENV=kubernetes

EXPOSE 3030

CMD ["node", "index.js"]
