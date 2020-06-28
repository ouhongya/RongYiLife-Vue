FROM nginx

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo 'Asia/Shanghai' >/etc/timezone

COPY dist/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
