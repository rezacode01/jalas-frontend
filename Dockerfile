FROM node as react-build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM react-build AS dev
WORKDIR /usr/src/app
CMD ["npm", "start"]

FROM node AS release
WORKDIR /build
COPY --from=react-build usr/src/app/build ./build
EXPOSE 3000
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

FROM release