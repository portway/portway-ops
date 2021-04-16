const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const moment = require('moment')
const renderMarkdownSync = require('../../coordinators/markdown')

const FIELD_TYPES = {
  STRING: 1,
  TEXT: 2,
  NUMBER: 3,
  IMAGE: 4,
  DATE: 5,
  FILE: 6
}

const IMAGE_ALIGNMENT_OPTIONS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
}

const FIELD_VALUE_RENDERING_FILES = {
  [FIELD_TYPES.STRING]: 'string.html',
  [FIELD_TYPES.TEXT]: 'text.html',
  [FIELD_TYPES.IMAGE]: 'image.html',
  [FIELD_TYPES.NUMBER]: 'number.html',
  [FIELD_TYPES.DATE]: 'date.html',
  [FIELD_TYPES.FILE]: 'file.html'
}

const EJS_TEMPLATE_FUNCTIONS = {}

// Pre-compile ejs render functions from files on load
Object.keys(FIELD_VALUE_RENDERING_FILES).forEach((key) => {
  const fileName = FIELD_VALUE_RENDERING_FILES[key]
  EJS_TEMPLATE_FUNCTIONS[key] = ejs.compile(
    fs.readFileSync(path.join(__dirname, fileName), 'utf8'),
    {
      async: true // returns an async render func
    }
  )
})

/**
 * Takes a field body and returns the rendered value for each type of field
 * @param {FieldBody} field -
 */
module.exports = function getRenderedValueByType(field) {
  const name = field.name
  let value

  switch (field.type) {
    case FIELD_TYPES.STRING:
      value = field['FieldTypeStringValue.value']
      if (value == null) return
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.STRING]({ type: 'string', name, value })
    case FIELD_TYPES.TEXT:
      value = field['FieldTypeTextValue.value']
      console.log(value)
      if (value == null) return
      const html = renderMarkdownSync(value)
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.TEXT]({ html, type: 'text', name })
    case FIELD_TYPES.IMAGE:
      value = field['FieldTypeImageValue.value']
      console.log(field)
      if (value == null) return
      const imageSource = field.formats && field.formats.webp ? field.formats.webp.half : field.value
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.IMAGE]({
        type: 'image',
        name,
        imageSource,
        alt: field.alt,
        width: field.meta && field.meta.width,
        height: field.meta && field.meta.height,
        alignment: field.alignment || IMAGE_ALIGNMENT_OPTIONS.CENTER,
        webpHalf: field.formats && field.formats.webp && field.formats.webp.half,
        webpFull: field.formats && field.formats.webp && field.formats.webp.full
      })
    case FIELD_TYPES.NUMBER:
      value = field['FieldTypeNumberValue.value']
      if (value == null) return
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.NUMBER]({ type: 'number', name, value })
    case FIELD_TYPES.DATE:
      value = field['FieldTypeDateValue.value']
      if (value == null) return
      const formattedDate = field.value && moment(field.value).format('MMMM Do YYYY, h:mm a')
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.DATE]({ type: 'date', name, value, formattedDate })
    case FIELD_TYPES.FILE:
      value = field['FieldTypeFileValue.value']
      if (value == null) return
      return EJS_TEMPLATE_FUNCTIONS[FIELD_TYPES.FILE]({ type: 'file', name, value })
  }
}
