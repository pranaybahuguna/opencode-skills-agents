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

function attachZoom() {
  document.querySelectorAll('.mermaid svg').forEach(function(svg) {
    if (svg.dataset.zoomAttached) return
    svg.dataset.zoomAttached = 'true'

    var wrapper = svg.closest('.mermaid')
    wrapper.style.cursor = 'zoom-in'
    wrapper.title = 'Click to zoom'

    wrapper.addEventListener('click', function() {
      var overlay = document.createElement('div')
      overlay.className = 'mermaid-zoom-overlay'

      var clone = svg.cloneNode(true)
      clone.removeAttribute('width')
      clone.removeAttribute('height')
      clone.style.width = '90vw'
      clone.style.height = 'auto'
      clone.style.maxHeight = '90vh'

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
  // MutationObserver watches for SVGs being injected by mermaid
  var observer = new MutationObserver(function() {
    if (document.querySelector('.mermaid svg')) {
      attachZoom()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  // Disconnect after 3s to avoid leaking
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
