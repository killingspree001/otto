# Otto — a Telegram assistant bot

Otto is a friendly assistant that lives in Telegram. Message it like a friend:
ask for the weather, a crypto price or a word definition, convert currencies,
keep a to-do list, and — the useful part — **set reminders that Otto delivers
to you at the right time, on its own**.

Built with **Node.js + TypeScript** and **Telegraf**. Scheduling is handled by
**node-cron**, data is stored in a small local JSON file, and the only thing you
need to run it is a free bot token.

## Commands

| Command | What it does |
| --- | --- |
| `/weather <city>` | Current weather + a short forecast |
| `/price <coin>` | Live crypto price (e.g. `btc`, `ethereum`) |
| `/convert <amount> <from> <to>` | Currency conversion, e.g. `/convert 100 usd ngn` |
| `/define <word>` | Dictionary meaning and an example |
| `/remind in 2h <text>` | Reminder after a delay (`90s`, `45m`, `2h`, `1h30m`, `3d`) |
| `/remind at 18:30 <text>` | Reminder at a clock time |
| `/reminders` · `/cancel <id>` | List or cancel reminders |
| `/todo add <text>` · `/todo list` · `/todo done <n>` · `/todo clear` | A to-do list |
| `/ask <question>` | An AI answer (optional — needs a free Gemini key) |

All of the data commands use **free public APIs with no keys** (Open-Meteo,
CoinGecko, open.er-api.com, dictionaryapi.dev).

## Set it up (about 2 minutes)

1. **Create a bot.** In Telegram, message **@BotFather**, send `/newbot`, and
   follow the prompts. It gives you a token like `7123456:AAH...` and a link to
   your bot (`t.me/your_bot`).
2. **Add the token.** Copy `.env.example` to `.env` and paste it in:

   ```
   BOT_TOKEN=your_token_here
   GEMINI_API_KEY=        # optional, only for /ask
   ```

3. **Run it.**

   ```bash
   npm install
   npm run dev
   ```

4. Open your bot in Telegram (the `t.me/...` link from BotFather) and send
   `/start`. You — or anyone you share the link with — can chat with it live.

### Optional: AI answers

`/ask` uses Google Gemini. Get a free key (no card) at
[aistudio.google.com/apikey](https://aistudio.google.com/apikey) and put it in
`.env` as `GEMINI_API_KEY`. Everything else works without it.

## How reminders work

When you set a reminder it’s saved to `data/otto.json` with a due time. A
node-cron job runs every minute, finds anything due, sends it to you, and
removes it. Because of this, reminders are delivered for as long as Otto is
running.

## Running it always-on

`npm start` keeps Otto running with long polling — great for a live demo. To
keep it online 24/7 so a client can use the link anytime, run it on any small
always-on host (a cheap VPS, or a free Node host). For fully serverless hosting
you can switch Telegraf to webhook mode and deploy the handler to a platform
like Vercel; the command code stays the same.

## Project layout

```
src/
  index.ts            bot setup + command registration
  config.ts           env + token check
  db.ts               local JSON store (lowdb)
  reminders.ts        node-cron delivery loop
  commands/           one file per command group
  services/           weather, crypto, currency, dictionary, ai
  lib/                arg parsing + reminder time parser
```
