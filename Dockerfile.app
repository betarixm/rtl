FROM node:lts as builder

COPY app /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

ARG REACT_APP_URL_BACKEND
ARG REACT_APP_URL_WS

ENV REACT_APP_URL_BACKEND $REACT_APP_URL_BACKEND
ENV REACT_APP_URL_WS $REACT_APP_URL_WS

RUN npm install --silent
RUN npm run build

FROM nginx:latest

COPY --from=builder /usr/src/app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
