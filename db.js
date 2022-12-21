const mongoose = require('mongoose');
const connection = mongoose.connect(process.env.MDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection successful");
}).catch((err) =>{
    console.log("connection failed");
})



//second way
// module.exports = () => {
// 	const connection = mongoose
// 		.connect(process.env.MDBURL)
// 		.then((result) => console.log("Connected to database"))
// 		.catch((err) => console.log("could not connect to database"));
// };

module.exports = connection;