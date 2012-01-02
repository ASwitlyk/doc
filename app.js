var express = require('express')
var app = module.exports = express.createServer()

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views')
  app.set('view engine', 'ejs')
  app.helpers(require("express-view-helpers"))
  app.helpers({
    koala: require("koala").render
  })
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(require('connect').compiler({ src: __dirname + '/public', enable: ['less'] }))
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

app.configure('production', function(){
  app.use(express.errorHandler())
})

// Routes
app.get('/', function(req, res){
  var navigation = {
    "installation": 'Installation',
    "usage": 'Usage',
    "sync-with-db": 'Synchronize with database',
    "instances": "Models and instances",
    "expanding-models": "Expanding models",
    "chain-queries": "Chain queries",
    "associations": "Associations",
    "find-objects": "Finding objects",
    'additional': 'Additional information',
    "projects": "Sequelize-based projects"
  }

  res.render('index', {
    navigation: navigation,
    active: req.param('active') || 'installation'
  })
})

if (!module.parent) {
  app.listen(process.env.PORT || 3000)
  console.log("Express server listening on port %d", app.address().port)
}
