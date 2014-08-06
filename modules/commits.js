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
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };

    function replaceTag(tag) {
      return tagsToReplace[tag] || tag;
    }

    function safe_tags_replace(str) {
      return str.replace(/[&<>]/g, replaceTag);
    }

    // => HH:MM
    function formatDate(timestamp) {
      return timestamp.match(/T(\d{2}:\d{2})/)[1]
    }

    function parseTeam(commitUrl) {
      var repoRegex = /https:\/\/github.com\/wowhack\/([._-\w]+)\//,
          res = commitUrl.match(repoRegex, 'g')
      return res && res[1]
    }

    var message = json.message

    if(/<script>(.+)<\/script>/.test(json.message)) {
      message = "*** Look, I'm a script kiddie, tihi! ***"
    }

    message = safe_tags_replace(message)

    return extend({}, json, {
      message: message,
      by: json.committer.username || json.committer.name,
      date: formatDate(json.timestamp),
      team: parseTeam(json.url)
    })
  }

  var commitIsMerge = function(json) {
    return /^Merge branch/.test(json.message)
  }

  return {

    setFirebase: function (fb) {
      this._fb = fb
      return this
    },

    run: function(limit) {
      this._limit = (limit || this._limit) || 8

      this._fb.limit(this._limit)
        .on('child_added', this.render.bind(this))

      return Object.create(this)
    },

    templateString: function(content) {
      this.template = compile(content)
      return this
    },

    limit: function(limit) {
      this._limit = limit
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

      if(commitIsMerge(data.val())) return

      var json = transformData(data.val())

      this.$el.prepend(this.template(json))
      return this
    }
  }
})()

var CommitsCounter = (function () {


  var increaseCounter = function () {

    this.$el
      .text(this._counter++)

    return this
  }

  return {

    setFirebase: function (fb) {
      this._fb = fb
      return this
    },

    setElement: function (selector) {
      this.$el = $(selector)
      return this
    },

    run: function () {
      this._counter = 0

      this._fb
        .on('child_added', increaseCounter.bind(this))

      return Object.create(this)
    }
  }
}())

$(function() {

  var fireBase = new Firebase("https://wowhack.firebaseio.com/commits")

  Commits
    .setFirebase(fireBase)
    .setElement('#commits')
    .limit(15)
    .templateString($("#commit-template").html())
    .run()

  CommitsCounter
    .setFirebase(fireBase)
    .setElement('#commit-counter')
    .run()
})
