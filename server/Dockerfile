FROM linuxserver/code-server:latest

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Add the default settings.json for the user configuration
RUN mkdir -p /config/data/User && \
    echo '{ \
    "workbench.colorTheme": "Default Dark Modern", \
}' > /config/data/User/settings.json    `