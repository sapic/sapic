FROM node:10 as build

# Create app directory
WORKDIR /app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json yarn* ./

#RUN apt-get update
#RUN apt-get install build-essential

RUN yarn install --frozen-lockfile
# If you are building your code for production
# RUN npm install --only=production
COPY . .
# Remove background folder, so it wont trigger build
# RUN rm -r background didnt work

ENV CIRCLE_BUILD_NUM=30
RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /app/out /usr/share/nginx/html
