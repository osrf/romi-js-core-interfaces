FROM ros:eloquent

# install deps
RUN apt-get update && apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash - && \
  apt-get update && apt-get install -y nodejs python3-jinja2 chromium-browser

ADD unit-test.sh /
ENTRYPOINT /unit-test.sh
