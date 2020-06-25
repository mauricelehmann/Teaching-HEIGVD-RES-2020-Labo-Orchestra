FROM node:8.0
MAINTAINER Maurice Lehmann <maurice.lehmann@heig-vd.ch>

#Copy sources code of the node server
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

#Expose the port
EXPOSE 2205

# Start the node server
ENTRYPOINT ["node", "/opt/app/musicianServer.js"]
