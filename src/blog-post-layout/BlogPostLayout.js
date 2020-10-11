/**
 * Create a structure of the blog post and how each block will be represented.
 */
class BlogPostLayout {
  constructor (blocks) {
    if (process.server) {
      /**
       * Uses 'jsdom' on server side as 'document' object is not available.
       */
      const jsdom = require('jsdom')
      const { JSDOM } = jsdom
      this.dom = new JSDOM()
      this.document = this.dom.window.document
    } else {
      this.document = document
    }

    /**
     * Wraps all blog post markup in a div.
     */
    this.blogPostWrapper = this.document.createElement('div')

    /**
     * Creating markup for each block by providing it as an input to the suitable methods.
     */
    if (blocks) {
      blocks.forEach((item) => {
        if (item.type === 'paragraph') {
          this.createParagraph(item.data)
        } else if (item.type === 'header') {
          this.createHeader(item.data)
        } else if (item.type === 'image') {
          this.createImage(item.data)
        } else if (item.type === 'list') {
          this.createList(item.data)
        } else if (item.type === 'gist') {
          this.createGithubGist(item.data)
        } else if (item.type === 'math') {
          this.createMath(item.data)
        }
      })
    }
  }

  /**
   * Wraps the provided text in a paragraph tag.
   *
   * @param {object} data
   * @param {object} data.text - provided text.
   */
  createParagraph (data) {
    const paragraph = this.document.createElement('p')
    paragraph.innerHTML = data.text
    this.blogPostWrapper.appendChild(paragraph)

    const inlineCodes = this.document.getElementsByClassName('inline-code')

    for (let i = 0; i < inlineCodes.length; i++) {
      inlineCodes[i].style = 'font-family: "Roboto Mono", monospace; font-wight: 400; background-color: #2e2e2e; color: #efefef; padding: 2px;'
    }
  }

  createHeader (data) {
    const header = this.document.createElement('p')

    header.classList.add('text-h4')
    header.classList.add('font-weight-bold')
    header.style = 'padding: 40px 0 12px;'

    header.innerHTML = data.text

    this.blogPostWrapper.appendChild(header)
  }

  /**
   * Creates a container for image from given url and caption.
   *
   * @param {object} data
   * @param {object} data.url - url of the image uploaded
   * @param {object} data.caption - caption provided by the user to image.
   */
  createImage (data) {
    const image = this.document.createElement('img')
    image.src = data.file.url
    image.style = 'width: 100%; margin: auto;'

    const caption = this.document.createElement('span')
    caption.textContent = data.caption
    caption.style = 'font-size: 16px; color: #808080; font-weight: 300; margin-top: 8px;'

    const wrapper = this.document.createElement('div')
    wrapper.style = 'text-align: center; margin: 32px 0px;'

    wrapper.appendChild(image)
    wrapper.appendChild(caption)

    this.blogPostWrapper.appendChild(wrapper)
  }

  /**
   * Creates list based on the given style and items.
   *
   * @param {object} data
   * @param {object} data.style - list type i.e. ordered or unordered.
   * @param {Iterable} data.items - list items data.
   */
  createList (data) {
    let list

    if (data.style === 'unordered') {
      list = this.document.createElement('ul')
    } else {
      list = this.document.createElement('ol')
    }

    data.items.forEach((item) => {
      const listElement = this.document.createElement('li')
      listElement.innerHTML = item
      list.appendChild(listElement)
    })

    this.blogPostWrapper.appendChild(list)
  }

  /**
   * Embeds a Github Gist from the given url.
   *
   * @param {object} data
   * @param {object} data.url - Github Gist url.
   */
  createGithubGist (data) {
    this.blogPostWrapper.innerHTML += `
          <iframe scrolling="no" frameBorder="0" style="width: 100%; height: 400px; z-index: 10; margin: 16px 0 4px 0;"
          onload="this.style.height = this.contentWindow.document.body.scrollHeight + 'px'; const links = this.contentWindow.document.getElementsByTagName('a'); for (let i = 0; i < links.length; i++) links[i].setAttribute('target', '_blank'); this.contentWindow.document.body.innerHTML += '<style>body .gist .gist-file .highlight{background:#141414}body .gist .blob-code-inner,body .gist .blob-num,body .gist .highlight,body .gist .pl-enm,body .gist .pl-ko,body .gist .pl-mdr,body .gist .pl-mo,body .gist .pl-mp1 .pl-sf,body .gist .pl-ms,body .gist .pl-pdc1,body .gist .pl-scp,body .gist .pl-smc,body .gist .pl-som,body .gist .pl-va,body .gist .pl-vpf,body .gist .pl-vpu{color:#aab1bf}body .gist .pl-mb,body .gist .pl-pdb{font-weight:700}body .gist .pl-c,body .gist .pl-c span,body .gist .pl-pdc{color:#5b6270;font-style:italic}body .gist .pl-sr .pl-cce{color:#56b5c2;font-weight:400}body .gist .pl-ef,body .gist .pl-en,body .gist .pl-enf,body .gist .pl-eoai,body .gist .pl-kos,body .gist .pl-mh .pl-pdh,body .gist .pl-mr{color:#61afef}body .gist .pl-ens,body .gist .pl-vi{color:#be5046}body .gist .pl-enti,body .gist .pl-mai .pl-sf,body .gist .pl-ml,body .gist .pl-sf,body .gist .pl-sr,body .gist .pl-sr .pl-sra,body .gist .pl-src,body .gist .pl-st,body .gist .pl-vo{color:#56b5c2}body .gist .pl-eoi,body .gist .pl-mri,body .gist .pl-pds,body .gist .pl-pse .pl-s1,body .gist .pl-s,body .gist .pl-s1{color:#97c279}body .gist .pl-k,body .gist .pl-kolp,body .gist .pl-mc,body .gist .pl-pde{color:#c578dd}body .gist .pl-mi,body .gist .pl-pdi{color:#c578dd;font-style:italic}body .gist .pl-mp,body .gist .pl-stp{color:#818896}body .gist .pl-mdh,body .gist .pl-mdi,body .gist .pl-mdr{font-weight:400}body .gist .pl-mdht,body .gist .pl-mi1{color:#97c279;background:#020}body .gist .pl-md,body .gist .pl-mdhf{color:#df6b75;background:#200}body .gist .pl-corl{color:#df6b75;text-decoration:underline}body .gist .pl-ib{background:#df6b75}body .gist .pl-ii{background:#e0c184;color:#fff}body .gist .pl-iu{background:#e05151}body .gist .pl-ms1{color:#aab1bf;background:#373b41}body .gist .pl-c1,body .gist .pl-cn,body .gist .pl-e,body .gist .pl-eoa,body .gist .pl-eoac,body .gist .pl-eoac .pl-pde,body .gist .pl-kou,body .gist .pl-mb,body .gist .pl-mm,body .gist .pl-mp .pl-s3,body .gist .pl-mq,body .gist .pl-s3,body .gist .pl-sok,body .gist .pl-sv{color:#d19965}body .gist .pl-enc,body .gist .pl-entc,body .gist .pl-pdb,body .gist .pl-pse .pl-s2,body .gist .pl-s2,body .gist .pl-sc,body .gist .pl-smp,body .gist .pl-sr .pl-sre,body .gist .pl-stj,body .gist .pl-v{color:#e4bf7a}body .gist .pl-ent,body .gist .pl-entl,body .gist .pl-entm,body .gist .pl-mdh,body .gist .pl-mdi,body .gist .pl-mh,body .gist .pl-pdv,body .gist .pl-smi,body .gist .pl-sol{color:#df6b75}body .gist .gist-meta{color:#dfdfdf;background-color:#141414}body .gist .gist-meta a{color:#fff;}body .gist .gist-file{border-color:#333333;}body .gist .gist-data{border-color:#333333;}body .gist .highlight .js-line-number{background-color:#000000;}</style>';"
          srcdoc="<script src='${data.url}'></script>" >
          </iframe>
          <div style="margin: 0 0 16px 0; font-size: 15px; color: #808080; text-align: center;">${data.caption}</div>
        `
  }

  /**
   * LaTeX is a high-quality typesetting system.
   * It includes features designed for the production of technical and scientific documentation.
   * This method converts provided text to latex.
   *
   * @param {object} data
   * @param {object} data.text - latex text
   */
  createMath (data) {
    const equation = this.document.createElement('img')
    equation.src = 'https://latex.codecogs.com/svg.latex?' + data.text
    equation.style = 'filter: invert(92%);'

    const wrapper = this.document.createElement('div')
    wrapper.style = 'display: flex; justify-content: center; align-items: center; padding: 16px 8px; margin: 20px 8px; border-radius: 4px; background-color: #1e1e1e;'
    wrapper.appendChild(equation)

    this.blogPostWrapper.appendChild(wrapper)
  }
}

/**
 * Returns a wrapper containing all the blog post markup.
 *
 * @param {object} blocks - blocks provided by Editor.js which will be used to create the markup using the BlogPostLayout class.
 */
export default function createBlogPost (blocks) {
  const blogPost = new BlogPostLayout(blocks)
  return blogPost.blogPostWrapper.innerHTML
}
