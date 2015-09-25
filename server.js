var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');

var app = express();

app.engine('html', require('ejs').__express);
app.set('views', './views');
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser('%&(^T*&  *)&Y^&*P(*DW{dap9iuidu  KJH JH k *& *&^*()DPS CIUSu cpsai vxiupyz9 e8fp9 O*iuds yiuos yfiuosyfd oiY YF* YEWFO*W&QYE@Q(!*UDP OIU opidu sopi u-'));

app.use(flash());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// Routes
var router = express.Router();
var home = require('./routes/home');

app.use('/', home);

// Start Server
var server = require('http').createServer(app);

server.listen(3000, function() {
    console.log("Server is running on port: 3000");
});

