const mongoose = require('mongoose');
mongoose.connect(process.env.DB_MONGO,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("success");
}).catch((e)=>{
    console.log("failure");
})