# e-diary-frontend
(en)
<ol type="I">
  <h1><li>Description:</h1>
  This is a frontend frontend for my thesis. My thesis was: "Implementation of E-diary in frameworks NestJS and Vue.js". This project is meant to be use alongside: https://github.com/Enkeiie/e-dziennik-backend. It offers: <ol type="1">
  <li>Admin panel that allows him to manage users, classes, subjects, parents</li>
  <li>Teacher panel that gives him ability to create and order tests, grade students and check their presence as well as to browse homeroom class grades and presences</li>
  <li>Student panel which allows him to see grades and presences as well as take part in tests</li>
  <li>Parent panel which allows to see grades and presences of children and to send excuses for childrens absences</li>
  <li>All user types have acccess to profile where they can canche their data</li>
  </ol>
  </li>
  <h1><li>What's needed to run:</h1>
  For Docker use:<ul>
  <li>MongoBD database</li>
  <li>Docker</li>
</ul>
  For Windows/Linux use:
  <ul>
  <li>MongoBD database</li>
  <li>Latest Node.js</li>
  <li>Vue.js and NestJS</li>
</ul></li>
  <h1><li>How to run the app:</h1>
    For Docker use:<ol type="1">
  <li>git clone both parts of the app into one directory.</li>
  <li>create docker-compose in the main directory with this content:</li>
  
```

version: '3'
services:
  e_dziennik_frontend:
    build:
      context: ./<frontend directory>
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    networks:
      - app_net
      
  e_dziennik_backend:
    build:
      context: ./<backend directory>
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    networks:
      - app_net

networks:
  app_net:
    driver: bridge
```
  <li>now create dockerfile:</li>
  
  ```
  FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
  ```
  <li>and nginx config file:</li>
  
  ```
  
  server {
      listen 80;
      server_name localhost;
      include /etc/nginx/mime.types;
      location / {
        proxy_pass http://<frontend-container>:8080;
      }
      location /api {
        proxy_pass http://<backend-container>:3000/;
      }
  }
  ```
  </li>
  <li>replace connection data in backend part in the directory "/src/app.module.ts" with your own database connection</li>
  <li>launch MongoDB database and Docker</li>
  <li>run in terminal with <i>docker-compose up</i></li>
</ol>
  For Windows/Linux use:<ol type="1">
  <li>git clone both parts of the app into one directory.</li>
  <li>replace connection data in backend part in the directory "/src/app.module.ts" with your own database connection</li>
   <li>launch MongoDB database</li>
  <li>run in terminal <i>npm run start</i> in backend directoryand <i>npm run serve</i> in frontend directory</li>
</ol>
  </li>
</ol>
(pl)
<ol type="I">
  <h1><li>Opis:</h1>
  Aplikacja kliencka wykonana na potrzebę pracy inżynierskiej. Tematem pracy była: "Implementacja e-dziennika w technologiach NestJS i Vue,js". Projekt powinien być używany razem z : https://github.com/Enkeiie/e-dziennik-backend. Aplikacja oferuje następujące możliwości: <ol type="1">
  <li>Admin panel that allows him to manage users, classes, subjects, parents</li>
  <li>Teacher panel that gives him ability to create and order tests, grade students and check their presence as well as to browse homeroom class grades and presences</li>
  <li>Student panel which allows him to see grades and presences as well as take part in tests</li>
  <li>Parent panel which allows to see grades and presences of children and to send excuses for childrens absences</li>
  <li>All user types have acccess to profile where they can canche their data</li>
  </ol>
  </li>
  <h1><li>What's needed to run:</h1>
  For Docker use:<ul>
  <li>MongoBD database</li>
  <li>Docker</li>
</ul>
  For Windows/Linux use:<ul>
  <li>MongoBD database</li>
  <li>Latest Node.js</li>
  <li>Vue.js and NestJS</li>
</ul>
  </li>
  <h1><li>How to run the app:</h1>
    For Docker use:<ol type="1">
  <li>git clone both parts of the app into one directory.</li>
  <li>create docker-compose in the main directory with this content:</li>
  
```

version: '3'
services:
  e_dziennik_frontend:
    build:
      context: ./<frontend directory>
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    networks:
      - app_net
      
  e_dziennik_backend:
    build:
      context: ./<backend directory>
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    networks:
      - app_net

networks:
  app_net:
    driver: bridge
```
  <li>now create dockerfile:</li>
  
  ```
  FROM nginx:1.21.6
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
  ```
  <li>and nginx config file:</li>
  
  ```
  
  server {
      listen 80;
      server_name localhost;
      include /etc/nginx/mime.types;
      location / {
        proxy_pass http://<frontend-container>:8080;
      }
      location /api {
        proxy_pass http://<backend-container>:3000/;
      }
  }
  ```
  <li>replace connection data in backend part in the directory "/src/app.module.ts" with your own database connection</li>
  <li>launch MongoDB database and Docker</li>
  <li>run in terminal with <i>docker-compose up</i> </li>
</ol>
  For Windows/Linux use:<ol type="1">
  <li>git clone both parts of the app into one directory.</li>
  <li>replace connection data in backend part in the directory "/src/app.module.ts" with your own database connection</li>
   <li>launch MongoDB database</li>
  <li>run in terminal <i>npm run start</i> in backend directoryand <i>npm run serve</i> in frontend directory</li>
</ol>
  </li>
</ol>
