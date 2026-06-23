# Otto — a Telegram assistant bot

Otto is a friendly assistant that lives in Telegram. Message it like a friend:
ask for the weather, a crypto price or a word definition, convert currencies,
keep a to-do list, and — the useful part — **set reminders that Otto delivers
to you at the right time, on its own**.

It runs **always-on and free** as a serverless bot on Vercel, so once it's
deployed anyone can open the bot link and use it 24/7 — no machine to keep
running.

Built with **Node.js + TypeScript** and **Telegraf**. State lives in **Upstash
Redis**, and reminders are scheduled with **Upstash QStash**, which calls the bot
back at exactly the right time.

## Commands

| Command | What it does |
| --- | --- |
| `/weather <city>` | Current weather + a short forecast |
| `/price <coin>` | Live crypto price (`btc`, `ethereum`, …) |
| `/convert <amount> <from> <to>` | Currency, e.g. `/convert 100 usd ngn` |
| `/define <word>` | Dictionary meaning and an example |
| `/remind in 2h <text>` | Reminder after a delay (`90s`, `45m`, `2h`, `1h30m`, `3d`) |
| `/remind at 18:30 <text>` | Reminder at a clock time |
| `/reminders` · `/cancel <id>` | List or cancel reminders |
| `/todo add … · list · done <n> · clear` | A to-do list |
| `/ask <question>` | An AI answer (optional — needs a free Gemini key) |

The data commands use **free public APIs with no keys** (Open-Meteo, CoinGecko,
open.er-api.com, dictionaryapi.dev).

## Deploy it always-on (free)

You'll need three free things, no credit card anywhere.

### 1. Create the bot
In Telegram, message **@BotFather** → `/newbot` → pick a name and username. It
gives you a **token** and a link to your bot (`t.me/your_bot`).

### 2. Create a free Upstash database + scheduler
At [upstash.com](https://upstash.com) (free, no card):
- **Redis** → create a database → copy `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN`.
- **QStash** (in the same console) → copy the `QSTASH_TOKEN`.

### 3. Deploy to Vercel
- Push this repo to GitHub and import it at
  [vercel.com/new](https://vercel.com/new).
- Add these environment variables:

  | Name | Value |
  | --- | --- |
  | `BOT_TOKEN` | from BotFather |
  | `UPSTASH_REDIS_REST_URL` | from Upstash Redis |
  | `UPSTASH_REDIS_REST_TOKEN` | from Upstash Redis |
  | `QSTASH_TOKEN` | from Upstash QStash |
  | `DELIVER_SECRET` | any random string |
  | `GEMINI_API_KEY` | optional, for `/ask` |

- Deploy. Then open **`https://your-app.vercel.app/api/setup` once** in a
  browser — this connects Telegram to your deployment.

That's it. Open your bot in Telegram, send `/start`, and share the `t.me/...`
link. It now works 24/7.

## Run it locally (optional)

For development you don't need QStash — the dev server polls for due reminders.

```bash
cp .env.example .env     # add BOT_TOKEN + the two UPSTASH_REDIS_* values
npm install
npm run dev
```

## How it fits together

```
api/telegram.ts   Telegram webhook → handles every command (always-on)
api/deliver.ts    QStash calls this at a reminder's due time → sends it
api/setup.ts      visit once to connect the Telegram webhook
src/bot.ts        builds the bot and registers commands
src/store.ts      Upstash Redis: reminders + to-dos
src/schedule.ts   Upstash QStash: schedule a reminder's delivery
src/services/     weather, crypto, currency, dictionary, ai
src/lib/          arg parsing + reminder time parser
src/dev.ts        local long-polling entry point
```
