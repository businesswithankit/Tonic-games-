import { Game, Category } from '../types';
import { getGameSlug } from './slug';

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
}

const SITE_DOMAIN = 'https://gamestonic.com'; // Fallback domain for canonicals

/**
 * Gets the custom URL path for any page view.
 */
export function getPageUrl(
  page: string,
  extra?: string | null,
  allGames: Game[] = []
): string {
  switch (page) {
    case 'home':
      return '/';
    case 'games':
      return '/games';
    case 'categories':
      return '/categories';
    case 'category':
      return extra ? `/category/${extra}` : '/categories';
    case 'trending':
      return '/trending';
    case 'featured':
      return '/featured';
    case 'upcoming':
      return '/upcoming';
    case 'search':
      return '/search';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'privacy':
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms':
    case 'terms-and-conditions':
      return '/terms-and-conditions';
    case 'community-guidelines':
      return '/community-guidelines';
    case 'submission-policy':
      return '/submission-policy';
    case 'dmca':
      return '/dmca';
    case 'copyright-removal':
      return '/copyright-removal';
    case 'submission':
    case 'developer-submission':
      return '/developer-submission';
    case 'admin':
      return '/admin';
    case 'game':
      if (extra) {
        // If extra is already a slug, use it
        return `/game/${extra}`;
      }
      return '/games';
    default:
      return '/';
  }
}

/**
 * Updates head meta elements dynamically
 */
export function updatePageMeta(meta: PageMetadata, game?: Game | null) {
  // 1. Update Title
  document.title = meta.title;

  // 2. Helper to set/update meta tag
  const setMetaTag = (attributeName: string, attributeValue: string, content: string) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attributeName, attributeValue);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // 3. Set Description
  setMetaTag('name', 'description', meta.description);

  // 4. Set Robots
  if (meta.noindex) {
    setMetaTag('name', 'robots', 'noindex, nofollow');
  } else {
    setMetaTag('name', 'robots', 'index, follow');
  }

  // 5. Open Graph / Facebook
  setMetaTag('property', 'og:title', meta.title);
  setMetaTag('property', 'og:description', meta.description);
  setMetaTag('property', 'og:url', meta.canonical);
  setMetaTag('property', 'og:type', game ? 'video.other' : 'website');
  if (meta.ogImage) {
    setMetaTag('property', 'og:image', meta.ogImage);
  }

  // 6. Twitter Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', meta.title);
  setMetaTag('name', 'twitter:description', meta.description);
  if (meta.ogImage) {
    setMetaTag('name', 'twitter:image', meta.ogImage);
  }

  // 7. Canonical link tag
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonical);

  // 8. Structured Data (JSON-LD)
  updateStructuredData(meta, game);
}

/**
 * Injects/updates JSON-LD script for SEO
 */
function updateStructuredData(meta: PageMetadata, game?: Game | null) {
  let scriptElement = document.getElementById('seo-json-ld') as HTMLScriptElement;
  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = 'seo-json-ld';
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  let structuredData: any = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_DOMAIN}/#website`,
        'url': SITE_DOMAIN,
        'name': 'GAMES TONIC',
        'description': 'Premium HTML5 gaming portal containing hundreds of free-to-play browser games with instant loading.',
        'publisher': {
          '@type': 'Organization',
          'name': 'GAMES TONIC',
          'logo': {
            '@type': 'ImageObject',
            'url': `${SITE_DOMAIN}/public/icon-512.png`,
          },
        },
      },
    ],
  };

  if (game) {
    // Game Schema
    const gameSchema = {
      '@type': 'VideoGame',
      '@id': `${meta.canonical}/#videogame`,
      'name': game.title,
      'description': game.description,
      'image': game.thumbnail,
      'genre': game.category,
      'version': game.version || '1.0.0',
      'datePublished': game.releaseDate || game.createdTime,
      'author': {
        '@type': 'Organization',
        'name': game.developer || 'GAMES TONIC Partner',
      },
      'playMode': 'SinglePlayer',
      'applicationCategory': 'Game',
      'operatingSystem': 'Web, Mobile, Desktop',
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      '@id': `${meta.canonical}/#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': SITE_DOMAIN,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Games',
          'item': `${SITE_DOMAIN}/games`,
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': game.category,
          'item': `${SITE_DOMAIN}/category/${game.category.toLowerCase()}`,
        },
        {
          '@type': 'ListItem',
          'position': 4,
          'name': game.title,
          'item': meta.canonical,
        },
      ],
    };

    structuredData['@graph'].push(gameSchema, breadcrumbSchema);
  }

  scriptElement.textContent = JSON.stringify(structuredData);
}
