# linkuriboh.com
Public facing repository for [Linkuriboh.com](http://linkuriboh.com).
![](https://i.imgur.com/1G0s0i2.png)

Note the project (specifically the api in `server.js`) is intended to connect to a MySQL database, which looks like the `schema.sql`.
However the actual scraping script which runs nightly on the linkuriboh.com server and writes into the database is not committed here as a. It's extremely unfriendly and messy b. I am not accepting any contributions to it at this time.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
