FROM node:6.0
MAINTAINER Maurice Lehmann <maurice.lehmann@heig-vd.ch>

#Copy sources code of the node server
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

#Expose the port 2205 to permit connexion from locahost
EXPOSE 2205

# Start the node server
ENTRYPOINT ["node", "/opt/app/auditorServer.js"]
