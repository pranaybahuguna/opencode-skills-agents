// Initialise Mermaid diagrams on every page load.
// Hooks into MkDocs Material's SPA navigation so diagrams
// render correctly when navigating between pages, not just on first load.

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

// MkDocs Material SPA navigation hook
if (typeof document$ !== 'undefined') {
  document$.subscribe(function () {
    mermaid.initialize(mermaidConfig)
    mermaid.run({ querySelector: '.mermaid' })
  })
} else {
  // Fallback for non-Material or direct page load
  mermaidConfig.startOnLoad = true
  mermaid.initialize(mermaidConfig)
}

