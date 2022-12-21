FROM nginx:alpine

# using timezone
ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Seoul
RUN apk add -U tzdata

ADD ./build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
RUN sed -i 's/listen[[:space:]]*80;/listen 2017;/g' /etc/nginx/conf.d/default.conf

EXPOSE 2017

CMD ["nginx", "-g", "daemon off;"]
