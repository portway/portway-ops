const MarkdownIt = require('markdown-it')

const md = new MarkdownIt({ breaks: true })

module.exports = function renderMarkdownSync(rawMarkdown) {
  return md.render(rawMarkdown)
}