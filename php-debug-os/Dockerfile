FROM centos:latest

RUN yum install -y gcc make flex bzip2 libxml2-devel

COPY php-4.4.9.tar.gz /root
WORKDIR /root
RUN tar xvf php-4.4.9.tar.gz
WORKDIR /root/php-4.4.9
RUN ./configure && make && ./sapi/cli/php -v
RUN echo 'alias php4=/root/php-4.4.9/sapi/cli/php' >> ~/.bashrc


COPY php-7.1.2.tar.bz2 /root
WORKDIR /root
RUN tar xvf php-7.1.2.tar.bz2
WORKDIR /root/php-7.1.2
RUN ./configure && make && ./sapi/cli/php -v
RUN echo 'alias php7=/root/php-7.1.2/sapi/cli/php' >> ~/.bashrc