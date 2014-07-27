var Commits = (function() {

  var extend = function(obj) {
    [].slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop]
        }
      }
    })
    return obj
  }

  // Micro templating
  var render = function(string, data) {
    for(var s in data) {
      string = string.replace(new RegExp('{'+s+'}', 'g'), data[s])
    }
    return string
  }

  // Create a template function bound to a
  // template string ready for rendering data
  // Usage: var tmpl = compile('Hi {name}')
  //        var rendered = tmpl({name: 'Johan'})
  //        => 'Hi Johan'
  var compile = function(string) {
    return render.bind(this, string)
  }

  var transformData = function(json) {
    // => HH:MM
    function formatDate(timestamp) {
      var date = new Date(timestamp)
      return date.toLocaleTimeString().match(/\d{2}:\d{2}/, 'g')[0]
    }

    function parseTeam(commitUrl) {
      var repoRegex = /https:\/\/github.com\/wowhack\/(\w+)\//
      return commitUrl.match(repoRegex, 'g')[1]
    }

    return extend({}, json, {
      by: json.committer.username,
      filesChanged: json.modified.length,
      date: formatDate(json.timestamp),
      team: parseTeam(json.url)
    })
  }

  return {
    run: function() {
      this.fb = new Firebase("https://wowhack.firebaseio.com/commits")
      this.fb.on('child_added', this.render.bind(this))

      return Object.create(this)
    },

    templateString: function(content) {
      this.template = compile(content)
      return this
    },

    setElement: function(selector) {
      this.$el = $(selector)
      return this
    },

    render: function(data) {
      if(!this.template) {
        throw "No template provided! Call Commits.templateString with a string"
      }

      var json = transformData(data.val())

      this.$el.prepend(this.template(json))
      return this
    }
  }
})()

$(function() {

  Commits
    .setElement('#commits')
    .templateString($("#commit-template").html())
    .run()
})
