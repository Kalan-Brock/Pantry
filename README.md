# Pantry

Pantry is a web development framework. It's written entirely with Javascript and is powered by a single, flat-file database. Pantry's speed comes from being able to generate static, optimized files to serve on the fly. When you create or update posts and pages, these cache resources are handled for you. This with the benefit of built-in compression help make one fast website.

We are still in early development, so check back!

#### The Tech

- Node.js (built with v.10.15.0)
- NPM (built with v.6.7.0)
- Lowdb
- PM2
- Express
- Gulp (built with v.4.0.0)
- EJS and EJS Layouts

## Installation

npm install

## To Start

npm start

## To Dev

gulp watch

## View Your Project

Project URL:  http://localhost:5000

Browser Sync Browser:  http://localhost:3000

Browser Sync UI:  http://localhost:3001

## To Stop

npm stop

## Configurations

Some basic site-wide configs can be found in config.js.  To be honest, I haven't done much with them yet.

#TO DO

- Authentication
- Implement SparkPost for email delivery.
- Post creation, edit, list, pagination.
- User creation, edit, list, pagination.
- Admin Dashboard.