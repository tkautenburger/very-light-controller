FROM arm32v7/node

RUN npm install express --save
RUN npm install body-parser --save
RUN npm install cookie-parser --save
RUN npm install multer --save

RUN npm install onoff --save

ADD light.js /light.js

ENTRYPOINT ["node", "/root/js/light.js"]
