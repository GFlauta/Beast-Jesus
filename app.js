//API get request - "https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key=" + process.env.API_KEY + "&user_id=149907004@N05&format=json&nojsoncallback=1"

//HTML Injection - <div class=‘cell’ id=‘n (1-30k)’ style=‘width: 28px; height: 28px;’></div>

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.post('/addPixelArt', (req, res) => {
  var data = {};
  $('.cell').each(function(){
    var pixClass = this.class;
    if(pixClass.length > 4) {
      data[this.id] = pixClass.slice(5);
    }
  });
  req.body.div_data = data;
  addPixelArt(req.body)
  .then(function(data) => {
    res.render('/', {data});
  });
});

function createGrid (x, y) {
	while (grid.firstChild) {
  	grid.removeChild(grid.firstChild);
  }
	// set grid width so that divs will properly wrap
  grid.style.width = (6) * x + 'px'
  // get total number of new individual cells needed
  var cellCount = x * y
  // iterate through and create each new cell
  for (var i = 1; i <= cellCount; i++) {
    var newCell = document.createElement('div')
    // set <div class='cell'>
    newCell.classList.add('cell')
    newCell.setAttribute('id', i)
    // newCell.textContent = i
    grid.appendChild(newCell)
    // set cell size to requested px size
    newCell.style.width = '4px'
    newCell.style.height = '4px'
  }
}

function checkOrientation (orientation) {
  if (orientation === 'landscape') {
    createGrid(200, 150)
  } else {
    createGrid(150, 200)
  }
}

module.exports = app;
