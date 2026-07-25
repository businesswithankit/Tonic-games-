import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  increment,
  getDocFromServer,
} from 'firebase/firestore';
import {
  INITIAL_CATEGORIES,
  INITIAL_CONTACTS,
  INITIAL_FAQS,
  INITIAL_GAMES,
  INITIAL_SETTINGS,
  INITIAL_SPONSORS,
  INITIAL_SPONSOR_ADS,
  INITIAL_NETWORK_ADS,
  INITIAL_SUBMISSIONS,
  INITIAL_UPCOMING_GAMES,
} from './data/initialData';
import { Category, ContactSubmission, FAQItem, Game, GameSubmission, NetworkAd, SiteSettings, Sponsor, SponsorAd, UpcomingGame } from './types';

// Provided Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBlPIV-UPuH7quA2IB00hozc5XBnn2CcaQ",
  authDomain: "games-4b082.firebaseapp.com",
  databaseURL: "https://games-4b082-default-rtdb.firebaseio.com",
  projectId: "games-4b082",
  storageBucket: "games-4b082.firebasestorage.app",
  messagingSenderId: "629915949991",
  appId: "1:629915949991:web:eb8a5c266b21f9766fb482"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Error logging helper as mandated by skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errStr = error instanceof Error ? error.message : String(error);
  if (errStr.includes('unavailable') || errStr.includes('Could not reach Cloud Firestore') || errStr.includes('offline')) {
    console.warn(`[Firestore Offline Fallback] ${operationType} on ${path}: Backend currently unreachable. Operating with local persistent cache.`);
    return;
  }
  const errInfo = {
    error: errStr,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
}

// Timeout helper to fall back to local storage instantly if Firestore is unreachable
function fetchWithTimeout<T>(promise: Promise<T>, fallbackValue: T, timeoutMs: number = 3000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      resolve(fallbackValue);
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }).catch((err) => {
      clearTimeout(timer);
      return fallbackValue;
    }),
    timeoutPromise,
  ]);
}

// Persistent Local Storage Fallback Helpers
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed !== null && parsed !== undefined) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
  }
  return defaultValue;
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// In-Memory & LocalStorage Backup State for instant response and offline persistence
let localGames: Game[] = getStorage('gt_games', [...INITIAL_GAMES]);
let localCategories: Category[] = getStorage('gt_categories', [...INITIAL_CATEGORIES]);
let localSponsors: Sponsor[] = getStorage('gt_sponsors', [...INITIAL_SPONSORS]);
let localFAQs: FAQItem[] = getStorage('gt_faqs', [...INITIAL_FAQS]);
let localSubmissions: GameSubmission[] = getStorage('gt_submissions', [...INITIAL_SUBMISSIONS]);
let localContacts: ContactSubmission[] = getStorage('gt_contacts', [...INITIAL_CONTACTS]);
let localUpcomingGames: UpcomingGame[] = getStorage('gt_upcoming_games', [...INITIAL_UPCOMING_GAMES]);
let localSponsorAds: SponsorAd[] = getStorage('gt_sponsor_ads', [...INITIAL_SPONSOR_ADS]);
let localNetworkAds: NetworkAd[] = getStorage('gt_network_ads', [...INITIAL_NETWORK_ADS]);
let localSettings: SiteSettings = getStorage('gt_site_settings', { ...INITIAL_SETTINGS });

// Test connection
async function testFirestoreConnection() {
  try {
    await getDoc(doc(db, 'settings', 'site'));
  } catch (_error) {
    // Silent offline fallback
  }
}
testFirestoreConnection();

// --- GAMES FIRESTORE HELPERS ---
export async function fetchGamesFromStore(): Promise<Game[]> {
  try {
    const q = query(collection(db, 'games'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const items: Game[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Game);
      });
      localGames = items;
      setStorage('gt_games', localGames);
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'games');
  }
  return localGames;
}

export async function saveGameToStore(gameData: Omit<Game, 'id'>, id?: string): Promise<Game> {
  const now = new Date().toISOString();
  let resultGame: Game;
  if (id) {
    // Update
    resultGame = {
      ...gameData,
      id,
      updatedTime: now,
    };
    try {
      await setDoc(doc(db, 'games', id), resultGame, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `games/${id}`);
    }
    const idx = localGames.findIndex((g) => g.id === id);
    if (idx !== -1) localGames[idx] = resultGame;
    else localGames.unshift(resultGame);
  } else {
    // Create
    const newId = 'game-' + Date.now();
    resultGame = {
      ...gameData,
      id: newId,
      createdTime: now,
      updatedTime: now,
      views: gameData.views || 0,
    };
    try {
      await setDoc(doc(db, 'games', newId), resultGame);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'games');
    }
    localGames.unshift(resultGame);
  }
  setStorage('gt_games', localGames);
  return resultGame;
}

export async function deleteGameFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'games', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `games/${id}`);
  }
  localGames = localGames.filter((g) => g.id !== id);
  setStorage('gt_games', localGames);
  return true;
}

export async function incrementGameViews(_id: string): Promise<void> {
  // Views system removed per user directive
  return;
}

// --- CATEGORIES FIRESTORE HELPERS ---
export async function fetchCategoriesFromStore(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (!snapshot.empty) {
      const items: Category[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      items.sort((a, b) => a.order - b.order);
      localCategories = items;
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'categories');
  }
  return localCategories;
}

export async function saveCategoryToStore(catData: Omit<Category, 'id'>, id?: string): Promise<Category> {
  const catId = id || 'cat-' + Date.now();
  const cat: Category = { ...catData, id: catId };
  try {
    await setDoc(doc(db, 'categories', catId), cat, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `categories/${catId}`);
  }
  const idx = localCategories.findIndex((c) => c.id === catId);
  if (idx !== -1) localCategories[idx] = cat;
  else localCategories.push(cat);
  return cat;
}

export async function deleteCategoryFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `categories/${id}`);
  }
  localCategories = localCategories.filter((c) => c.id !== id);
  return true;
}

// --- SPONSORS FIRESTORE HELPERS ---
export async function fetchSponsorsFromStore(): Promise<Sponsor[]> {
  try {
    const snapshot = await getDocs(collection(db, 'sponsors'));
    if (!snapshot.empty) {
      const items: Sponsor[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Sponsor);
      });
      localSponsors = items;
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'sponsors');
  }
  return localSponsors;
}

export async function saveSponsorToStore(sponsorData: Omit<Sponsor, 'id'>, id?: string): Promise<Sponsor> {
  const sponId = id || 'spon-' + Date.now();
  const sponsor: Sponsor = { ...sponsorData, id: sponId };
  try {
    await setDoc(doc(db, 'sponsors', sponId), sponsor, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `sponsors/${sponId}`);
  }
  const idx = localSponsors.findIndex((s) => s.id === sponId);
  if (idx !== -1) localSponsors[idx] = sponsor;
  else localSponsors.push(sponsor);
  return sponsor;
}

export async function incrementSponsorClicks(id: string): Promise<void> {
  try {
    const ref = doc(db, 'sponsors', id);
    await updateDoc(ref, { clickCount: increment(1) });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `sponsors/${id}`);
  }
  const idx = localSponsors.findIndex((s) => s.id === id);
  if (idx !== -1) {
    localSponsors[idx].clickCount = (localSponsors[idx].clickCount || 0) + 1;
  }
}

export async function deleteSponsorFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'sponsors', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `sponsors/${id}`);
  }
  localSponsors = localSponsors.filter((s) => s.id !== id);
  return true;
}

// --- FAQ FIRESTORE HELPERS ---
export async function fetchFAQsFromStore(): Promise<FAQItem[]> {
  try {
    const snapshot = await getDocs(collection(db, 'faq'));
    if (!snapshot.empty) {
      const items: FAQItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as FAQItem);
      });
      items.sort((a, b) => a.order - b.order);
      localFAQs = items;
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'faq');
  }
  return localFAQs;
}

export async function saveFAQToStore(faqData: Omit<FAQItem, 'id'>, id?: string): Promise<FAQItem> {
  const faqId = id || 'faq-' + Date.now();
  const faq: FAQItem = { ...faqData, id: faqId };
  try {
    await setDoc(doc(db, 'faq', faqId), faq, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `faq/${faqId}`);
  }
  const idx = localFAQs.findIndex((f) => f.id === faqId);
  if (idx !== -1) localFAQs[idx] = faq;
  else localFAQs.push(faq);
  return faq;
}

export async function deleteFAQFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'faq', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `faq/${id}`);
  }
  localFAQs = localFAQs.filter((f) => f.id !== id);
  return true;
}

// --- SITE SETTINGS FIRESTORE HELPERS ---
export async function fetchSettingsFromStore(): Promise<SiteSettings> {
  const cached = getStorage<SiteSettings | null>('gt_site_settings', null);
  if (cached) {
    localSettings = { ...INITIAL_SETTINGS, ...cached };
    if (!cached.websiteName || cached.websiteName === 'GAMES TONIC') {
      localSettings.websiteName = 'TONIC GAMES';
    }
    if (!cached.footerText || cached.footerText === '© 2026 GAMES TONIC. All rights reserved.') {
      localSettings.footerText = '© 2026 TONIC GAMES. All rights reserved.';
    }
  }
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'site'));
    if (docSnap.exists()) {
      localSettings = { ...INITIAL_SETTINGS, ...localSettings, ...(docSnap.data() as SiteSettings) };
      if (localSettings.websiteName === 'GAMES TONIC') {
        localSettings.websiteName = 'TONIC GAMES';
      }
      setStorage('gt_site_settings', localSettings);
      return localSettings;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, 'settings/site');
  }
  return localSettings;
}

export async function saveSettingsToStore(newSettings: SiteSettings): Promise<SiteSettings> {
  localSettings = { ...newSettings };
  setStorage('gt_site_settings', localSettings);
  try {
    await setDoc(doc(db, 'settings', 'site'), newSettings, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'settings/site');
  }
  return localSettings;
}

// --- GAME SUBMISSIONS FIRESTORE HELPERS ---
export async function fetchSubmissionsFromStore(): Promise<GameSubmission[]> {
  try {
    const snapshot = await getDocs(collection(db, 'submissions'));
    if (!snapshot.empty) {
      const items: GameSubmission[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as GameSubmission);
      });
      localSubmissions = items;
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'submissions');
  }
  return localSubmissions;
}

export async function saveSubmissionToStore(
  subData: Omit<GameSubmission, 'id'>,
  id?: string
): Promise<GameSubmission> {
  const subId = id || 'sub-' + Date.now();
  const sub: GameSubmission = {
    ...subData,
    id: subId,
    createdAt: subData.createdAt || new Date().toISOString(),
    status: subData.status || 'pending',
  };
  try {
    await setDoc(doc(db, 'submissions', subId), sub, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `submissions/${subId}`);
  }
  const idx = localSubmissions.findIndex((s) => s.id === subId);
  if (idx !== -1) localSubmissions[idx] = sub;
  else localSubmissions.unshift(sub);
  return sub;
}

export async function deleteSubmissionFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'submissions', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `submissions/${id}`);
  }
  localSubmissions = localSubmissions.filter((s) => s.id !== id);
  return true;
}

// --- CONTACT SUBMISSIONS FIRESTORE HELPERS ---
export async function fetchContactsFromStore(): Promise<ContactSubmission[]> {
  try {
    const snapshot = await getDocs(collection(db, 'contacts'));
    if (!snapshot.empty) {
      const items: ContactSubmission[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as ContactSubmission);
      });
      // Sort newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      localContacts = items;
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'contacts');
  }
  return localContacts;
}

export async function saveContactToStore(
  contactData: Omit<ContactSubmission, 'id'>,
  id?: string
): Promise<ContactSubmission> {
  const contactId = id || 'contact-' + Date.now();
  const contact: ContactSubmission = {
    ...contactData,
    id: contactId,
    createdAt: contactData.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'contacts', contactId), contact, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `contacts/${contactId}`);
  }
  const idx = localContacts.findIndex((c) => c.id === contactId);
  if (idx !== -1) localContacts[idx] = contact;
  else localContacts.unshift(contact);
  return contact;
}

export async function deleteContactFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'contacts', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `contacts/${id}`);
  }
  localContacts = localContacts.filter((c) => c.id !== id);
  setStorage('gt_contacts', localContacts);
  return true;
}

// --- UPCOMING GAMES FIRESTORE HELPERS ---
export async function fetchUpcomingGamesFromStore(): Promise<UpcomingGame[]> {
  try {
    const snapshot = await getDocs(collection(db, 'upcomingGames'));
    if (!snapshot.empty) {
      const items: UpcomingGame[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as UpcomingGame);
      });
      localUpcomingGames = items;
      setStorage('gt_upcoming_games', localUpcomingGames);
      return items;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'upcomingGames');
  }
  return localUpcomingGames;
}

export async function saveUpcomingGameToStore(
  gameData: Omit<UpcomingGame, 'id'>,
  id?: string
): Promise<UpcomingGame> {
  const gameId = id || 'upcoming-' + Date.now();
  const upcomingGame: UpcomingGame = {
    ...gameData,
    id: gameId,
    createdAt: gameData.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'upcomingGames', gameId), upcomingGame, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `upcomingGames/${gameId}`);
  }
  const idx = localUpcomingGames.findIndex((u) => u.id === gameId);
  if (idx !== -1) localUpcomingGames[idx] = upcomingGame;
  else localUpcomingGames.unshift(upcomingGame);
  setStorage('gt_upcoming_games', localUpcomingGames);
  return upcomingGame;
}

export async function deleteUpcomingGameFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'upcomingGames', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `upcomingGames/${id}`);
  }
  localUpcomingGames = localUpcomingGames.filter((u) => u.id !== id);
  setStorage('gt_upcoming_games', localUpcomingGames);
  return true;
}

// --- SPONSOR ADS FIRESTORE HELPERS ---
export async function fetchSponsorAdsFromStore(): Promise<SponsorAd[]> {
  const fetchTask = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'sponsorAds'));
      if (!snapshot.empty) {
        const items: SponsorAd[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as SponsorAd);
        });
        localSponsorAds = items;
        setStorage('gt_sponsor_ads', localSponsorAds);
        return items;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'sponsorAds');
    }
    return localSponsorAds;
  };
  return fetchWithTimeout(fetchTask(), localSponsorAds, 2500);
}

export async function saveSponsorAdToStore(
  adData: Omit<SponsorAd, 'id'>,
  id?: string
): Promise<SponsorAd> {
  const adId = id || 'sp-' + Date.now();
  const sponsorAd: SponsorAd = {
    ...adData,
    id: adId,
    clickCount: adData.clickCount || 0,
    createdAt: adData.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'sponsorAds', adId), sponsorAd, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `sponsorAds/${adId}`);
  }
  const idx = localSponsorAds.findIndex((s) => s.id === adId);
  if (idx !== -1) localSponsorAds[idx] = sponsorAd;
  else localSponsorAds.unshift(sponsorAd);
  setStorage('gt_sponsor_ads', localSponsorAds);
  return sponsorAd;
}

export async function deleteSponsorAdFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'sponsorAds', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `sponsorAds/${id}`);
  }
  localSponsorAds = localSponsorAds.filter((s) => s.id !== id);
  setStorage('gt_sponsor_ads', localSponsorAds);
  return true;
}

export async function recordSponsorAdClick(id: string): Promise<void> {
  try {
    const adRef = doc(db, 'sponsorAds', id);
    await updateDoc(adRef, { clickCount: increment(1) });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `sponsorAds/${id}`);
  }
  const idx = localSponsorAds.findIndex((s) => s.id === id);
  if (idx !== -1) {
    localSponsorAds[idx].clickCount = (localSponsorAds[idx].clickCount || 0) + 1;
    setStorage('gt_sponsor_ads', localSponsorAds);
  }
}

// --- NETWORK ADS (ADS MANAGER) FIRESTORE HELPERS ---
export async function fetchNetworkAdsFromStore(): Promise<NetworkAd[]> {
  const fetchTask = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'networkAds'));
      if (!snapshot.empty) {
        const items: NetworkAd[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as NetworkAd);
        });
        localNetworkAds = items;
        setStorage('gt_network_ads', localNetworkAds);
        return items;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'networkAds');
    }
    return localNetworkAds;
  };
  return fetchWithTimeout(fetchTask(), localNetworkAds, 2500);
}

export async function saveNetworkAdToStore(
  adData: Omit<NetworkAd, 'id'>,
  id?: string
): Promise<NetworkAd> {
  const adId = id || 'net-' + Date.now();
  const networkAd: NetworkAd = {
    ...adData,
    id: adId,
    createdAt: adData.createdAt || new Date().toISOString(),
  };
  try {
    await setDoc(doc(db, 'networkAds', adId), networkAd, { merge: true });
  } catch (err) {
    handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `networkAds/${adId}`);
  }
  const idx = localNetworkAds.findIndex((n) => n.id === adId);
  if (idx !== -1) localNetworkAds[idx] = networkAd;
  else localNetworkAds.unshift(networkAd);
  setStorage('gt_network_ads', localNetworkAds);
  return networkAd;
}

export async function deleteNetworkAdFromStore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'networkAds', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `networkAds/${id}`);
  }
  localNetworkAds = localNetworkAds.filter((n) => n.id !== id);
  setStorage('gt_network_ads', localNetworkAds);
  return true;
}

// Admin Auth Helper Functions
export async function adminLogin(email: string, pass: string): Promise<User> {
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function adminSignUp(email: string, pass: string): Promise<User> {
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function adminLogout(): Promise<void> {
  await firebaseSignOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
