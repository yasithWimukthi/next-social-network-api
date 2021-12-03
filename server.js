import express, {json} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:['http://localhost:3000/']
}))

mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>{
        console.log('database connected')
        const post = process.env.PORT || 8000;

        app.listen(post,()=>{
            console.log('server listening on port 8000')
        })
    })
    .catch(err => {
        console.log(err);
    });
