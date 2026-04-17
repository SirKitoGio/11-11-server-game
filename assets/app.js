// --- INITIALIZATION ---
let database;
let isMock = true;

try {
  // Check if firebaseConfig is defined (loaded from firebase-config.js)
  if (typeof firebaseConfig !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    isMock = false;
    console.log("Firebase initialized successfully.");
  } else {
    console.warn("Using MOCK mode. Ensure assets/firebase-config.js is loaded with valid keys for Live mode.");
  }
} catch (e) {
  console.error("Firebase failed to load, switching to Mock mode.", e);
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
    // Trigger local event since 'storage' event doesn't fire in the same tab
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
