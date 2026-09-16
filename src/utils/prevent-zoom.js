const preventBrowserZoom = () => {
  document.addEventListener("wheel", s => {
    s.ctrlKey && s.preventDefault()
  }, {
    passive: !1
  }), document.addEventListener("gesturestart", s => s.preventDefault()), document.addEventListener("gesturechange", s => s.preventDefault()), document.addEventListener("gestureend", s => s.preventDefault()), document.addEventListener("keydown", s => {
    (s.ctrlKey || s.metaKey) && (s.key === "+" || s.key === "-" || s.key === "=" || s.key === "0") && s.preventDefault()
  })
};

preventBrowserZoom();
