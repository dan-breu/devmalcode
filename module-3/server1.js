'use strict';
import express from 'express'

const app = express();
const port = 3000;

let comments = [];

app.get("/", (req, res) => {

    const form = `<h2>Leave a comment</h2>
            <form method="GET" action="/submit">
            <input name="msg" placeholder="Your message here" />
            <button>Submit</button>
        </form>
        <hr/>
        ${comments.map(c => `<p>${c}</p>`).join('')}`;
    console.log(comments);
    res.send(form);

})

app.get("/submit", (req, res) => {
    const msg = req.query.msg;
    comments.push(msg); //agregate into comments the message sent by the user
    console.log(msg)
    res.redirect("/");
});


app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`)
})