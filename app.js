const dotEnv = require('dotenv').config({path:'./.env'});
const Express = require('express');
const path = require('path');


const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/application');
const database = require('./util/database');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Profile = require('./models/profile');
const Application = require('./models/application');

const app = Express();

app.use(bodyParser.json());


app.use('/user',userRoutes);

app.use('/profile',profileRoutes);

app.use('/application',applicationRoutes);




app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname),`public/${req.url}`);
});

User.hasMany(Profile);
Profile.belongsTo(User);

Application.belongsTo(Profile);
Profile.hasMany(Application);

database
.sync()
// .sync({force:true})
.then(()=>{
    
    app.listen(process.env.PORT);
})
.catch((err)=> console.log(err));
