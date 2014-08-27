var Counter = (function() {

  var counter = 0,
      framesToSkip = 60

  return {

    _customTicks: [],

    _units: countdown.HOURS | countdown.MINUTES | countdown.SECONDS,

    from: function(date) {
      this.from = date.getTime()
      return this
    },

    until: function(date) {
      this.until = date.getTime()
      return this
    },

    setElement: function(element) {
      this.$el = $(element)
      return this
    },

    done: function(cb) {
      this._cb = cb
      return this
    },

    tick: function(cb) {
      this._customTicks.push(cb)
      return this
    },

    _draw: function(timespan) {
      var total = this.until - this.from,
          timeLeft = (timespan.value / total) * 100

      this.$el.css('width', timeLeft+'%')
    },

    _tick: function() {
      var span = countdown(null, this.until, this._units)
      this._draw(span)

      this._customTicks.forEach(function(fn) {
        fn.call(this, span)
      }.bind(this))
      return span
    },

    _update: function() {

      // only update every second
      if(counter < framesToSkip) {
        counter++
        requestAnimationFrame(this._update.bind(this))
        return
      }

      var span = this._tick()

      if(span.value < 0) {
        cancelAnimationFrame(this._id)
        this._cb && this._cb.call(this)
        return
      }

      counter = 0
      return requestAnimationFrame(this._update.bind(this))
    },

    run: function() {
      if(!this.from || !this.until) {
        throw 'You must specify from and until dates!'
      }

      this._tick()  // initial tick
      this._id = this._update()

      return Object.create(this)
    }
  }

})()

$(function() {
  var $time = $("#timeleft")

  Counter
    .from(new Date(2014, 7, 5, 11, 30))
    .until(new Date(2014, 7, 6, 16))
    .setElement("#counter")
    .tick(function(timespan) {
      var hours = timespan.hours,
          minutes = timespan.minutes,
          seconds = timespan.seconds

      var res = [hours, minutes, seconds].map(function(val) {
        return val < 10 ? "0"+val : val
      }),

      timeString = res[0]+":"+res[1]+":"+res[2]
      $time.text(timeString)
    })
    .run()
})
