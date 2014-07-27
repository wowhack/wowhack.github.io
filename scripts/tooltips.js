(function($) {
  /*
    Simple tooltips, controlled by CSS transitions, by Johan Brook.

    Init and default options:

    $.tooltips({
      className: 'tooltipsy', // The class of the tooltip
      elements: '.tipsy',     // Selector for elements that trigger tooltips. Must have 'title' attribute.
      offset: [0, -10]        // Offset (x, y)
    })
  */

  var rand = function() {
    return Math.random().toString(36).substr(2) // remove `0.`
  }

  var findTooltip = function($el) {
    var tooltipId = $el.data('tooltip')
    return !!tooltipId && $('#'+tooltipId)
  }

  var removeAnimationClasses = function($tooltip) {
    return $tooltip.removeClass('active out')
  }

  var transitionEnd = 'transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd'

  // Create plugin
  $.tooltips = function(options) {

    var defaults = {
      className: "tooltip",
      elements: "[rel='tooltip']",
      offset: [0, -10]
    }

    options = $.extend({}, defaults, options)

    $(document)
    .on('mouseenter', options.elements, function(evt) {
      var $el = $(evt.currentTarget),
          position = $el.position(),
          text = $el.attr('title'),
          $tooltip = findTooltip($el)

      // Create or find the tooltip
      if(!$tooltip) {
        var uniqueId = 'tooltip-'+rand()

        $tooltip = $('<div />', {
          'class': options.className,
          text: text,
          id: uniqueId,
          css: {
            position: 'absolute',
            'z-index': 1010
          }
        })
        .appendTo('body')

        $el.data('tooltip', uniqueId)
      }

      var elWidth = $el.outerWidth()

      $tooltip
      .css({
        top: position.top - $tooltip.outerHeight() + options.offset[1],
        left: position.left + (elWidth / 2) - ($tooltip.outerWidth() / 2) + options.offset[0]
      })
      .addClass('active')

      $el
        .data('original-title', text)
        .removeAttr('title')

    })
    .on('mouseleave', options.elements, function(evt) {
      var $el = $(evt.currentTarget),
          $tooltip = findTooltip($el)

      $tooltip.addClass('out')
      $el.attr('title', $el.data('original-title'))

      setTimeout(function() {
        removeAnimationClasses($tooltip)
      }, 200)
    })

  }
})(jQuery)

$(function() {
  $.tooltips()
})
