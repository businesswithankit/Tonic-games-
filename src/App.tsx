/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Category,
  ContactSubmission,
  Game,
  GameSubmission,
  NetworkAd,
  PageView,
  RecentPlayItem,
  SiteSettings,
  Sponsor,
  SponsorAd,
  UpcomingGame,
} from './types';
import {
  adminLogout,
  fetchCategoriesFromStore,
  fetchContactsFromStore,
  fetchGamesFromStore,
  fetchNetworkAdsFromStore,
  fetchSettingsFromStore,
  fetchSponsorAdsFromStore,
  fetchSponsorsFromStore,
  fetchSubmissionsFromStore,
  fetchUpcomingGamesFromStore,
  subscribeToAuth,
} from './firebase';
import { getRecentlyPlayed } from './utils/localStorage';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GameSection } from './components/GameSection';
import { CategoryGrid } from './components/CategoryGrid';
import { UpcomingGamesSection } from './components/UpcomingGamesSection';
import { GamePlayPage } from './components/pages/GamePlayPage';
import { SearchModal } from './components/SearchModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { AdSlot } from './components/AdSlot';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicy';
import { TermsPage } from './components/pages/TermsPage';
import { ContactPage } from './components/pages/ContactPage';
import { SubmissionPage } from './components/pages/SubmissionPage';
import { AboutUsPage } from './components/pages/AboutUsPage';
import { CommunityGuidelinesPage } from './components/pages/CommunityGuidelinesPage';
import { GameSubmissionPolicyPage } from './components/pages/GameSubmissionPolicyPage';
import { DMCAPage } from './components/pages/DMCAPage';
import { CopyrightRemovalPage } from './components/pages/CopyrightRemovalPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  Flame,
  Sparkles,
  Clock,
  Swords,
  X,
  Play,
  Gamepad2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // App Data State
  const [games, setGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [sponsorAds, setSponsorAds] = useState<SponsorAd[]>([]);
  const [networkAds, setNetworkAds] = useState<NetworkAd[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [submissions, setSubmissions] = useState<GameSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    websiteName: 'TONIC GAMES',
    logoUrl: '',
    faviconUrl: '',
    heroTitle: 'ENTER THE ULTIMATE GAMING REALM',
    heroSubtitle:
      'Play hundreds of free, instant web games directly in your browser with zero downloads and ultra-low latency.',
    heroBgImage:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    heroButtonText: 'EXPLORE TRENDING GAMES',
    heroButtonLink: '#trending',
    heroVisible: true,
    footerText: '© 2026 TONIC GAMES. All rights reserved.',
    socialTwitter: 'https://twitter.com',
    socialDiscord: 'https://discord.gg',
    socialYoutube: 'https://youtube.com',
    socialTelegram: 'https://t.me',
    rateButtonText: '⭐ Rate Tonic Games',
    rateButtonLink: 'https://trustpilot.com',
    submissionButtonLink: '/submission',
    contactButtonLink: '/contact',
  });

  // Interactive Overlays State
  const [activeGameToPlay, setActiveGameToPlay] = useState<Game | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [recentDrawerOpen, setRecentDrawerOpen] = useState<boolean>(false);
  const [recentlyPlayedList, setRecentlyPlayedList] = useState<RecentPlayItem[]>([]);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Initial Load Data
  const loadAllData = async () => {
    const [
      fetchedGames,
      fetchedUpcoming,
      fetchedSponsorAds,
      fetchedNetworkAds,
      fetchedCats,
      fetchedSponsors,
      fetchedSettings,
      fetchedSubs,
      fetchedContacts,
    ] = await Promise.all([
      fetchGamesFromStore(),
      fetchUpcomingGamesFromStore(),
      fetchSponsorAdsFromStore(),
      fetchNetworkAdsFromStore(),
      fetchCategoriesFromStore(),
      fetchSponsorsFromStore(),
      fetchSettingsFromStore(),
      fetchSubmissionsFromStore(),
      fetchContactsFromStore(),
    ]);

    setGames(fetchedGames);
    setUpcomingGames(fetchedUpcoming);
    setSponsorAds(fetchedSponsorAds);
    setNetworkAds(fetchedNetworkAds);
    setCategories(fetchedCats);
    setSponsors(fetchedSponsors);
    setSettings(fetchedSettings);
    setSubmissions(fetchedSubs);
    setContacts(fetchedContacts);
  };

  useEffect(() => {
    loadAllData();
    setRecentlyPlayedList(getRecentlyPlayed());

    // Check Firebase Auth state
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        setIsAdminLoggedIn(true);
      }
    });

    // Check URL for /admin or #admin
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        setActivePage('admin');
      }
    };

    checkAdminRoute();

    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Update favicon if set in settings
  useEffect(() => {
    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }
  }, [settings.faviconUrl]);

  // Handle Play Game Trigger
  const handlePlayGame = (game: Game) => {
    setActiveGameToPlay(game);
    setActivePage('game');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setRecentlyPlayedList(getRecentlyPlayed());
    }, 500);
  };

  // Filtered Games Lists
  const activeGames = games.filter((g) => g.status === 'active');
  const trendingGames = activeGames.filter((g) => g.trending);
  const featuredGames = activeGames.filter((g) => g.featured);
  const recentlyAddedGames = [...activeGames].sort(
    (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  );

  const categoryFilteredGames = selectedCategory
    ? activeGames.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Background Atmospheric Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-[45%] right-[20%] w-[35%] h-[35%] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <Navbar
        settings={settings}
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onSelectCategory={(catSlug) => setSelectedCategory(catSlug)}
        recentlyPlayedCount={recentlyPlayedList.length}
        onOpenRecentlyPlayed={() => setRecentDrawerOpen(true)}
      />

      {/* HOMEPAGE TOP AD SLOT */}
      {activePage === 'home' && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <AdSlot position="homepage_top" sponsorAds={sponsorAds} networkAds={networkAds} />
        </div>
      )}

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activePage === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Banner Section */}
            <HeroBanner
              settings={settings}
              onExploreClick={() => {
                const el = document.getElementById('trending-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* BELOW HERO BANNER AD SLOT */}
            <AdSlot position="below_hero" sponsorAds={sponsorAds} networkAds={networkAds} />

            {/* Category Filter Active Indicator */}
            {selectedCategory && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 to-cyan-900/40 border border-cyan-400 flex items-center justify-between gap-4 my-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <div className="flex items-center gap-3">
                  <Swords className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-bold text-white capitalize">
                      Category Filter: {selectedCategory}
                    </h3>
                    <p className="text-xs text-slate-300">
                      Showing all games matching category "{selectedCategory}"
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Show All Games
                </button>
              </div>
            )}

            {/* Filtered Category Games View OR Standard Section Layout */}
            {selectedCategory ? (
              <GameSection
                title={`Category: ${selectedCategory.toUpperCase()}`}
                badgeText="CATEGORY GAMES"
                badgeColor="cyan"
                games={categoryFilteredGames}
                onPlayGame={handlePlayGame}
                emptyMessage={`No games currently listed under category "${selectedCategory}".`}
              />
            ) : (
              <>
                {/* Continue Playing / Recently Played Quick Strip */}
                {recentlyPlayedList.length > 0 && (
                  <div className="my-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-pink-400" />
                        <h3 className="text-xl font-black text-white">Continue Playing</h3>
                      </div>
                      <button
                        onClick={() => setRecentDrawerOpen(true)}
                        className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>View All ({recentlyPlayedList.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3.5">
                      {recentlyPlayedList.slice(0, 6).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const found = games.find((g) => g.id === item.id);
                            if (found) handlePlayGame(found);
                            else
                              handlePlayGame({
                                id: item.id,
                                title: item.title,
                                thumbnail: item.thumbnail,
                                version: '1.0',
                                description: 'Recently played game session.',
                                developer: 'External',
                                releaseDate: '2026-01-01',
                                category: item.category,
                                featured: false,
                                trending: false,
                                recentlyAdded: false,
                                orientation: item.orientation,
                                playUrl: item.playUrl,
                                status: 'active',
                                views: 100,
                                createdTime: new Date().toISOString(),
                                updatedTime: new Date().toISOString(),
                              });
                          }}
                          className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#0c0d16] border border-white/10 p-1.5 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full aspect-[4/3] object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                          <p className="text-xs font-bold text-white truncate mt-1.5 group-hover:text-pink-300">
                            {item.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Games Section */}
                <GameSection
                  id="trending-section"
                  title="Trending Games"
                  subtitle="Top played HTML5 titles trending across global players this week."
                  icon={Flame}
                  badgeText="HOT TRENDING"
                  badgeColor="amber"
                  games={trendingGames}
                  onPlayGame={handlePlayGame}
                />

                {/* BETWEEN TRENDING AD SLOT */}
                <AdSlot position="between_trending" sponsorAds={sponsorAds} networkAds={networkAds} />

                {/* Featured Games Section */}
                <GameSection
                  id="featured-section"
                  title="Featured Titles"
                  subtitle="Handpicked high-performance games with stunning graphics and tight controls."
                  icon={Sparkles}
                  badgeText="EDITOR'S CHOICE"
                  badgeColor="cyan"
                  games={featuredGames}
                  onPlayGame={handlePlayGame}
                />

                {/* BETWEEN FEATURED AD SLOT */}
                <AdSlot position="between_featured" sponsorAds={sponsorAds} networkAds={networkAds} />

                {/* Game Categories Grid */}
                <CategoryGrid
                  categories={categories}
                  games={games}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(slug) => setSelectedCategory(slug)}
                />

                {/* Recently Added Games Section */}
                <GameSection
                  title="Recently Added Games"
                  subtitle="Fresh new HTML5 games added to the TONIC GAMES library."
                  icon={Clock}
                  badgeText="NEW ARRIVALS"
                  badgeColor="purple"
                  games={recentlyAddedGames}
                  onPlayGame={handlePlayGame}
                />

                {/* BETWEEN RECENTLY ADDED AD SLOT */}
                <AdSlot position="between_recently_added" sponsorAds={sponsorAds} networkAds={networkAds} />

                {/* Upcoming Games Section */}
                <UpcomingGamesSection upcomingGames={upcomingGames} />

                {/* FAQ Section */}
                <FAQSection />
              </>
            )}
          </div>
        )}

        {activePage === 'game' && activeGameToPlay && (
          <GamePlayPage
            game={activeGameToPlay}
            allGames={games}
            sponsorAds={sponsorAds}
            networkAds={networkAds}
            settings={settings}
            onBack={() => {
              setActivePage('home');
              setActiveGameToPlay(null);
            }}
            onSelectGame={(g) => handlePlayGame(g)}
            onNavigate={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Page Views: Privacy, Terms, Contact, Submission, About, Guidelines, Policy, DMCA, Removal, Admin */}
        {activePage === 'about' && (
          <AboutUsPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'community-guidelines' && (
          <CommunityGuidelinesPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'submission-policy' && (
          <GameSubmissionPolicyPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'dmca' && (
          <DMCAPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'copyright-removal' && (
          <CopyrightRemovalPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRefreshData={loadAllData}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyPage settings={settings} onBack={() => setActivePage('home')} />
        )}

        {activePage === 'terms' && (
          <TermsPage settings={settings} onBack={() => setActivePage('home')} />
        )}

        {activePage === 'contact' && (
          <ContactPage
            settings={settings}
            onBack={() => setActivePage('home')}
            onRefreshData={loadAllData}
          />
        )}

        {activePage === 'submission' && (
          <SubmissionPage
            settings={settings}
            categories={categories}
            onBack={() => setActivePage('home')}
            onNavigate={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRefreshData={loadAllData}
          />
        )}

        {activePage === 'admin' && (
          <div>
            {isAdminLoggedIn ? (
              <AdminDashboard
                games={games}
                upcomingGames={upcomingGames}
                sponsorAds={sponsorAds}
                networkAds={networkAds}
                categories={categories}
                submissions={submissions}
                contacts={contacts}
                settings={settings}
                onRefreshData={loadAllData}
                onLogout={async () => {
                  await adminLogout();
                  setIsAdminLoggedIn(false);
                }}
                onBackToSite={() => setActivePage('home')}
              />
            ) : (
              <AdminLogin
                settings={settings}
                onSuccess={() => setIsAdminLoggedIn(true)}
                onBack={() => setActivePage('home')}
              />
            )}
          </div>
        )}
      </main>

      {/* FOOTER AD SLOT */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <AdSlot position="footer" sponsorAds={sponsorAds} networkAds={networkAds} />
      </div>

      {/* Footer */}
      <Footer
        settings={settings}
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* STICKY BOTTOM MOBILE AD SLOT */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/20 p-2 shadow-2xl backdrop-blur-md">
        <AdSlot position="sticky_mobile" sponsorAds={sponsorAds} networkAds={networkAds} />
      </div>

      {/* Live Search Modal */}
      <SearchModal
        games={games}
        categories={categories}
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectGame={(game) => handlePlayGame(game)}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => setSelectedCategory(slug)}
      />

      {/* Recently Played Drawer */}
      {recentDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0c0e18] border-l border-white/10 p-6 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">Recently Played</h3>
              </div>
              <button
                onClick={() => setRecentDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {recentlyPlayedList.length > 0 ? (
                recentlyPlayedList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const found = games.find((g) => g.id === item.id);
                      if (found) handlePlayGame(found);
                      setRecentDrawerOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-pink-500/40 cursor-pointer transition-all"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-pink-400 font-semibold uppercase">
                        {item.category}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg bg-pink-500/20 text-pink-300">
                      <Play className="w-3.5 h-3.5 fill-pink-300" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">
                  No recently played games yet. Click any game to start playing!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
