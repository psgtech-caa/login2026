import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../../data/seoConfig';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'event';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

/**
 * SEOHead - High-performance React 19 metadata & Schema.org JSON-LD manager.
 * Dynamically updates document title, standard meta tags, Open Graph, Twitter Cards,
 * canonical links, geo-location tags, and structured data scripts on route transitions.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = SITE_CONFIG.defaultOgImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Document Title
    const formattedTitle = title.includes(SITE_CONFIG.shortName)
      ? title
      : `${title} | ${SITE_CONFIG.shortName} — PSG Tech Coimbatore`;
    document.title = formattedTitle;

    // Helper to safely set or create a meta tag
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1] || selector.match(/name='([^']+)'/)?.[1];
          if (name) element.setAttribute('name', name);
        } else if (selector.startsWith('meta[property=')) {
          const prop = selector.match(/property="([^"]+)"/)?.[1] || selector.match(/property='([^']+)'/)?.[1];
          if (prop) element.setAttribute('property', prop);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // Helper for link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'content', description);

    const keywordsString = Array.isArray(keywords)
      ? keywords.join(', ')
      : keywords ||
        'LOGIN 2026, PSG Tech, PSG College of Technology, Coimbatore intercollegiate events, MCA students Coimbatore, hackathon Coimbatore, CTF competition Tamil Nadu, technical symposium Tamil Nadu, coding competitions Coimbatore';
    setMetaTag('meta[name="keywords"]', 'content', keywordsString);

    // Robots directive
    const robotsContent = noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('meta[name="robots"]', 'content', robotsContent);

    // 3. Canonical URL
    const resolvedCanonical = canonicalUrl
      ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${SITE_CONFIG.baseUrl}${canonicalUrl}`)
      : `${SITE_CONFIG.baseUrl}${location.pathname}`;
    setLinkTag('canonical', resolvedCanonical);

    // 4. Open Graph Tags
    const absoluteOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.baseUrl}${ogImage}`;
    setMetaTag('meta[property="og:title"]', 'content', formattedTitle);
    setMetaTag('meta[property="og:description"]', 'content', description);
    setMetaTag('meta[property="og:url"]', 'content', resolvedCanonical);
    setMetaTag('meta[property="og:image"]', 'content', absoluteOgImage);
    setMetaTag('meta[property="og:type"]', 'content', ogType);
    setMetaTag('meta[property="og:site_name"]', 'content', 'LOGIN 2026 | PSG Tech MCA');
    setMetaTag('meta[property="og:locale"]', 'content', 'en_US');

    // 5. Twitter / X Card Tags
    setMetaTag('meta[name="twitter:card"]', 'content', twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'content', formattedTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', description);
    setMetaTag('meta[name="twitter:image"]', 'content', absoluteOgImage);

    // 6. Geographic / Local SEO Meta Tags (Peelamedu, Coimbatore, Tamil Nadu)
    setMetaTag('meta[name="geo.region"]', 'content', 'IN-TN');
    setMetaTag('meta[name="geo.placename"]', 'content', 'Coimbatore');
    setMetaTag('meta[name="geo.position"]', 'content', `${SITE_CONFIG.organizer.geo.latitude};${SITE_CONFIG.organizer.geo.longitude}`);
    setMetaTag('meta[name="ICBM"]', 'content', `${SITE_CONFIG.organizer.geo.latitude}, ${SITE_CONFIG.organizer.geo.longitude}`);

    // 7. Schema.org Structured Data (JSON-LD)
    const scriptId = 'seo-structured-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (structuredData) {
      const dataPayload = Array.isArray(structuredData)
        ? {
            '@context': 'https://schema.org',
            '@graph': structuredData,
          }
        : structuredData;
      scriptTag.textContent = JSON.stringify(dataPayload);
    } else {
      // Default website + organization schema
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE_CONFIG.baseUrl}/#website`,
            name: 'LOGIN 2026',
            url: SITE_CONFIG.baseUrl,
          },
          {
            '@type': 'EducationalOrganization',
            '@id': `${SITE_CONFIG.baseUrl}/#organization`,
            name: 'PSG College of Technology',
            url: SITE_CONFIG.organizer.institutionWebsite,
          },
        ],
      });
    }

    // Cleanup when component unmounts (reset script or let next page overwrite)
    return () => {
      // Intentionally keep for smooth transitions until next route mounts
    };
  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    ogType,
    twitterCard,
    noIndex,
    structuredData,
    location.pathname,
  ]);

  return null;
};
