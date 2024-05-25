var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressSession = require('express-session');
const flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var adminsRouter = require('./routes/admins');
// var viewRouter = require('./routes/view');
// var showsRouter = require('./routes/showing')
const passport = require('passport');
const passport1 = require('passport')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 600000},
  secret: "Jay Shree Ram"
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

// app.use(passport1.initialize());
// app.use(passport1.session());
// passport1.serializeUser(adminsRouter.serializeUser());
// passport1.deserializeUser(adminsRouter.deserializeUser());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/admins', adminsRouter);
// app.use('/show', viewRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
