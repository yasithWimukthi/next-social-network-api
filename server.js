import express, {json} from 'express';
import mongoose from 'mongoose';
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const bodyParser = require('body-parser');

const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.json({limit:'5mb'}));
app.use(express.urlencoded({extended:true}));
// app.use(cors({
//     origin:['http://localhost:3000/']
// }))
// app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>{
        console.log('database connected')
        const port = process.env.PORT || 9000;

        app.listen(port,()=>{
            console.log('server listening on port 9000')
        })
    })
    .catch(err => {
        console.log(err);
    });
