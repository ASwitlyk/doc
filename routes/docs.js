var fs            = require('fs')
  , path          = require('path')
  , _             = require('lodash')
  , semver        = require('semver')
  , SidebarHelper = require('../helpers/sidebar-helpers')
  , sectionNames  = ["installation", "usage", "models", "instances", "associations", "migrations", "utils", "misc"]

exports.index = function(req, res) {
  var path     = 'docs/latest'
    , sections = []

  if (!req.param('version')) {
    res.redirect("/docs/latest", 301)
  } else if (!req.param('section')) {
    res.redirect("/docs/" + req.param('version') + "/" + sectionNames[0], 301)
  } else if (req.param('version') !== 'latest') {
    path = 'docs/.' + req.param('version') + '/views/' + path
  }

  sectionNames.forEach(function(sectionName) {
    var section = {
      permalink:   sectionName,
      title:       sectionName.charAt(0).toUpperCase() + sectionName.slice(1),
      subSections: SidebarHelper.readSubSections(path + '/' + sectionName),
    }

    section.url = "/docs/" + req.param('version') + "/" + section.permalink

    sections.push(section)
  })

  sections.push(getVersions())

  res.render(path + '/' + req.param('section'), {
    title:         'Documentation - ' + req.param('section').charAt(0).toUpperCase() + req.param('section').slice(1),
    version:       req.param('version'),
    permalink:     req.param('section'),
    sections:      sections,
    activeNavItem: 'docs',
    sidebarTitle:  'Documentation'
  })
}

// helpers


var getVersions = function(sections) {
  var dirs = fs.readdirSync(path.join(__dirname, '..', 'views', 'docs'))
    , subs = []

  dirs = dirs.filter(function(dir) {
    return ((dir.indexOf('.') === 0) && (dir !== '.DS_Store'))
  }).map(function(dir) {
    return dir.replace('.', '').replace('v', '')
  }).sort(function(a, b) {
    return semver.gt(a, b) ? -1 : 1
  })

  dirs.forEach(function(dir) {
    subs.push({
      text: dir,
      url:  "/docs/" + dir + "/installation"
    })
  })

  subs.unshift({
    text: 'Latest',
    url:  '/docs/latest/installation'
  })

  return {
    permalink:       'version',
    showSubSections: true,
    title:           'Versions',
    subSections:     subs
  }
}
