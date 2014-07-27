var SidebarController = (function($) {

  var defaults = {
    navigation: '.slide-menu',
    container: '.slide-container',
    pusher: '.slide-pusher',
    openClass: 'slide-open'
  }

  function Controller(options) {
    this.options = $.extend({}, defaults, options)

    // shortcuts
    this._$nav = $(this.options.navigation)
    this._$cont = $(this.options.container)
    this._$push = $(this.options.pusher)
    this._bindEvents()
  }

  function isOrIsChildOf($el, selector) {
    return !!($el.is(selector) || $el.parents(selector).length);
  }

  $.extend(Controller.prototype, {

    _bindEvents: function() {
      $(document).on('click', this._reset.bind(this))
      $(document).on('keyup', function(evt) {
        if(evt.keyCode === 27 && this.isOpen()) {
          this.hide()
        }
      }.bind(this))
    },

    _reset: function(evt) {
      if( !isOrIsChildOf($(evt.target), this.options.navigation) ) {
        this.hide()
      }
    },

    isOpen: function() {
      return this._$cont.hasClass(this.options.openClass)
    },

    show: function(evt) {
      evt && evt.stopPropagation()
      this._$cont.addClass(this.options.openClass)
      this._$nav.trigger('show')
      this._$nav.trigger('change')
      return this
    },

    hide: function(evt) {
      evt && evt.stopPropagation()
      this._$cont.removeClass(this.options.openClass)
      this._$nav.trigger('close')
      this._$nav.trigger('change')
      return this
    },

    toggle: function(evt) {
      evt && evt.stopPropagation()
      this._$cont.toggleClass(this.options.openClass)
      var event = this.isOpen() ? 'show' : 'close'
      this._$nav.trigger(event)
      this._$nav.trigger('change')
      return this
    }

  })

  return Controller;

})(jQuery)

$(function() {
  var navController = new SidebarController()

  $("#toggle-menu").on('click', function(evt) {
    navController.toggle(evt)
  })

  $('.slide-menu').on('change', function(evt) {
    $("#toggle-menu").toggleClass("active", navController.isOpen())
  })
})
