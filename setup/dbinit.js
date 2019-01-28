const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid');


db.defaults({
    users: [],
    pages: [
        {
            "id": shortid.generate(),
            "slug": "about",
            "layout": "page",
            "title": "About Us",
            "content": "<div class=\"container\"><div class=\"row\"><div class=\"col-12\"><h1>About Us</h1></div></div></div>",
            "author": "Administrator",
            "published": true,
            "meta_keywords": "",
            "meta_description": "",
            "canonical": ""
        },
        {
            "id": shortid.generate(),
            "slug": "services",
            "layout": "page",
            "title": "Services",
            "content": "<div class=\"container\"><div class=\"row\"><div class=\"col-12\"><h1>Services</h1></div></div></div>",
            "author": "Administrator",
            "published": true,
            "meta_keywords": "",
            "meta_description": "",
            "canonical": ""
        }
    ],
    blog_posts: [
        {
            "id": shortid.generate(),
            "slug": "sample-post",
            "title": "Sample Post",
            "excerpt": "This is a sample excerpt.",
            "content": "This is the full content of our sample blog post.",
            "author": "Administrator",
            "published": true,
            "created_on": "2019-01-25T17:56:55.472Z",
            "last_updated": "2019-01-25T17:56:55.472Z",
            "meta_keywords": "",
            "meta_description": "",
            "canonical": ""
        }
    ],
    form_submissions: []
}).write();

let users = db.get('users');
if (users.value().length === 0) {
    let userid = shortid.generate();
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync('mypassword', salt);
    let date = new Date();

    users.push({
        id: userid,
        name: "Administrator",
        email: "admin@website.com",
        password: hash,
        created_on: date,
        last_updated: date
    }).write();

    console.log("Primary admin account created.");
    console.log("Username: Administrator");
    console.log("Password: mypassword");
}