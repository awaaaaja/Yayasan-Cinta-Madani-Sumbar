const SITE_NAME = "Yayasan Cinta Madani";

function setOrCreateMeta(property: string, content: string, isProperty = false): void {
  const attr = isProperty ? "property" : "name";
  let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

export function usePageHead(options: {
  title?: string;
  description?: string;
  ogImage?: string;
}) {
  const fullTitle = options.title ? `${options.title} | ${SITE_NAME}` : SITE_NAME;
  document.title = fullTitle;

  if (options.description) {
    setOrCreateMeta("description", options.description);
    setOrCreateMeta("og:description", options.description, true);
    setOrCreateMeta("twitter:description", options.description);
  }

  setOrCreateMeta("og:title", fullTitle, true);
  setOrCreateMeta("twitter:title", fullTitle);
  setOrCreateMeta("twitter:card", "summary_large_image");

  if (options.ogImage) {
    setOrCreateMeta("og:image", options.ogImage, true);
    setOrCreateMeta("twitter:image", options.ogImage);
  }
}
