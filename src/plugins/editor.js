const EditorJS = require('@editorjs/editorjs')

/**
 * Imports required Editor.js plugins.
 */
const ImageTool = require('@editorjs/image')
const List = require('@editorjs/list')
const Gist = require('editorjs-github-gist-plugin')
const Code = require('@groupher/editor-code')
const InlineCode = require('@editorjs/inline-code')
const Embed = require('@editorjs/embed')
const Marker = require('@editorjs/marker')
const Header = require('@editorjs/header')
const Math = require('editorjs-math')
// const Alert = require('@rmdwirizki/editor-alert')

module.exports = {
  EditorJS,
  ImageTool,
  List,
  Gist,
  Code,
  InlineCode,
  Embed,
  Marker,
  Header,
  Math
  // Alert
}
