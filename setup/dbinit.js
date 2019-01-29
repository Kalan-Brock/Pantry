const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const shortid = require('shortid');

let thedate = new Date();

db.defaults({
    users: [],
    pages: [
        {
            "id": shortid.generate(),
            "slug": "example",
            "layout": "page",
            "title": "Example Page",
            "content": "<div class=\"container\"><div class=\"row\"><div class=\"col-12\"><h1>Example Page</h1></div></div></div>",
            "author": "Administrator",
            "published": true,
            "should_cache": true,
            "should_amp": true,
            "meta_keywords": "example, page",
            "meta_description": "Pantry CMS example page.",
            "canonical": ""
        }
    ],
    blog_posts: [
        {
            "id": shortid.generate(),
            "slug": "example-post",
            "title": "Example Post",
            "excerpt": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aspernatur at dolore error incidunt magni maiores nam nemo odit pariatur, placeat porro quibusdam ratione recusandae reprehenderit tempora tempore voluptatem! Recusandae.",
            "content": "<div class=\"container\"><div class=\"row\"><div class=\"col-12\"><h1>Example Post</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi dicta dignissimos est eum ex explicabo, harum, hic inventore maiores, minima minus nisi numquam obcaecati odio pariatur repudiandae veniam voluptas voluptate.</p></div></div></div>",
            "author": "Administrator",
            "published": true,
            "should_cache": true,
            "should_amp": true,
            "created_on": thedate,
            "last_updated": thedate,
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
    let hash = bcrypt.hashSync('password', salt);

    users.push({
        id: userid,
        name: "Administrator",
        email: "admin@website.com",
        password: hash,
        created_on: thedate,
        last_updated: thedate
    }).write();

    console.log("Primary admin account created.");
    console.log("Username: Administrator");
    console.log("Password: password");
}