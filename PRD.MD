## **PRD: "11.11 Server Survival" Interactive Mini-Game**

### **1. Objective**
To create a live, multiplayer web simulation that physically demonstrates the mathematical limitations of reactive server scaling (Traditional Math) versus the stability of predictive autoscaling (Machine Learning) using the M/M/1 Queue theory ($\lambda$ vs. $\mu$). The game must perfectly sync with the presentation slides.

### **2. Target Audience**
* **The Players:** 20–40 classmates using their mobile phones.
* **The Spectators:** The professor and classmates watching the live data projected on the main screen.

### **3. The User Experience (Gameplay Loop)**
The simulation is divided into two distinct gameplay phases designed to sandwich the presentation narrative:

* **Phase 1: Onboarding (The Setup - Before Slide 4)**
    * The presenter projects a large QR Code on the presentation slide.
    * Classmates scan it and load a simple webpage with a massive "ADD TO CART" button. The button is locked.
* **Phase 2: Round 1 – Reactive Math (The Crash - Played immediately after Slide 4)**
    * The presenter challenges the class: *"Let's test this. You are the 11.11 traffic spike. Try to buy your items."*
    * The presenter clicks "Start Round 1" on their admin dashboard. The mobile buttons unlock.
    * Classmates get 10 seconds to tap as fast as humanly possible.
    * **The Projector View:** Shows the Arrival Rate ($\lambda$) skyrocketing. The Service Rate ($\mu$) capacity bar responds too slowly. When $\lambda$ hits a critical threshold, a warning flashes: `[CRITICAL: Booting Backup Server - ETA 5:00]`. The queue line maxes out before the 5 "minutes" (simulated seconds) complete.
    * **The Result:** The screen flashes red. **"SYSTEM OVERLOADED. 11.11 CRASH."** This proves the 5-minute lag flaw from Slide 4.
* **Phase 3: Round 2 – Predictive AI (The Solution - Played immediately after Slide 5)**
    * The presenter explains Machine Learning forecasting (Slide 5), toggles "Enable Predictive AI" on the admin dashboard, and starts Round 2.
    * The presenter highlights that before anyone even taps, the AI has already provisioned the servers: *"Look at the screen. You haven't even started tapping yet, but the AI already provisioned the servers because it knew the 11.11 sale was starting."*
    * Classmates tap furiously again.
    * **The Projector View:** The AI instantly reads the initial surge and scales the Service Capacity ($\mu$) *ahead* of the Arrival Rate ($\lambda$). 
    * **The Result:** The system survives. The screen flashes green. **"SYSTEM STABLE. AI AUTOSCALING SUCCESS."**

### **4. Core Features & Requirements**

**A. Mobile Player View (Frontend)**
* **Aesthetic:** Dark mode, deep blue background, glowing neon UI elements.
* **Minimalist UI:** Just a giant, satisfying glowing neon "ADD TO CART" button to tap.
* **Tap Counter:** A local counter showing how many times that specific user has tapped (adds a competitive element).
* **Status Overlay:** Capable of showing "Waiting for Admin...", "GO!", "CRASHED", or "SURVIVED" based on global game state.

**B. Presenter / Projector View (Admin Dashboard)**
* **Aesthetic:** Dark mode, deep-blue background (`#0A1128` or similar). Volumetric soft lighting, clean geometry to match the slide theme.
* **Live Traffic Graph:** A real-time line chart updating every few milliseconds showing total global clicks. 
    * The incoming clicks line must be a glowing **Magenta neon** and explicitly labeled **Arrival Rate ($\lambda$)**.
* **Server Capacity Bar:** A visual indicator of how much the server can handle.
    * The server limit line must be a glowing **Cyan neon** and explicitly labeled **Service Rate ($\mu$)**.
* **Game Controls:** "Start Round 1", "Start Round 2", "Reset Game".

**C. Game Logic (The Math)**
* **Round 1 Logic (Reactive):** Service capacity ($\mu$) is initially flat. When $\lambda$ spikes, trigger a visual warning `[CRITICAL: Booting Backup Server - ETA 5:00]`. Service capacity increases linearly but slowly (e.g., +50 capacity every 2 seconds). It will intentionally fail against rapid tapping.
* **Round 2 Logic (Predictive):** Service capacity ($\mu$) instantly jumps to maximum capacity *before* the rapid tapping begins. It dynamically stays ahead of `Current Clicks + 20% buffer`. It is mathematically impossible for the players to crash it.

### **5. Recommended Tech Stack (Fast & Free)**
To build this quickly before your presentation, avoid complex setups.

* **Frontend (UI & Graphs):** HTML, CSS, and vanilla JavaScript. Use **Chart.js** for the slick, animated projector graphs. Apply specific neon coloring to datasets.
* **Backend (Real-time Sync):** **Firebase Realtime Database**. This is the secret weapon. It allows you to sync everyone's clicks to the projector instantly without writing complicated WebSocket servers.
* **Hosting:** **Vercel** or **GitHub Pages**. (Deploy straight from your repository for free).