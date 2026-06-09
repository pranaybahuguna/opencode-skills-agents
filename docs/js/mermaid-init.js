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

function openZoom(svg) {
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
}

function attachZoom() {
  document.querySelectorAll('.mermaid svg').forEach(function(svg) {
    if (svg.dataset.zoomAttached) return
    svg.dataset.zoomAttached = 'true'

    var mermaidDiv = svg.closest('.mermaid')

    // Wrap in a container so the button lives outside the mermaid div
    // (mermaid replaces .mermaid innerHTML on re-render, which would delete the button)
    var container = document.createElement('div')
    container.className = 'mermaid-container'
    mermaidDiv.parentNode.insertBefore(container, mermaidDiv)
    container.appendChild(mermaidDiv)

    var btn = document.createElement('button')
    btn.className = 'mermaid-maximize-btn'
    btn.title = 'Maximize diagram'
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>'
    btn.addEventListener('click', function(e) {
      e.stopPropagation()
      openZoom(svg)
    })
    container.appendChild(btn)

    // Click anywhere on diagram also zooms
    mermaidDiv.style.cursor = 'zoom-in'
    mermaidDiv.addEventListener('click', function() {
      openZoom(svg)
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
