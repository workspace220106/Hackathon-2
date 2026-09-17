const injectWebManifestLink = () => {
  try {
    const n = document.createElement("link");
    n.rel = "manifest", n.href = "/site.webmanifest", document.head.appendChild(n)
  } catch {}
};

injectWebManifestLink();
