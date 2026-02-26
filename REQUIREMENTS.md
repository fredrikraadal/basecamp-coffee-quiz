# Coffee Personality Quiz — Requirements

## Personality → Coffee Pairings

1. **Bold Adventurer** → Double Espresso
   - Tagline: "You live for intensity"

2. **Cozy Classic** → Medium Roast Drip
   - Tagline: "Comfort in every cup"

3. **Zen Minimalist** → Black Coffee, Single Origin
   - Tagline: "Simple. Clean. Perfect."

4. **Night Owl** → Red Eye (coffee + espresso shot)
   - Tagline: "Sleep is optional"

## Result Display

**Single recommendation** — show the user their top personality match only.
Example: "You're a Bold Adventurer! Your coffee: Double Espresso."

## Visual Style

**Warm & Cozy** (Style 4)
- Earth tones, soft gradients (cream/tan/brown palette)
- Serif headings (Playfair Display)
- Rounded cards, warm shadows
- Inviting, coffee-shop feel

## Images

One photo per personality result, stored in `/public/`:
- `bold-adventurer.jpg` — espresso shot
- `cozy-classic.jpg` — cozy drip coffee mug
- `zen-minimalist.jpg` — clean black coffee
- `night-owl.jpg` — dark late-night coffee

## Icons

Yes — include emoji/icon next to each answer option for a more visual, polished feel.

## Quiz Questions

### Q1: Pick your Netflix Friday night
- 🎬 Action thriller — the more intense, the better → **Bold Adventurer**
- 🛋️ Comfort rewatch you've seen 10 times → **Cozy Classic**
- 🎥 Documentary about something obscure and fascinating → **Zen Minimalist**
- 🌙 Whatever's on at 1am, honestly → **Night Owl**

### Q2: Which character is most you?
- 🤠 Indiana Jones — adventure first, questions later → **Bold Adventurer**
- 🌿 Samwise Gamgee — reliable, warm, makes the best food → **Cozy Classic**
- 🔍 Sherlock Holmes — sharp mind, needs no one → **Zen Minimalist**
- 🦇 Batman — does their best work after dark → **Night Owl**

### Q3: What's your phone's battery level right now?
- ⚡ Always above 80% — I stay charged and ready → **Bold Adventurer**
- 😊 Somewhere comfy around 50% → **Cozy Classic**
- 🔋 Exactly at 20% — I only charge what I need → **Zen Minimalist**
- 💀 Dead. Charging it at 2am like usual → **Night Owl**

## Scoring Logic

Each answer maps to one personality. At the end of 3 questions, the personality with the most answers wins. In case of a tie, default to the first tied personality in the list above.
