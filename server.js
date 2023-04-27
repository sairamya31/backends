const express = require("express");
var path=require('path')
const app = express();
require("dotenv").config();
const cors = require('cors')
const multer = require('multer')
var morgan=require('morgan')
var rfs=require('rotating-file-stream')
var Users = require('./models/userModel');
var Doctor = require('./models/doctorModel');
const bodyparser = require("body-parser");
app.use(bodyparser.json());
const swaggerJSDoc=require('swagger-jsdoc')
// const swaggerSpec=require("./swagger.json")
const swaggerUi = require('swagger-ui-express')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage });
app.use(express.json());

const options={
  definition:{
    openapi: '3.0.0',
    info : {
      title: 'Swagger',
      version: '1.0.0'
    },
    servers:[
      {
        url: 'http://localhost:5000/'
      }
    ]
  },
  apis:['./server.js']
}


const swaggerSpec= swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))




app.get('/',(req,res)=>{
  res.send('Welcome to mongo db')
})

// app.get('/api/doctor/get-appointments-by-doctor-id',(req,res)=>{
//   res.render()
// })

app.post('/image',upload.single('file'),function(req,res){
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
})


var access=rfs.createStream('access.log',{
    interval: '1h' ,
    path:path.join(__dirname,'log')
})
app.use(morgan('tiny',{stream:access}))
const dbConfig = require("./config/dbConfig");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");


app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);


const port = process.env.PORT || 5000;
console.log(process.env.MONGO_URL);
app.listen(port, () => console.log(`Listening in the port ${port}`));


