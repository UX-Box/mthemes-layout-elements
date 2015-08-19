'use strict';

(function($) {

  var events            = _.extend({}, Backbone.Events),
      acfGroupId        = 'acf-group_55d1a53d54d85',
      layoutElements    = {
        events : events
      },
      stopElementsParse = false,
      interval

  // init
  
  $(document).on('panels_setup', function () {

    layoutElements.$add   = $(['#', acfGroupId, ' .acf-flexible-content > ul.acf-hl a.acf-fc-add'].join(''))
    layoutElements.$rows  = $('.so-rows-container')

    setParseInterval();
  })

  // events

  events.on('parseElements', parseElements)
  events.on('clearParseInterval', clearParseInterval)
  events.on('parsePanels', parsePanels)

  // functions

  function parseElements () {
    if(stopElementsParse){
      return
    }

    var $widgets         = layoutElements.$rows.find('.so-widget-wrapper'),
        layoutElementsId = [],
        $panel

    // loop widgets
    
    $widgets.each(function (i) {
      var $widget     = $widgets.eq(i),
          elementData = $widget.find('.description').text().trim().match(/^layout\-element\-(.+?)\-(.+)$/),
          elementId,
          elementType,
          $acfInput

      if (elementData) {
        elementId   = elementData[1]
        elementType = elementData[2]
        $acfInput   = $(['.values [data-layout="', elementType ,'"] [data-name="layout_element_id"] .acf-input input[value="', elementId ,'"]'].join(''))

        layoutElementsId.push(elementId)

        // create new box & fill the layout_element_id value inside the new field
        if ($acfInput.length === 0) {
          layoutElements.$add.click()
          layoutElements.$add.next().find(['a[data-layout="', elementType ,'"]'].join('')).click()
          $(['.values [data-layout="', elementType ,'"] [data-name="layout_element_id"] .acf-input input[value=""]'].join('')).attr('value', elementId)
        }

        // hide duplicate link
        $widget.find('a.widget-duplicate').addClass('hide')

      }
    })

    // loop fields

    layoutElements.$forms = $(['#', acfGroupId, ' .values .layout'].join(''))

    layoutElements.$forms.each(function () {
      var $layout   = $(this),
          $input    = $layout.find('[data-name="layout_element_id"] .acf-input input'),
          elementId = $input.attr('value')

      // remove element

      if (layoutElementsId.indexOf(elementId) < 0) {
        $layout.find('a.acf-fc-remove').click()
      }
    })

  }

  function clearParseInterval () {
    clearInterval(interval)
  }

  function setParseInterval () {
    if (interval) {
      clearParseInterval()
    }

    interval = setInterval(function () {
      events.trigger('parseElements')
      // events.trigger('parsePanels')
    }, 1000)
  }

  function parsePanels () {
    var $panels        = $('body > .so-panels-dialog-wrapper'),
        everyPanelHide = true

    if($panels.length){
      $panels.each(function (i) {
        var $panel = $panels.eq(i),
            $panelContent,
            $layoutElement,
            elementId,
            isLayoutElement,
            isTableAlreadyPresent

        if ($panel.css('display') === 'block') {
          stopElementsParse     = true
          everyPanelHide        = false
          $panelContent         = $panel.find('.so-content'),
          $layoutElement        = $panelContent.find('.mthemes-layout-element'),
          isTableAlreadyPresent = $panelContent.find('.acf-input-table').length === 0

          if ($layoutElement.length === 1 && isTableAlreadyPresent) {
            elementId = $layoutElement.text().trim()

            // find fields table and move it inside the panel
            layoutElements.$forms.each(function (i) {
              var $form       = layoutElements.$forms.eq(i),
                  $input      = $form.find(['input[value="', elementId ,'"]'].join('')),
                  $inputTable

              if ( $input.length === 1 ) {
                $inputTable = $form.find('.acf-input-table').detach()
                $panelContent.append($inputTable)
              }
            })
          }
        }
      })
    }

    if (everyPanelHide) {
      stopElementsParse = false
    }
  }

})(jQuery)