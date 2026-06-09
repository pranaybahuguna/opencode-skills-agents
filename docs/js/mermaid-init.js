var mermaidConfig = {
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor:       '#1a2538',
    primaryTextColor:   '#cdd9e5',
    primaryBorderColor: '#00bfa5',
    lineColor:          '#00bfa5',
    secondaryColor:     '#0d1117',
    background:         '#0b0f19',
    edgeLabelBackground:'#0b0f19',
    fontFamily:         'JetBrains Mono, monospace'
  }
}

function downloadSVG(svg) {
  var serializer = new XMLSerializer()
  var svgStr = serializer.serializeToString(svg)
  var blob = new Blob([svgStr], { type: 'image/svg+xml' })
  var url = URL.createObjectURL(blob)
  var a = document.createElement('a')
  a.href = url
  a.download = 'diagram.svg'
  a.click()
  URL.revokeObjectURL(url)
}

function attachZoom() {
  document.querySelectorAll('.mermaid svg').forEach(function(svg) {
    if (svg.dataset.zoomAttached) return
    svg.dataset.zoomAttached = 'true'

    var mermaidDiv = svg.closest('.mermaid')

    // Wrap in container so buttons live outside the mermaid div
    // (mermaid replaces .mermaid innerHTML on re-render which would wipe buttons)
    var container = document.createElement('div')
    container.className = 'mermaid-container'
    mermaidDiv.parentNode.insertBefore(container, mermaidDiv)
    container.appendChild(mermaidDiv)

    // Toolbar
    var toolbar = document.createElement('div')
    toolbar.className = 'mermaid-toolbar'

    // Download button
    var dlBtn = document.createElement('button')
    dlBtn.className = 'mermaid-toolbar-btn'
    dlBtn.title = 'Download SVG'
    dlBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>'
    dlBtn.addEventListener('click', function(e) {
      e.stopPropagation()
      downloadSVG(svg)
    })
    toolbar.appendChild(dlBtn)
    container.appendChild(toolbar)

    // Click-to-zoom on diagram
    mermaidDiv.style.cursor = 'zoom-in'
    mermaidDiv.addEventListener('click', function() {
      var overlay = document.createElement('div')
      overlay.className = 'mermaid-zoom-overlay'

      var clone = svg.cloneNode(true)
      clone.removeAttribute('width')
      clone.removeAttribute('height')
      clone.style.width     = '90vw'
      clone.style.height    = 'auto'
      clone.style.maxHeight = '85vh'

      var hint = document.createElement('p')
      hint.className = 'mermaid-zoom-hint'
      hint.textContent = 'click anywhere to close'

      overlay.appendChild(clone)
      overlay.appendChild(hint)
      document.body.appendChild(overlay)

      overlay.addEventListener('click', function() {
        document.body.removeChild(overlay)
      })
    })
  })
}

function renderAndZoom() {
  mermaid.initialize(mermaidConfig)
  mermaid.run({ querySelector: '.mermaid' })
  var observer = new MutationObserver(function() {
    if (document.querySelector('.mermaid svg')) {
      attachZoom()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  setTimeout(function() { observer.disconnect() }, 3000)
}

if (typeof document$ !== 'undefined') {
  document$.subscribe(renderAndZoom)
} else {
  mermaidConfig.startOnLoad = true
  mermaid.initialize(mermaidConfig)
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(attachZoom, 800)
  })
}
