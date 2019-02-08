Pantry is a web development framework. It's written entirely with Javascript and is powered by a single, flat-file database. Pantry's speed comes from being able to generate static, optimized files to serve on the fly. When you create or update posts and pages, these cache resources are handled for you. This with the benefit of built-in compression help make one fast website.

Pantry is ideal for small - medium sized companies that sell services, rather than products.  It works exceptionally well for those sites that run AdWords campaigns and use landing pages. Pantry comes packaged with focus on SEO standards, HIPAA compliance, end-user accessibility, visitor to client/patient/customer conversion, and an exemplary cross-device user experience.

We are still in early development, so check back!

## Requirements
- Node.js (Built using v10.15.0)
- NPM (Built using 6.7.0)

You can get both [here](https://nodejs.org).

- PM2 (For local development)

```bash
$ npm install pm2@latest -g
```


## Installation
### Set Up And Use The Pantry Installer (Optional But Easiest)

```bash
$ echo "alias pantry='git clone https://github.com/Kalan-Brock/Pantry.git . && npm install && npm start'" >> ~/.profile && source ~/.profile
```

From an empty folder:

```bash
$ pantry
```

### Set Up Manually

Clone respository, and change to the project directory.

```bash
$ git clone https://github.com/Kalan-Brock/Pantry.git myproject && cd myproject
```

Install Dependencies
```bash
$ npm install
```

## Commands

#### Start Server
```bash
$ npm start
```

#### Stop Server
```bash
$ npm stop
```

#### Gulp Commands
Launch browser sync and ngrok, and gulp will begin to watch assets and files for changes.

```bash
$ gulp watch
```

Build the production assets and cache without launching BrowserSync.

```bash
$ gulp build
```

Flush the site cache.

```bash
$ gulp flushcache
```

Generate a new set of static files in the cache.

```bash
$ gulp staticfiles
```



## View Your Project

Project URL:  http://localhost:5000

Browser Sync Browser:  http://localhost:3000

Browser Sync UI:  http://localhost:3001

ngrok UI:  http://localhost:4040

## Configurations

Some basic site-wide configs can be found in config.json.  Configuration available in four groups (development, testing, staging, production).  Use development as the configuration base, and any overrides go into their associated group.

Environment can bet set in config/config.js.

## TO DO

- Minimal, Secure Authentication
- Implement SparkPost for email delivery.
- Finish page and post editor.
- Image minifying, auto img srcset.