var fs       = require('fs')
  , path     = require('path')
  , jade     = require('jade')

exports.index = function(req, res) {
  res.render('blog/index', {
    activeNavItem: 'blog',
    sidebarTitle:  'Blog',
    title:         'Blog',
    sections:      getSections()
  })
}

exports.show = function(req, res) {
  var section = getSections().filter(function(section) {
    return section.permalink === req.param('permalink')
  })[0]

  res.render('blog/posts/' + section.timestamp + '-' + section.permalink, {
    activeNavItem: 'blog',
    sidebarTitle:  'Blog',
    title:         'Blog - ' + section.title,
    sections:      getSections()
  })
}

// helpers

var getSections = function() {
  var dir      = path.join(__dirname, '..', 'views', 'blog', 'posts')
    , files    = fs.readdirSync(dir)
    , sections = []

  files.forEach(function(section) {
    var m = section.match(/(\d+?)-(.+)\.jade/)

    if (!!m) {
      var content = fs.readFileSync(path.join(dir, section)).toString()
        , title   = content.match(/h2\s(.+)\n/)[1]

      var teaser = content.split('\n').reduce(function(acc, line) {
        if (line.indexOf('h3 Teaser') !== -1) {
          acc[1] = true
          return acc
        } else if (line.indexOf('h3 ') !== -1) {
          acc[1] = false
          return acc
        }

        if (acc[1]) {
          acc[0].push(line.replace(/\s\s\s\s\s\s/g, ''))
        }

        return acc
      }, [[], false])

      sections.push({
        timestamp:   parseInt(m[1], 10),
        teaser:      jade.compile(teaser[0].join("\n"))(),
        permalink:   m[2],
        title:       title,
        url:         '/blog/' + m[2],
        subSections: []
      })
    }
  })

  return sections.sort(function(a,b) {
    if (a.timestamp < b.timestamp) {
      return 1
    } else if (a.timestamp > b.timestamp) {
      return -1
    } else {
      return 0
    }
  })
}

getSections()
