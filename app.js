const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const app = express()
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require("passport")
const dotenv = require('dotenv')

dotenv.config()

//passport config:
require('./config/passport')(passport)

//mongoose
mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err))


app.use("/static", express.static("public"))
//EJS
app.set('view engine','ejs')
app.use(expressEjsLayout)

//BodyParser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error  = req.flash('error')
    next()
    })

// app.use(fileupload({useTempFiles: true}))



//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))
// app.use('/profiles',require('./routes/profiles'))



app.use((req, res) => {
    res.status(404).render('404')
})

app.listen(3000)