
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    openjdk-11-jdk \
    gcc g++ \
    php-cli \
    ruby \
    bash \
    golang-go \
    rustc \
    curl && apt-get clean

WORKDIR /app

ENTRYPOINT ["/bin/bash"]
