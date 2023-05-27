FROM  node
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", '/server']

# docker build .
# docker run <images ID>
# docker ps
# docker stop <container id>
# docker run -d <images ID>
# docker run -d -p 4000:3000 <images ID>