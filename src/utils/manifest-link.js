const injectWebManifestLink = () => {
  try {
    const s = "https://leoparpeix.com",
      e = new URL(s).hostname,
      {
        hostname: t
      } = window.location;
    if (t !== e) return;
    const n = document.createElement("link");
    n.rel = "manifest", n.href = "/site.webmanifest", document.head.appendChild(n)
  } catch {}
};

injectWebManifestLink();
