FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose Metro Bundler default port
EXPOSE 8081

# Run Metro Bundler and bind it to 0.0.0.0 so it is accessible from outside the container
CMD ["npx", "expo", "start" , "--clear"]
