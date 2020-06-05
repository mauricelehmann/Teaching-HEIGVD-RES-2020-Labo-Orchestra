FROM node:6.0
MAINTAINER Maurice Lehmann <maurice.lehmann@heig-vd.ch>

#Copy sources code of the node server
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

# Start the node server
ENTRYPOINT ["node", "/opt/app/musicianServer.js"]
