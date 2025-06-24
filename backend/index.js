const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter.js');
const RoadmapItemRouter = require('./Routes/RoadmapItemRouter');
const UpvoteRouter = require('./Routes/UpvoteRouter');
const CommentRouter = require('./Routes/CommentRouter');



require('dotenv').config();
require('./Models/db')

const PORT = process.env.PORT || 9000;

app.get('/',(req,res)=>{
    res.send(`IDEAPLUS Server is running at port ${PORT}`)
})

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use('/auth',AuthRouter)
app.use('/roadmap',RoadmapItemRouter)
app.use('/comments',CommentRouter)
app.use('/upvote',UpvoteRouter)


app.listen(PORT,()=>{
    console.log(`IDEAPLUS Server is running at port ${PORT}`);
})