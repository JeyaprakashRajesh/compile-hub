FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Update and install required packages
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    openjdk-11-jdk \
    gcc g++ \
    php-cli \
    ruby \
    bash \
    golang-go \
    rustc \
    curl \
    wget && apt-get clean

# Install Node.js 22.13.1 LTS
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Verify Node.js and npm installation
RUN node -v && npm -v

WORKDIR /app

# ENTRYPOINT ["/bin/bash"]
CMD ["/bin/bash"]