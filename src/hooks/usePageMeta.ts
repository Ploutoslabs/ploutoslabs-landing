import { useEffect } from "react";

const SITE_ORIGIN = "https://ploutoslabs.io";

/**
 * Per-route <head> tags for an SPA: title, meta description, and canonical.
 * Values are restored per navigation, not on unmount, so the last-rendered
 * page always wins.
 */
export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;

    const desc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (desc) desc.content = description;

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_ORIGIN}${path}`;

    const ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );
    if (ogTitle) ogTitle.content = title;

    const ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]',
    );
    if (ogUrl) ogUrl.content = `${SITE_ORIGIN}${path}`;
  }, [title, description, path]);
}
