FROM python:3.10.4-buster

# Declare Docker Build Arguments ######################################

# Dockerfile expects the version of the app to be passed to the "docker build" command
ARG BUILD_VERSION
RUN test -n "$BUILD_VERSION" || (echo "Required docker build arg BUILD_VERSION not set" && false)

ARG BUILD_ARCH
RUN test -n "$BUILD_ARCH" || (echo "Required docker build arg BUILD_ARCH not set" && false)

# Install App #########################################################

# Copy App debian-pkg into container
COPY build/ppra-testing-suite_${BUILD_VERSION}_${BUILD_ARCH}.deb /home

# Install App
RUN apt install /home/ppra-testing-suite_${BUILD_VERSION}_${BUILD_ARCH}.deb

# Docker Entrypoint ###################################################

ENTRYPOINT ppra-testing-suite-launcher
