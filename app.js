const dotEnv = require('dotenv').config({path:'./.env'});
const Express = require('express');
const path = require('path');


const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const database = require('./util/database');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Profile = require('./models/profile');

const app = Express();

app.use(bodyParser.json());


app.use('/user',userRoutes);

app.use('/profile',profileRoutes);




app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname),`public/${req.url}`);
});

User.hasMany(Profile);
Profile.belongsTo(User);

database
// .sync()
.sync({force:true})
.then(()=>{
    
    app.listen(process.env.PORT);
})
.catch((err)=> console.log(err));
