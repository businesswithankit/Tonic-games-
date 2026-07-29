import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Gamepad2,
  FolderTree,
  HelpCircle,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Sparkles,
  ArrowLeft,
  Save,
  ExternalLink,
  Smartphone,
  Monitor,
  Inbox,
  HardDrive,
  CheckCircle2,
  Play,
  Mail,
  User,
  Link as LinkIcon,
  MessageSquare,
  Eye,
  Calendar,
  Clock,
  Share2,
  Globe,
  Megaphone,
  Code2,
  MousePointerClick,
  Layers,
  FileText,
} from 'lucide-react';
import { AdPosition, Category, ContactSubmission, Game, GameSubmission, NetworkAd, SiteSettings, SocialLink, SponsorAd, UpcomingGame } from '../../types';
import {
  deleteCategoryFromStore,
  deleteContactFromStore,
  deleteGameFromStore,
  deleteNetworkAdFromStore,
  deleteSponsorAdFromStore,
  deleteSubmissionFromStore,
  deleteUpcomingGameFromStore,
  saveCategoryToStore,
  saveGameToStore,
  saveNetworkAdToStore,
  saveSettingsToStore,
  saveSponsorAdToStore,
  saveSubmissionToStore,
  saveUpcomingGameToStore,
} from '../../firebase';
import { SocialIcon } from '../SocialIcons';

export const AD_POSITION_LABELS: Record<AdPosition, string> = {
  homepage_top: 'Homepage Top',
  below_hero: 'Below Hero Banner',
  between_trending: 'Between Trending Games',
  between_featured: 'Between Featured Games',
  between_recently_added: 'Between Recently Added Games',
  game_details_top: 'Game Details Top',
  game_details_bottom: 'Game Details Bottom',
  sidebar: 'Sidebar',
  footer: 'Footer',
  sticky_mobile: 'Sticky Bottom (Mobile)',
};

interface AdminDashboardProps {
  games: Game[];
  upcomingGames?: UpcomingGame[];
  sponsorAds?: SponsorAd[];
  networkAds?: NetworkAd[];
  categories: Category[];
  submissions: GameSubmission[];
  contacts?: ContactSubmission[];
  faqs?: any[];
  settings: SiteSettings;
  onRefreshData: () => void;
  onLogout: () => void;
  onBackToSite: () => void;
}

type AdminTab =
  | 'overview'
  | 'games'
  | 'upcoming'
  | 'sponsor_ads'
  | 'network_ads'
  | 'submissions'
  | 'messages'
  | 'categories'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  games,
  upcomingGames = [],
  sponsorAds = [],
  networkAds = [],
  categories,
  submissions,
  contacts = [],
  settings,
  onRefreshData,
  onLogout,
  onBackToSite,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // --- SPONSOR ADS STATE ---
  const [sponsorList, setSponsorList] = useState<SponsorAd[]>(sponsorAds);
  const [sponsorSearch, setSponsorSearch] = useState('');
  const [editingSponsorAd, setEditingSponsorAd] = useState<Partial<SponsorAd> | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  useEffect(() => {
    if (sponsorAds) setSponsorList(sponsorAds);
  }, [sponsorAds]);

  // --- NETWORK ADS (ADS MANAGER) STATE ---
  const [networkList, setNetworkList] = useState<NetworkAd[]>(networkAds);
  const [networkSearch, setNetworkSearch] = useState('');
  const [editingNetworkAd, setEditingNetworkAd] = useState<Partial<NetworkAd> | null>(null);
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

  useEffect(() => {
    if (networkAds) setNetworkList(networkAds);
  }, [networkAds]);

  // --- UPCOMING GAMES STATE ---
  const [upcomingList, setUpcomingList] = useState<UpcomingGame[]>(upcomingGames);
  const [upcomingSearch, setUpcomingSearch] = useState('');
  const [editingUpcoming, setEditingUpcoming] = useState<Partial<UpcomingGame> | null>(null);
  const [isUpcomingModalOpen, setIsUpcomingModalOpen] = useState(false);

  useEffect(() => {
    if (upcomingGames) {
      setUpcomingList(upcomingGames);
    }
  }, [upcomingGames]);

  // --- CONTACT MESSAGES STATE ---
  const [messageSearch, setMessageSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

  // --- GAMES CRUD STATE ---
  const [gameSearch, setGameSearch] = useState('');
  const [gameCategoryFilter, setGameCategoryFilter] = useState('all');
  const [editingGame, setEditingGame] = useState<Partial<Game> | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // --- CATEGORY CRUD STATE ---
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // --- SETTINGS FORM STATE ---
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>({ ...settings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  useEffect(() => {
    if (settings) {
      setSiteSettingsForm({ ...settings });
    }
  }, [settings]);

  // --- GAME MODAL SUBMIT ---
  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame?.title || !editingGame?.playUrl) return;

    const parsedFeatures =
      typeof editingGame.features === 'string'
        ? (editingGame.features as string).split(',').map((f) => f.trim()).filter(Boolean)
        : Array.isArray(editingGame.features)
        ? editingGame.features
        : ['HTML5 WebGL', 'Responsive Play'];

    await saveGameToStore(
      {
        title: editingGame.title || 'Untitled Game',
        thumbnail:
          editingGame.thumbnail ||
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
        version: editingGame.version || '1.0.0',
        weight: editingGame.weight || '10 MB',
        features: parsedFeatures,
        description: editingGame.description || '',
        longDescription: editingGame.longDescription || editingGame.description || '',
        developer: editingGame.developer || 'Indie Game Studio',
        releaseDate: editingGame.releaseDate || new Date().toISOString().split('T')[0],
        category: editingGame.category || categories[0]?.slug || 'action',
        featured: !!editingGame.featured,
        trending: !!editingGame.trending,
        recentlyAdded: !!editingGame.recentlyAdded,
        orientation: editingGame.orientation || 'landscape',
        playUrl: editingGame.playUrl,
        status: editingGame.status || 'active',
        createdTime: editingGame.createdTime || new Date().toISOString(),
        updatedTime: new Date().toISOString(),
      },
      editingGame.id
    );

    setIsGameModalOpen(false);
    setEditingGame(null);
    onRefreshData();
  };

  const handleDeleteGame = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      await deleteGameFromStore(id);
      onRefreshData();
    }
  };

  // --- SUBMISSIONS HANDLERS ---
  const handleApproveSubmission = async (sub: GameSubmission) => {
    if (window.confirm(`Approve and publish "${sub.gameTitle}" to the main games portal?`)) {
      // 1. Add game to games collection
      await saveGameToStore({
        title: sub.gameTitle,
        thumbnail: sub.thumbnailUrl,
        version: sub.version || '1.0.0',
        weight: sub.weight || '10 MB',
        features: sub.features || ['HTML5 WebGL', 'Responsive Play'],
        description: sub.description,
        longDescription: sub.longDescription || sub.description,
        developer: sub.developerName,
        releaseDate: new Date().toISOString().split('T')[0],
        category: sub.category,
        featured: false,
        trending: true,
        recentlyAdded: true,
        orientation: sub.orientation || 'landscape',
        playUrl: sub.playUrl,
        status: 'active',
        aiPromptUsed: sub.aiPromptUsed,
        platforms: sub.platforms,
        tags: sub.tags,
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString(),
      });

      // 2. Mark submission as approved
      await saveSubmissionToStore(
        {
          ...sub,
          status: 'approved',
        },
        sub.id
      );

      onRefreshData();
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      await deleteSubmissionFromStore(id);
      onRefreshData();
    }
  };

  // --- CATEGORY MODAL SUBMIT ---
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name || !editingCat?.slug) return;

    await saveCategoryToStore(
      {
        name: editingCat.name,
        slug: editingCat.slug,
        icon: editingCat.icon || 'Gamepad2',
        image:
          editingCat.image ||
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
        description: editingCat.description || '',
        order: editingCat.order || categories.length + 1,
        hidden: !!editingCat.hidden,
      },
      editingCat.id
    );

    setIsCatModalOpen(false);
    setEditingCat(null);
    onRefreshData();
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Delete this category?')) {
      await deleteCategoryFromStore(id);
      onRefreshData();
    }
  };

  // --- CONTACT MESSAGE DELETE HANDLER ---
  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      await deleteContactFromStore(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      onRefreshData();
    }
  };

  // --- SPONSOR ADS HANDLERS ---
  const handleSaveSponsorAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsorAd?.campaignName || !editingSponsorAd?.bannerImage) return;

    await saveSponsorAdToStore(
      {
        campaignName: editingSponsorAd.campaignName,
        sponsorName: editingSponsorAd.sponsorName || 'Sponsor',
        bannerImage: editingSponsorAd.bannerImage,
        redirectLink: editingSponsorAd.redirectLink || 'https://',
        position: (editingSponsorAd.position as AdPosition) || 'homepage_top',
        status: editingSponsorAd.status || 'active',
        clickCount: editingSponsorAd.clickCount || 0,
        createdAt: editingSponsorAd.createdAt || new Date().toISOString(),
      },
      editingSponsorAd.id
    );

    setIsSponsorModalOpen(false);
    setEditingSponsorAd(null);
    onRefreshData();
  };

  const handleDeleteSponsorAd = async (id: string) => {
    if (window.confirm('Delete this sponsor campaign?')) {
      await deleteSponsorAdFromStore(id);
      onRefreshData();
    }
  };

  // --- NETWORK ADS (ADS MANAGER) HANDLERS ---
  const handleSaveNetworkAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNetworkAd?.adName || !editingNetworkAd?.adCode) return;

    await saveNetworkAdToStore(
      {
        adName: editingNetworkAd.adName,
        position: (editingNetworkAd.position as AdPosition) || 'homepage_top',
        adCode: editingNetworkAd.adCode,
        status: editingNetworkAd.status || 'active',
        createdAt: editingNetworkAd.createdAt || new Date().toISOString(),
      },
      editingNetworkAd.id
    );

    setIsNetworkModalOpen(false);
    setEditingNetworkAd(null);
    onRefreshData();
  };

  const handleDeleteNetworkAd = async (id: string) => {
    if (window.confirm('Delete this network ad code?')) {
      await deleteNetworkAdFromStore(id);
      onRefreshData();
    }
  };

  // --- UPCOMING GAMES HANDLERS ---
  const handleSaveUpcomingGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpcoming?.title) return;

    const parsedFeatures =
      typeof editingUpcoming.features === 'string'
        ? (editingUpcoming.features as string).split(',').map((f) => f.trim()).filter(Boolean)
        : Array.isArray(editingUpcoming.features)
        ? editingUpcoming.features
        : [];

    await saveUpcomingGameToStore(
      {
        title: editingUpcoming.title || 'Untitled Upcoming Game',
        weight: editingUpcoming.weight || '15 MB',
        description: editingUpcoming.description || '',
        features: parsedFeatures,
        thumbnail:
          editingUpcoming.thumbnail ||
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        link: editingUpcoming.link || '',
        expectedReleaseDate: editingUpcoming.expectedReleaseDate || 'Q4 2026',
        status: editingUpcoming.status || 'active',
        createdAt: editingUpcoming.createdAt || new Date().toISOString(),
      },
      editingUpcoming.id
    );

    setIsUpcomingModalOpen(false);
    setEditingUpcoming(null);
    onRefreshData();
  };

  const handleDeleteUpcomingGame = async (id: string) => {
    if (window.confirm('Delete this upcoming game record?')) {
      await deleteUpcomingGameFromStore(id);
      onRefreshData();
    }
  };

  // --- DYNAMIC SOCIAL MEDIA LINKS HANDLERS ---
  const handleAddSocialLink = () => {
    const current = siteSettingsForm.socialLinks || [];
    const newLink: SocialLink = {
      id: 'soc-' + Date.now(),
      platform: 'youtube',
      title: 'YouTube Channel',
      url: 'https://youtube.com',
    };
    setSiteSettingsForm({
      ...siteSettingsForm,
      socialLinks: [...current, newLink],
    });
  };

  const handleUpdateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const current = [...(siteSettingsForm.socialLinks || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: value };
      setSiteSettingsForm({ ...siteSettingsForm, socialLinks: current });
    }
  };

  const handleRemoveSocialLink = (index: number) => {
    const current = [...(siteSettingsForm.socialLinks || [])];
    current.splice(index, 1);
    setSiteSettingsForm({ ...siteSettingsForm, socialLinks: current });
  };

  // --- SAVE SITE SETTINGS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSettingsToStore(siteSettingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
    onRefreshData();
  };

  // Filtered games for management list
  const filteredGames = games.filter((g) => {
    const matchesSearch =
      !gameSearch.trim() ||
      g.title.toLowerCase().includes(gameSearch.toLowerCase()) ||
      g.developer.toLowerCase().includes(gameSearch.toLowerCase());
    const matchesCat =
      gameCategoryFilter === 'all' || g.category.toLowerCase() === gameCategoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Calculate Analytics Stats
  const totalGames = games.length;
  const totalCategories = categories.length;
  const featuredCount = games.filter((g) => g.featured).length;
  const trendingCount = games.filter((g) => g.trending).length;
  const totalGameViews = games.reduce((acc, g) => acc + (g.views || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-8">
      {/* Admin Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0c0e18] border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>ADMINISTRATOR CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {settings.websiteName || 'GAMES TONIC'} Admin Panel
          </h1>
          <p className="text-xs text-slate-400">
            Real-time management for games, categories, FAQs, and site settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Website</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
          { id: 'games', label: `Games (${games.length})`, icon: Gamepad2 },
          { id: 'upcoming', label: `Upcoming (${upcomingList.length})`, icon: Clock },
          { id: 'sponsor_ads', label: `Sponsor Ads (${sponsorList.length})`, icon: Megaphone },
          { id: 'network_ads', label: `Ads Manager (${networkList.length})`, icon: Code2 },
          { id: 'submissions', label: `Submissions (${submissions.length})`, icon: Inbox },
          { id: 'messages', label: `Messages (${contacts.length})`, icon: Mail },
          { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
          { id: 'settings', label: 'Site Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-card p-4 rounded-2xl border-purple-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Games
              </span>
              <p className="text-2xl font-black text-white mt-1">{totalGames}</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border-cyan-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Game Submissions
              </span>
              <p className="text-2xl font-black text-cyan-400 mt-1">
                {submissions.length}
              </p>
            </div>

            <div
              onClick={() => setActiveTab('messages')}
              className="glass-card p-4 rounded-2xl border-fuchsia-500/30 hover:border-fuchsia-400 cursor-pointer transition-all bg-fuchsia-500/5 hover:bg-fuchsia-500/10"
            >
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Contact Messages
              </span>
              <p className="text-2xl font-black text-fuchsia-300 mt-1">
                {contacts.length}
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border-amber-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Trending Titles
              </span>
              <p className="text-2xl font-black text-amber-400 mt-1">{trendingCount}</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border-pink-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Featured Titles
              </span>
              <p className="text-2xl font-black text-pink-400 mt-1">{featuredCount}</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border-purple-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Categories
              </span>
              <p className="text-2xl font-black text-purple-300 mt-1">{totalCategories}</p>
            </div>
          </div>

          {/* Recent Games table */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <span>Recently Added Games</span>
              </h3>

              <div className="space-y-3">
                {games.slice(0, 5).map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-10 h-10 object-cover rounded-lg border border-white/10"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">{game.title}</h4>
                        <span className="text-[10px] text-cyan-400 uppercase font-semibold">
                          {game.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {(game.views || 0).toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GAMES CRUD */}
      {activeTab === 'games' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={gameSearch}
                  onChange={(e) => setGameSearch(e.target.value)}
                  placeholder="Search games..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <select
                value={gameCategoryFilter}
                onChange={(e) => setGameCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-cyan-300 font-bold focus:outline-none"
              >
                <option value="all" className="bg-[#0b0d16] text-white">
                  All Categories
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug} className="bg-[#0b0d16] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingGame({
                  title: '',
                  thumbnail: '',
                  version: '1.0.0',
                  description: '',
                  developer: '',
                  releaseDate: new Date().toISOString().split('T')[0],
                  category: categories[0]?.slug || 'action',
                  featured: false,
                  trending: false,
                  recentlyAdded: true,
                  orientation: 'landscape',
                  playUrl: '',
                  status: 'active',
                  views: 0,
                });
                setIsGameModalOpen(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Game</span>
            </button>
          </div>

          {/* Games Table */}
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 text-[11px] font-black uppercase text-slate-400 border-b border-white/10">
                    <th className="p-4">Thumbnail & Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Orientation</th>
                    <th className="p-4">Flags</th>
                    <th className="p-4">Weight</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredGames.map((game) => (
                    <tr key={game.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-12 h-12 object-cover rounded-xl border border-white/10 shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{game.title}</h4>
                          <span className="text-[11px] text-slate-400">{game.developer}</span>
                        </div>
                      </td>
                      <td className="p-4 uppercase font-semibold text-cyan-400">{game.category}</td>
                      <td className="p-4 capitalize">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          {game.orientation === 'portrait' ? (
                            <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          {game.orientation}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {game.trending && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                              HOT
                            </span>
                          )}
                          {game.featured && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                              FEAT
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-300">
                        {game.weight || '10 MB'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            game.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {game.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingGame({ ...game });
                              setIsGameModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300"
                            title="Edit Game"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                            title="Delete Game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: UPCOMING GAMES MANAGEMENT */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <span>Upcoming Games Area</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage upcoming title announcements, expected release dates, weights, descriptions, features, and website links.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingUpcoming({
                  title: '',
                  weight: '20 MB',
                  description: '',
                  features: [],
                  thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                  link: '',
                  expectedReleaseDate: 'Q4 2026',
                  status: 'active',
                });
                setIsUpcomingModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Upcoming Game</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search upcoming titles..."
              value={upcomingSearch}
              onChange={(e) => setUpcomingSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* List of Upcoming Games */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingList
              .filter((g) => !upcomingSearch || g.title.toLowerCase().includes(upcomingSearch.toLowerCase()))
              .map((uGame) => (
                <div
                  key={uGame.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 flex flex-col justify-between space-y-3 relative group"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={uGame.thumbnail}
                      alt={uGame.title}
                      className="w-24 h-20 object-cover rounded-xl border border-white/10 shrink-0"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-white text-sm truncate">{uGame.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            uGame.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {uGame.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                        <span className="text-pink-400 font-bold">{uGame.expectedReleaseDate || 'TBA'}</span>
                        <span>•</span>
                        <span className="text-cyan-300">{uGame.weight}</span>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2">{uGame.description}</p>
                    </div>
                  </div>

                  {uGame.features && uGame.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {uGame.features.map((feat, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    {uGame.link ? (
                      <a
                        href={uGame.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-pink-400 hover:underline flex items-center gap-1"
                      >
                        <span>Trailer / Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">No trailer link</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingUpcoming({ ...uGame });
                          setIsUpcomingModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all"
                        title="Edit Upcoming Game"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteUpcomingGame(uGame.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all"
                        title="Delete Upcoming Game"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: SPONSOR ADS */}
      {activeTab === 'sponsor_ads' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>Sponsor Banner Ads</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Create and manage direct sponsor banners. When active, banners display automatically in selected positions and track total clicks.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingSponsorAd({
                  campaignName: '',
                  sponsorName: '',
                  bannerImage: '',
                  redirectLink: 'https://',
                  position: 'homepage_top',
                  status: 'active',
                  clickCount: 0,
                });
                setIsSponsorModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-90 text-slate-950 font-black text-xs uppercase transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sponsor Campaign</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search sponsor campaigns or companies..."
              value={sponsorSearch}
              onChange={(e) => setSponsorSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* List of Sponsor Campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsorList
              .filter(
                (s) =>
                  !sponsorSearch ||
                  s.campaignName.toLowerCase().includes(sponsorSearch.toLowerCase()) ||
                  s.sponsorName.toLowerCase().includes(sponsorSearch.toLowerCase())
              )
              .map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/20 flex flex-col justify-between space-y-4 relative group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[4/1] w-full overflow-hidden rounded-xl border border-white/10 bg-black">
                      <img
                        src={sponsor.bannerImage}
                        alt={sponsor.campaignName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md ${
                            sponsor.status === 'active'
                              ? 'bg-emerald-500 text-black'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {sponsor.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-white text-sm truncate">{sponsor.campaignName}</h3>
                      </div>
                      <p className="text-xs text-amber-300 font-medium">Sponsor: {sponsor.sponsorName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Ad Position</span>
                        <span className="font-bold text-cyan-300 text-xs block truncate">
                          {AD_POSITION_LABELS[sponsor.position] || sponsor.position}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-amber-400/80 block flex items-center gap-1">
                          <MousePointerClick className="w-3 h-3" />
                          Total Clicks
                        </span>
                        <span className="font-black text-amber-300 text-sm block">
                          {sponsor.clickCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <a
                      href={sponsor.redirectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 truncate max-w-[200px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                      <span className="truncate">{sponsor.redirectLink}</span>
                    </a>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSponsorAd({ ...sponsor });
                          setIsSponsorModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                        title="Edit Sponsor Campaign"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteSponsorAd(sponsor.id)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                        title="Delete Sponsor Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB: ADS MANAGER (AdSense & Ad Networks) */}
      {activeTab === 'network_ads' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Ads Manager (Google AdSense & Ad Networks)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Paste raw HTML / JavaScript ad unit tags from Google AdSense or other ad networks. When active, scripts execute automatically in selected positions.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingNetworkAd({
                  adName: '',
                  position: 'homepage_top',
                  adCode: '',
                  status: 'active',
                });
                setIsNetworkModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-black text-xs uppercase transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Network Ad Code</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search ad unit names..."
              value={networkSearch}
              onChange={(e) => setNetworkSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* List of Network Ad Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkList
              .filter((n) => !networkSearch || n.adName.toLowerCase().includes(networkSearch.toLowerCase()))
              .map((netAd) => (
                <div
                  key={netAd.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/20 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <h3 className="font-bold text-white text-sm truncate">{netAd.adName}</h3>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md ${
                          netAd.status === 'active'
                            ? 'bg-emerald-500 text-black'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {netAd.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ad Position</span>
                      <span className="font-bold text-cyan-300 text-xs block">
                        {AD_POSITION_LABELS[netAd.position] || netAd.position}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Ad Code Snippet</span>
                      <pre className="p-3 rounded-xl bg-black border border-white/10 text-[11px] font-mono text-cyan-200 overflow-x-auto max-h-28 whitespace-pre-wrap break-all">
                        {netAd.adCode}
                      </pre>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingNetworkAd({ ...netAd });
                        setIsNetworkModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                      title="Edit Network Ad"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteNetworkAd(netAd.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Network Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: GAME SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-cyan-400" />
                <span>Developer Game Submissions</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Review user submitted HTML5 titles, test play links, approve to publish directly, or delete submissions.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono">
              Total Submissions: {submissions.length}
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center space-y-3">
              <Inbox className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Game Submissions Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Game submissions sent through the Developer Submit Games form will appear here for review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="glass-card p-5 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={sub.thumbnailUrl}
                        alt={sub.gameTitle}
                        className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">{sub.gameTitle}</h3>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                            {sub.category}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 text-[10px] font-bold uppercase font-mono">
                            {sub.weight || '10 MB'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sub.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-0.5">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-purple-400" />
                            <span>{sub.developerName}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{sub.contactEmail}</span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                      <a
                        href={sub.playUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Check Game Link in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Check Game</span>
                      </a>

                      {sub.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveSubmission(sub)}
                          className="px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                          title="Approve and Publish to Main Portal"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Publish</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        className="px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title="Delete Game Submission"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                    {sub.description}
                  </p>

                  {/* Platforms & Tags badges if present */}
                  {((sub.platforms && sub.platforms.length > 0) || (sub.tags && sub.tags.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      {sub.platforms?.map((p) => (
                        <span key={p} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                          {p}
                        </span>
                      ))}
                      {sub.tags?.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[10px] font-semibold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {sub.aiPromptUsed && (
                    <div className="text-[11px] bg-purple-950/20 p-2.5 rounded-xl border border-purple-500/20 space-y-1">
                      <span className="font-bold text-purple-300">AI Prompt / Link:</span>
                      <p className="text-slate-300 font-mono text-[10px] whitespace-pre-line max-h-20 overflow-y-auto">
                        {sub.aiPromptUsed.trim().startsWith('http://') || sub.aiPromptUsed.trim().startsWith('https://') ? (
                          <a
                            href={sub.aiPromptUsed.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline flex items-center gap-1 font-sans font-bold"
                          >
                            <span className="break-all">{sub.aiPromptUsed.trim()}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 inline" />
                          </a>
                        ) : (
                          sub.aiPromptUsed
                        )}
                      </p>
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-400 truncate bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    Play URL: <span className="text-cyan-400">{sub.playUrl}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-fuchsia-400" />
                <span>Contact Form Messages</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Read, manage, and respond to user inquiries submitted through the contact page.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-fuchsia-400"
                />
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-bold font-mono whitespace-nowrap">
                {contacts.length} Messages
              </div>
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl text-center space-y-3">
              <Mail className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Messages Received</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Messages submitted by users on the Contact page will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {contacts
                .filter((msg) => {
                  const s = messageSearch.toLowerCase().trim();
                  if (!s) return true;
                  return (
                    msg.name.toLowerCase().includes(s) ||
                    msg.email.toLowerCase().includes(s) ||
                    msg.subject.toLowerCase().includes(s) ||
                    msg.message.toLowerCase().includes(s)
                  );
                })
                .map((msg) => (
                  <div
                    key={msg.id}
                    className="glass-card p-5 rounded-2xl border border-white/10 hover:border-fuchsia-500/30 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 font-black flex items-center justify-center text-sm uppercase">
                          {msg.name.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white">{msg.name}</h3>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                            >
                              <span>({msg.email})</span>
                            </a>
                          </div>
                          <span className="text-[11px] font-medium text-fuchsia-300">
                            Subject: {msg.subject || 'General Inquiry'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-2">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <button
                          onClick={() => setSelectedMessage(msg)}
                          className="px-3 py-1.5 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 border border-fuchsia-500/40 text-fuchsia-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Read</span>
                        </button>

                        <button
                          onClick={() => handleDeleteContact(msg.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: CATEGORIES CRUD */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Categories Management</h2>
            <button
              onClick={() => {
                setEditingCat({
                  name: '',
                  slug: '',
                  icon: 'Gamepad2',
                  image: '',
                  description: '',
                  order: categories.length + 1,
                  hidden: false,
                });
                setIsCatModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="glass-card p-5 rounded-2xl space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400">slug: {cat.slug}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCat({ ...cat });
                        setIsCatModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-300"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                <p className="text-xs text-slate-400">{cat.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SETTINGS PANEL */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Website & Branding Settings</h2>
              <p className="text-xs text-slate-400">
                Configure brand name, logos, hero banner visuals, social handles, and rate links.
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

          {settingsSavedMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Site settings updated successfully across the entire website!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Website Name
              </label>
              <input
                type="text"
                value={siteSettingsForm.websiteName}
                onChange={(e) =>
                  setSiteSettingsForm({ ...siteSettingsForm, websiteName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Logo URL (Optional Image)
              </label>
              <input
                type="url"
                value={siteSettingsForm.logoUrl}
                onChange={(e) =>
                  setSiteSettingsForm({ ...siteSettingsForm, logoUrl: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase flex items-center gap-2">
                <span>Favicon Link / URL</span>
                {siteSettingsForm.faviconUrl && (
                  <img
                    src={siteSettingsForm.faviconUrl}
                    alt="Favicon preview"
                    className="w-4 h-4 object-contain inline-block rounded"
                  />
                )}
              </label>
              <input
                type="url"
                value={siteSettingsForm.faviconUrl || ''}
                onChange={(e) =>
                  setSiteSettingsForm({ ...siteSettingsForm, faviconUrl: e.target.value })
                }
                placeholder="https://example.com/favicon.png"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Direct URL to browser tab favicon (.ico, .png, or .svg).
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Hero Banner Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.heroTitle}
                  onChange={(e) =>
                    setSiteSettingsForm({ ...siteSettingsForm, heroTitle: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Hero Background Image URL
                </label>
                <input
                  type="url"
                  value={siteSettingsForm.heroBgImage}
                  onChange={(e) =>
                    setSiteSettingsForm({ ...siteSettingsForm, heroBgImage: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={siteSettingsForm.heroSubtitle}
                onChange={(e) =>
                  setSiteSettingsForm({ ...siteSettingsForm, heroSubtitle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              External Rating & Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Rate Button Text
                </label>
                <input
                  type="text"
                  value={siteSettingsForm.rateButtonText}
                  onChange={(e) =>
                    setSiteSettingsForm({ ...siteSettingsForm, rateButtonText: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                  Rate Button Link (External)
                </label>
                <input
                  type="url"
                  value={siteSettingsForm.rateButtonLink}
                  onChange={(e) =>
                    setSiteSettingsForm({ ...siteSettingsForm, rateButtonLink: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-wider">
              Games Submission Settings
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase">
                Games Submission Button Link
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={siteSettingsForm.submissionButtonLink || ''}
                  onChange={(e) =>
                    setSiteSettingsForm({
                      ...siteSettingsForm,
                      submissionButtonLink: e.target.value,
                    })
                  }
                  placeholder="https://forms.google.com/..."
                  className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-fuchsia-400"
                />
                <a
                  href={siteSettingsForm.submissionButtonLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Test Link</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                This URL is used by the "Games Submission" button across the website so developers can submit their HTML5 games directly.
              </p>
            </div>
          </div>

          {/* LEGAL & POLICY PAGES NAVIGATION & LIVE PREVIEW */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Legal & Policy Pages (Static Content)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                All legal and policy pages are compiled as high-speed static pages directly within the platform. Editing from Admin Panel has been disabled to ensure 100% legal compliance, zero Firebase reads, and instant rendering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>About Us</span>
                </div>
                <p className="text-[11px] text-slate-400">Platform mission & features</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Community Guidelines</span>
                </div>
                <p className="text-[11px] text-slate-400">Safety standards & fair play</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-fuchsia-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Submission Policy</span>
                </div>
                <p className="text-[11px] text-slate-400">Developer publishing terms</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Privacy Policy</span>
                </div>
                <p className="text-[11px] text-slate-400">GDPR, CCPA & Data rules</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Terms & Conditions</span>
                </div>
                <p className="text-[11px] text-slate-400">Portal usage & disclaimers</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
                  <span>DMCA & Copyright</span>
                </div>
                <p className="text-[11px] text-slate-400">17 U.S.C. § 512 policy</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  <span>Copyright Removal</span>
                </div>
                <p className="text-[11px] text-slate-400">Online takedown request form</p>
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left space-y-1 transition-all group cursor-pointer"
              >
                <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Contact Support</span>
                </div>
                <p className="text-[11px] text-slate-400">Inquiries & contact messages</p>
              </button>
            </div>
          </div>

          {/* DYNAMIC SOCIAL MEDIA LINKS SECTION */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span>Social Media Links & Real Icons</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add multiple social media channels (YouTube, Twitter/X, Discord, Telegram, Instagram, Facebook, TikTok, Twitch, Steam, Reddit, GitHub, Website). Real brand SVG icons render automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Media Link</span>
              </button>
            </div>

            <div className="space-y-3">
              {(!siteSettingsForm.socialLinks || siteSettingsForm.socialLinks.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-black/20 border border-white/5">
                  No custom social media links added yet. Click "Add Social Media Link" above to add your first platform icon!
                </p>
              ) : (
                siteSettingsForm.socialLinks.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="p-2.5 rounded-xl bg-white/10 text-pink-300 border border-white/10 shrink-0">
                        <SocialIcon platform={item.platform} className="w-5 h-5" />
                      </div>

                      <div className="w-full sm:w-40">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Platform</label>
                        <select
                          value={item.platform}
                          onChange={(e) => handleUpdateSocialLink(idx, 'platform', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-white font-bold"
                        >
                          <option value="youtube">YouTube</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="discord">Discord</option>
                          <option value="telegram">Telegram</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="twitch">Twitch</option>
                          <option value="tiktok">TikTok</option>
                          <option value="steam">Steam</option>
                          <option value="reddit">Reddit</option>
                          <option value="github">GitHub</option>
                          <option value="website">Website / General</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:flex-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Display Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Join Discord"
                          value={item.title || ''}
                          onChange={(e) => handleUpdateSocialLink(idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full URL</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={item.url || ''}
                          onChange={(e) => handleUpdateSocialLink(idx, 'url', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-white/15 text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocialLink(idx)}
                      className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 self-end md:self-center transition-all cursor-pointer"
                      title="Remove Social Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      )}

      {/* EDIT GAME MODAL */}
      {isGameModalOpen && editingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0e101a] border border-white/15 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingGame.id ? 'Edit Game Title' : 'Add New Game'}
              </h3>
              <button
                onClick={() => setIsGameModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingGame.title || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Developer
                  </label>
                  <input
                    type="text"
                    value={editingGame.developer || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, developer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Play URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={editingGame.playUrl || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, playUrl: e.target.value })}
                    placeholder="https://play.gamepix.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Thumbnail Image URL
                  </label>
                  <input
                    type="url"
                    value={editingGame.thumbnail || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, thumbnail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Category *
                  </label>
                  <select
                    value={editingGame.category || categories[0]?.slug}
                    onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug} className="bg-[#0b0d16] text-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Orientation
                  </label>
                  <select
                    value={editingGame.orientation || 'landscape'}
                    onChange={(e) =>
                      setEditingGame({
                        ...editingGame,
                        orientation: e.target.value as 'portrait' | 'landscape',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  >
                    <option value="landscape" className="bg-[#0b0d16] text-white">
                      Landscape
                    </option>
                    <option value="portrait" className="bg-[#0b0d16] text-white">
                      Portrait
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Version
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1.2.0"
                    value={editingGame.version || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, version: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Weight (MB)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 15 MB"
                    value={editingGame.weight || ''}
                    onChange={(e) => setEditingGame({ ...editingGame, weight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 60 FPS, Touch Controls, High Score Leaderboards"
                  value={
                    Array.isArray(editingGame.features)
                      ? editingGame.features.join(', ')
                      : editingGame.features || ''
                  }
                  onChange={(e) => setEditingGame({ ...editingGame, features: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!editingGame.trending}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, trending: e.target.checked })
                    }
                    className="accent-purple-500"
                  />
                  <span>Trending (HOT)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!editingGame.featured}
                    onChange={(e) =>
                      setEditingGame({ ...editingGame, featured: e.target.checked })
                    }
                    className="accent-cyan-500"
                  />
                  <span>Featured</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingGame.description || ''}
                  onChange={(e) =>
                    setEditingGame({ ...editingGame, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Detailed Long Description & Instructions
                </label>
                <textarea
                  rows={4}
                  value={editingGame.longDescription || ''}
                  onChange={(e) =>
                    setEditingGame({ ...editingGame, longDescription: e.target.value })
                  }
                  placeholder="Explain gameplay mechanics, controls, power-ups, storyline, and features in detail..."
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-slate-950 font-black text-xs uppercase"
              >
                Save Game Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {isCatModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0e101a] border border-white/15 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingCat.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={editingCat.slug || ''}
                  onChange={(e) => setEditingCat({ ...editingCat, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONTACT MESSAGE VIEW MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl space-y-6 border border-fuchsia-500/30 relative bg-[#0e101a]">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 flex items-center justify-center font-black text-xl">
                {selectedMessage.name.charAt(0) || 'M'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedMessage.name}</h3>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 font-mono gap-1">
                <span>Subject: <strong className="text-white font-sans">{selectedMessage.subject || 'General Inquiry'}</strong></span>
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Your inquiry')}`}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase flex items-center gap-2 hover:bg-cyan-400"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Email</span>
              </a>

              <button
                onClick={() => handleDeleteContact(selectedMessage.id)}
                className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs uppercase flex items-center gap-2 hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/ADD UPCOMING GAME MODAL */}
      {isUpcomingModalOpen && editingUpcoming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0e101a] border border-white/15 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <span>{editingUpcoming.id ? 'Edit Upcoming Game' : 'Add Upcoming Game'}</span>
              </h3>
              <button
                onClick={() => setIsUpcomingModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpcomingGame} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Game Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyberpunk Nitro 2"
                    value={editingUpcoming.title || ''}
                    onChange={(e) => setEditingUpcoming({ ...editingUpcoming, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Weight / Size (MB)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25.5 MB"
                    value={editingUpcoming.weight || ''}
                    onChange={(e) => setEditingUpcoming({ ...editingUpcoming, weight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Expected Release Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Q4 2026 or Dec 2026"
                    value={editingUpcoming.expectedReleaseDate || ''}
                    onChange={(e) => setEditingUpcoming({ ...editingUpcoming, expectedReleaseDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Website Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={editingUpcoming.link || ''}
                    onChange={(e) => setEditingUpcoming({ ...editingUpcoming, link: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editingUpcoming.thumbnail || ''}
                  onChange={(e) => setEditingUpcoming({ ...editingUpcoming, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Game Features (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next-Gen Shaders, Co-op Multiplayer, Custom Soundtrack"
                  value={
                    Array.isArray(editingUpcoming.features)
                      ? editingUpcoming.features.join(', ')
                      : editingUpcoming.features || ''
                  }
                  onChange={(e) => setEditingUpcoming({ ...editingUpcoming, features: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter a brief overview of upcoming gameplay mechanics..."
                  value={editingUpcoming.description || ''}
                  onChange={(e) => setEditingUpcoming({ ...editingUpcoming, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingUpcoming.status === 'active'}
                    onChange={(e) =>
                      setEditingUpcoming({
                        ...editingUpcoming,
                        status: e.target.checked ? 'active' : 'hidden',
                      })
                    }
                    className="accent-pink-500"
                  />
                  <span>Active (Visible on Homepage)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs uppercase shadow-lg shadow-pink-500/20 cursor-pointer"
              >
                Save Upcoming Game
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD SPONSOR AD MODAL */}
      {isSponsorModalOpen && editingSponsorAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0e101a] border border-amber-500/30 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-400" />
                <span>{editingSponsorAd.id ? 'Edit Sponsor Campaign' : 'New Sponsor Campaign'}</span>
              </h3>
              <button
                onClick={() => setIsSponsorModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSponsorAd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Summer Esports Championship"
                    value={editingSponsorAd.campaignName || ''}
                    onChange={(e) => setEditingSponsorAd({ ...editingSponsorAd, campaignName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Sponsor / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monster Energy or Razer"
                    value={editingSponsorAd.sponsorName || ''}
                    onChange={(e) => setEditingSponsorAd({ ...editingSponsorAd, sponsorName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or hosted banner image URL"
                  value={editingSponsorAd.bannerImage || ''}
                  onChange={(e) => setEditingSponsorAd({ ...editingSponsorAd, bannerImage: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Redirect Link (Destination URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://sponsorwebsite.com/product"
                  value={editingSponsorAd.redirectLink || ''}
                  onChange={(e) => setEditingSponsorAd({ ...editingSponsorAd, redirectLink: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Ad Position (Dropdown) *
                  </label>
                  <select
                    value={editingSponsorAd.position || 'homepage_top'}
                    onChange={(e) =>
                      setEditingSponsorAd({ ...editingSponsorAd, position: e.target.value as AdPosition })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-amber-300 font-bold"
                  >
                    {Object.entries(AD_POSITION_LABELS).map(([posKey, label]) => (
                      <option key={posKey} value={posKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Status *
                  </label>
                  <select
                    value={editingSponsorAd.status || 'active'}
                    onChange={(e) =>
                      setEditingSponsorAd({
                        ...editingSponsorAd,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white font-bold"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs uppercase shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Save Sponsor Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT/ADD NETWORK AD MODAL */}
      {isNetworkModalOpen && editingNetworkAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0e101a] border border-cyan-500/30 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>{editingNetworkAd.id ? 'Edit Network Ad Code' : 'New Network Ad Code'}</span>
              </h3>
              <button
                onClick={() => setIsNetworkModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNetworkAd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Ad Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AdSense Responsive Top Banner"
                  value={editingNetworkAd.adName || ''}
                  onChange={(e) => setEditingNetworkAd({ ...editingNetworkAd, adName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Ad Position (Dropdown) *
                  </label>
                  <select
                    value={editingNetworkAd.position || 'homepage_top'}
                    onChange={(e) =>
                      setEditingNetworkAd({ ...editingNetworkAd, position: e.target.value as AdPosition })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-cyan-300 font-bold"
                  >
                    {Object.entries(AD_POSITION_LABELS).map(([posKey, label]) => (
                      <option key={posKey} value={posKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                    Status *
                  </label>
                  <select
                    value={editingNetworkAd.status || 'active'}
                    onChange={(e) =>
                      setEditingNetworkAd({
                        ...editingNetworkAd,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/15 text-xs text-white font-bold"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase">
                  Ad Code (HTML / JavaScript) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="<script async src='https://pagead2.googlesyndication.com/...'>...</script>"
                  value={editingNetworkAd.adCode || ''}
                  onChange={(e) => setEditingNetworkAd({ ...editingNetworkAd, adCode: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-black border border-white/15 text-xs font-mono text-cyan-200 focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Save Network Ad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
