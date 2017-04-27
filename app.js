//API get request - "https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=" + process.env.API_KEY + "&user_id=149907004@N05&format=json&nojsoncallback=1"

//HTML Injection - <div class=‘cell’ id=‘n (1-30k)’ style=‘width: 28px; height: 28px;’></div>

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
var bcrypt = require('bcrypt')
var queries = require('./db/queries')
var key = process.env.COOKIE_KEY || 'lkashdflkjhasdkfjhasklj'
var queries = require('./db/queries.js');



var index = require('./routes/index');
var gallery = require('./routes/gallery');
var user = require('./routes/user');
var pixel_page = require('./routes/pixel_page');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: [key],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);

app.use('/pixel_page', pixel_page);
app.use('/gallery', gallery);
app.use('/user', user);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.post('/signup', function (req, res, next) {
    console.log(req.body)
    queries.findUserIfExists().where({
            email: req.body.email
        }).first()
        .then(function (user) {
            if (user) {
                alert('User already exists');
                res.redirect('/');

            } else {
                console.log('I do not exist')
                bcrypt.hash(req.body.password, 10).then(function (hash) {
                    req.body.password = hash;
                    console.log(req.body);
                    queries.userTable(req.body)
                        .then(function () {
                            res.send('new user')
                        })
                })
            }
        })
})

app.post('/signin', function (req, res, next) {
    queries.findUserIfExists().where({
            email: req.body.email
        }).first()
        .then(function (user) {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(function (data) {
                    if (data) {
                        if (user.isAdmin === true) {
                            res.redirect('/gallery');
                        } else {
                            console.log(`req.body `, req.body)
                            req.session.id = user.id
                            res.redirect('/pixel_page/' + user.id);
                            console.log(`req.session: `, req.session)
                        }
                    } else {
                        res.send('incorrect password')
                    }
                })
            } else {
                res.send('invalid login')
            }
        })

})

app.post('/addPixelArt', (req, res) => {
    var data = {};
    $('.cell').each(function () {
        var pixClass = this.class;
        if (pixClass.length > 4) {
            data[this.id] = pixClass.slice(5);
        }
    });
    req.body.div_data = data;
    queries.addPixelArt(req.body)
        .then(data => {
            res.render('/', {
                data
            });
        });
});



module.exports = app;

