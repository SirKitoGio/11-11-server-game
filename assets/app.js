// --- INITIALIZATION ---
let database;
let isMock = true;

// Hardcoded Firebase Configuration for the presentation
const firebaseConfig = {
  apiKey: "AIzaSyDDpXY9mFpXYVokl3sk9IBwJbgTL7oSPy0",
  authDomain: "game-1-ff28e.firebaseapp.com",
  databaseURL: "https://game-1-ff28e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "game-1-ff28e",
  storageBucket: "game-1-ff28e.firebasestorage.app",
  messagingSenderId: "495737503054",
  appId: "1:495737503054:web:a5fa8dda316c81f3def21f",
  measurementId: "G-0XWZX1E0TG"
};

try {
  // Initialize Firebase directly
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    isMock = false;
    console.log("Firebase LIVE mode active.");
  } else {
    console.warn("Firebase SDK not found. Falling back to Mock.");
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

/**
 * Check if the app is connected to Firebase
 */
function isLiveMode() {
  return !isMock;
}

// --- MOCK DATABASE (LocalStorage fallback for testing) ---
const mockDb = {
  get: (path) => JSON.parse(localStorage.getItem(path)),
  set: (path, val) => localStorage.setItem(path, JSON.stringify(val)),
  update: (path, val) => {
    const existing = mockDb.get(path) || {};
    mockDb.set(path, { ...existing, ...val });
  },
  onValue: (path, callback) => {
    window.addEventListener('storage', (e) => {
      if (e.key === path) callback(JSON.parse(e.newValue));
    });
    // Initial call
    callback(mockDb.get(path));
  }
};

// --- CORE GAME FUNCTIONS ---

/**
 * Increment global clicks in the database
 */
function incrementGlobalClicks() {
  if (!isMock) {
    database.ref('clicks').transaction((current) => (current || 0) + 1);
  } else {
    const val = (mockDb.get('clicks') || 0) + 1;
    mockDb.set('clicks', val);
    window.dispatchEvent(new StorageEvent('storage', { key: 'clicks', newValue: JSON.stringify(val) }));
  }
}

/**
 * Get current global clicks
 */
let currentClicks = 0;
function getGlobalClicks() {
  return currentClicks;
}

/**
 * Reset global clicks
 */
function resetGlobalClicks() {
  currentClicks = 0;
  if (!isMock) {
    database.ref('clicks').set(0);
  } else {
    mockDb.set('clicks', 0);
    window.dispatchEvent(new StorageEvent('storage', { key: 'clicks', newValue: "0" }));
  }
}

/**
 * Set the global game state (waiting, active, crashed, success)
 */
function setGameState(state) {
  if (!isMock) {
    database.ref('state').set(state);
  } else {
    mockDb.set('state', state);
    window.dispatchEvent(new StorageEvent('storage', { key: 'state', newValue: JSON.stringify(state) }));
  }
}

/**
 * Listen for game state changes
 */
function onGameStateChange(callback) {
  if (!isMock) {
    database.ref('state').on('value', (snapshot) => {
      callback(snapshot.val());
    });
  } else {
    mockDb.onValue('state', callback);
  }
}

// Sync currentClicks variable
if (!isMock) {
  database.ref('clicks').on('value', (snapshot) => {
    currentClicks = snapshot.val() || 0;
  });
} else {
  mockDb.onValue('clicks', (val) => {
    currentClicks = val || 0;
  });
}
