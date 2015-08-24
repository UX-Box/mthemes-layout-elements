'use strict';

(function ($) {

  if (!window._) {
    return
  }

  if (!window.Backbone) {
    return
  }

  if(!window.location.pathname.match(/post\.php/)) {
    return
  }

  var events          = _.extend({}, Backbone.Events),
      acfFieldGroupId = 'acf-group_55d1a53d54d85',
      $wpEditor,
      $pageBuilder,
      $pageBuilderTab,
      $acfFieldGroup,
      $wpEditorDisplay,
      $pageBuilderDeleteWidget,
      $pageBuilderEditWidget,
      $pageBuilderWidgets,
      $pageBuilderPanels,
      $acfAddElement,
      $acfFields,
      panelCurrent,
      panelCurrentDataTable,
      panelsAvailable = []

  window.mthemesLayoutElementsEvents = events

  // intercept any ajax call

  XMLHttpRequest.prototype.__send = XMLHttpRequest.prototype.send
  XMLHttpRequest.prototype.send = function(body) {
      if (body && body.split) {
        var bodySplitted = body.split('&')

        if (bodySplitted.indexOf('action=so_panels_builder_content') >= 0) {
          this.addEventListener('load', function () {
            events.trigger('widget.add')
          })
        }
      }

      this.__send(body)
  }

  // functions

  function isElementVisible ($el) {
    return $el.css('display') !== 'none' && $el.css('visibility') === 'visible'
  }

  function widgetDescriptionData (description) {
    return description.match(/^layout\-element\-(.+?)\-(.+)$/)
  }

  function acfGetField (elementId) {
    return $acfFieldGroup.find(['.values [data-name="layout_element_id"] .acf-input input[value="', elementId ,'"]'].join(''))
  }

  function getParentWithClass ($node, className) {
    var condition = false,
        $parent   = $node,
        $parentWithClass,
        parentClasses

    while (!condition) {
      $parent = $parent.parent()
      
      if ($parent.hasClass(className)) {
        condition        = true
        $parentWithClass = $parent
      }

      if ($parent.prop('tagName') === 'BODY') {
        condition = true
      }
    }

    return $parentWithClass
  }

  // dom events

  $(document).on('panels_setup', function () {
    $wpEditor        = $('#wp-content-wrap')
    $pageBuilder     = $('#so-panels-panels')
    $pageBuilderTab  = $('#content-panels')
    $wpEditorDisplay = $('.so-switch-to-standard')
    $acfFieldGroup   = $(['#', acfFieldGroupId].join(''))
    $acfAddElement   = $acfFieldGroup.find(['.acf-flexible-content > ul.acf-hl a.acf-fc-add'].join(''))

    // test acf

    if (!window.acf) {
      console.warn('Mountain Themes Layout Elements requires advanced custom fields pro.')
      return
    }

    toggleLayoutElementsFieldGroup()
    parseWidgetsAndFields()
    setWidgetsObjects()

    // dom events

    $pageBuilderTab.on('click', function () {
      _.defer(toggleLayoutElementsFieldGroup)
    })

    $wpEditorDisplay.on('click', function () {
      _.defer(toggleLayoutElementsFieldGroup)
    })

    // emitter events

    events.on('widget.add', function () {
      _.defer(parseWidgetsAndFields)
    })

    events.on('widget.delete', function () {
      _.defer(parseWidgetsAndFields)
    })

    events.on('widget.edit', function (elementId) {
      _.defer(function () {
        parseWidgetPanels(elementId)
      })
    })

    events.on('panel.available', function (elementId) {
      panelsAvailable.push(elementId)

      // parse panels if the panel is open
      if (panelCurrent === elementId && !panelCurrentDataTable) {
        parseWidgetPanels(elementId)
      }
    })
  })

  function setWidgetsObjects () {
    $pageBuilderWidgets = $pageBuilder.find('.so-widget-wrapper')
    $acfFields          = $acfFieldGroup.find('.values .layout')

    // delete buttons

    if ($pageBuilderDeleteWidget) {
      $pageBuilderDeleteWidget.off('click.mthemes')
    }

    $pageBuilderDeleteWidget = $pageBuilder.find('.widget-delete')

    $pageBuilderDeleteWidget.on('click.mthemes', function () {
      _.delay(function () {
        events.trigger('widget.delete')
      }, 500)
    })

    // edit buttons

    if ($pageBuilderEditWidget) {
      $pageBuilderEditWidget.off('click.mthemes')
    }

    $pageBuilderEditWidget = $pageBuilder.find('.widget-edit')

    $pageBuilderEditWidget.on('click.mthemes', function () {
      var widgetData = widgetDescriptionData($(this).parent().parent().next().text().trim())
      
      if(widgetData){
        events.trigger('widget.edit', widgetData[1])
      }
    })
  }

  function parseWidgetsAndFields () {
    if (!isElementVisible($pageBuilder)) {
      return
    }

    var elementsIds = []

    setWidgetsObjects()

    // loop widgets
    $pageBuilderWidgets.each(function (i) {
      var $widget     = $pageBuilderWidgets.eq(i),
          description = $widget.find('.description').text().trim(),
          widgetData  = widgetDescriptionData(description),
          $acfInput,
          $acfPopUp,
          elementId,
          elementType

      if (widgetData) {
        elementId   = widgetData[1]
        elementType = widgetData[2]
        $acfInput   = $acfFieldGroup.find(['.values [data-layout="', elementType ,'"] [data-name="layout_element_id"] .acf-input input[value="', elementId ,'"]'].join(''))

        elementsIds.push(elementId)

        // hide duplicate link
        $widget.find('a.widget-duplicate').addClass('hide')

        // create new field & fill the value of layout_element_id
        if ($acfInput.length === 0) {
          $acfAddElement.click()
          $acfPopUp = $acfAddElement.next()
          $acfPopUp.find(['a[data-layout="', elementType ,'"]'].join('')).click()
          _.defer(function () {
            $acfFieldGroup.find(['.values [data-layout="', elementType ,'"] [data-name="layout_element_id"] .acf-input input[value=""]'].join('')).attr('value', elementId)
          })
        }
      }
    })

    // loop fields
    $acfFields.each(function (i) {
      var $acfField = $acfFields.eq(i),
          $input    = $acfField.find('[data-name="layout_element_id"] .acf-input input'),
          elementId

      if ($input.length === 1) {
        elementId = $input.attr('value')
      }

      // remove element
      if (elementsIds.indexOf(elementId) < 0) {
        $acfField.find('a.acf-fc-remove').click()
      }
    })
    
  }

  function parseWidgetPanels (elementId) {

    $pageBuilderPanels = $('.so-panels-dialog-wrapper')

    $pageBuilderPanels.each(function (i) {
      if (isElementVisible($pageBuilderPanels.eq(i))) {
        var $pageBuilderPanelContent = $pageBuilderPanels.eq(i).find('.so-content'),
            $acfInput   = acfGetField(elementId),
            $acfTable   = getParentWithClass($acfInput, 'acf-input-table'),
            $panelClose = $pageBuilderPanels.eq(i).find('.so-close'),
            $acfTablePanel

        panelCurrent          = elementId
        panelCurrentDataTable = false

        // move table to the panel on open
        if (panelsAvailable.indexOf(panelCurrent) >= 0) {
          $acfTable.parent().addClass('mthemes-acf-table-placeholder')
          $acfTablePanel = $acfTable.detach()
          $pageBuilderPanelContent.append( $acfTable )

          panelCurrentDataTable = true

          // move table to the original position on close
          $panelClose.off('click.mthemes').on('click.mthemes', function () {
            $('.mthemes-acf-table-placeholder')
              .removeClass('mthemes-acf-table-placeholder')
              .append($acfTablePanel.detach())

            panelCurrent          = null
            panelCurrentDataTable = false
          })
        }

      }
    })
  }

  function toggleLayoutElementsFieldGroup () {
    if (isElementVisible($pageBuilder)) {
      $acfFieldGroup.removeClass('hide')
    }
    else {
      $acfFieldGroup.addClass('hide')
    }
  }

})(jQuery)