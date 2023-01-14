require("dotenv").config();
const express = require('express');
const app = express();
const router = require('./src/routes/router');
const clientRoute = require('./src/routes/clientRouter');
require("./db");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", router);
app.use(express.urlencoded({ extended: true }));
app.use('/api/client', clientRoute);


app.get('/test', (req, res) => {
    res.send("hiiiiiiiiiiiii app.js");
})



app.listen(port, () => console.log(`listening on port ${port}!`))

