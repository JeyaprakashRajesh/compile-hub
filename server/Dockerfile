FROM linuxserver/code-server:latest

# # Switch to root to install additional tools
# USER root

# # Install Node.js, npm, and other dependencies
# RUN apt-get update && \
#     curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
#     apt-get install -y nodejs && \
#     apt-get clean

# # Verify Node.js and npm installation
# RUN node -v && npm -v

# # Switch back to the default user
# USER abc

# # Expose the default code-server port
# EXPOSE 8443

# Start code-server
CMD ["/init"]
