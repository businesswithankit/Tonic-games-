import React, { useEffect, useRef } from 'react';
import { AdPosition, NetworkAd, SponsorAd } from '../types';
import { recordSponsorAdClick } from '../firebase';

interface AdSlotProps {
  position: AdPosition;
  sponsorAds?: SponsorAd[];
  networkAds?: NetworkAd[];
  className?: string;
}

/**
 * Normalizes and validates a redirect URL.
 * Converts "example.com" or "www.example.com" -> "https://example.com"
 * Returns null if empty or invalid.
 */
export function getValidRedirectUrl(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return formatted;
    }
  } catch {
    return null;
  }
  return null;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  position,
  sponsorAds = [],
  networkAds = [],
  className = '',
}) => {
  // Only Active campaigns are displayed
  const activeSponsors = sponsorAds.filter(
    (ad) => ad.position === position && ad.status === 'active'
  );
  const activeNetworks = networkAds.filter(
    (ad) => ad.position === position && ad.status === 'active'
  );

  if (activeSponsors.length === 0 && activeNetworks.length === 0) {
    return null;
  }

  return (
    <div className={`w-full mx-auto my-4 space-y-4 ${className}`}>
      {/* SPONSOR BANNERS (Clean Image-Only Display) */}
      {activeSponsors.map((sponsor) => {
        const redirectUrl = getValidRedirectUrl(sponsor.redirectLink);
        const isClickable = Boolean(redirectUrl);

        const handleSponsorClick = (e: React.MouseEvent) => {
          // Track click in Firestore
          recordSponsorAdClick(sponsor.id);

          if (redirectUrl) {
            e.preventDefault();
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
        };

        return (
          <div
            key={sponsor.id}
            className="w-full overflow-hidden rounded-2xl shadow-lg border border-white/10 bg-slate-950 transition-all hover:border-amber-500/40"
          >
            {isClickable ? (
              <a
                href={redirectUrl!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSponsorClick}
                className="block w-full overflow-hidden group cursor-pointer"
              >
                <img
                  src={sponsor.bannerImage}
                  alt={sponsor.campaignName || 'Sponsor Banner'}
                  className="w-full aspect-[4/1] sm:aspect-[6/1] md:aspect-[8/1] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </a>
            ) : (
              <div className="block w-full overflow-hidden">
                <img
                  src={sponsor.bannerImage}
                  alt={sponsor.campaignName || 'Sponsor Banner'}
                  className="w-full aspect-[4/1] sm:aspect-[6/1] md:aspect-[8/1] object-cover"
                />
              </div>
            )}
          </div>
        );
      })}

      {/* ADS MANAGER (Google AdSense / Network HTML/JS Code) */}
      {activeNetworks.map((netAd) => (
        <NetworkAdRenderer key={netAd.id} netAd={netAd} />
      ))}
    </div>
  );
};

// Component to evaluate HTML and execute <script> tags inside Google AdSense / network codes
const NetworkAdRenderer: React.FC<{ netAd: NetworkAd }> = ({ netAd }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    // Create a wrapper element
    const wrapper = document.createElement('div');
    wrapper.innerHTML = netAd.adCode;

    // Extract scripts and execute them properly
    const scripts = wrapper.getElementsByTagName('script');
    const scriptArray = Array.from(scripts);

    // Replace script elements with fresh executable scripts
    scriptArray.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      if (oldScript.parentNode) {
        oldScript.parentNode.replaceChild(newScript, oldScript);
      }
    });

    container.appendChild(wrapper);
  }, [netAd.adCode]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 text-center shadow-inner">
      <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-500 flex items-center justify-center gap-1">
        <span>ADVERTISEMENT</span>
      </div>
      <div ref={containerRef} className="w-full flex justify-center items-center overflow-x-auto" />
    </div>
  );
};
