const ALIASES: Record<string, string> = {
	btc: 'bitcoin',
	eth: 'ethereum',
	sol: 'solana',
	bnb: 'binancecoin',
	ada: 'cardano',
	xrp: 'ripple',
	doge: 'dogecoin',
	dot: 'polkadot',
	ltc: 'litecoin',
	usdt: 'tether',
	usdc: 'usd-coin'
};

export async function getCryptoPrice(symbol: string): Promise<string> {
	const id = ALIASES[symbol.toLowerCase()] ?? symbol.toLowerCase();
	try {
		const data: any = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd&include_24hr_change=true`
		).then((r) => r.json());

		const entry = data[id];
		if (!entry || typeof entry.usd !== 'number') {
			return `I don't know "${symbol}". Try /price btc or /price ethereum.`;
		}

		const change = Number(entry.usd_24h_change ?? 0);
		const arrow = change >= 0 ? '🟢 +' : '🔴 ';
		return [
			`*${id}*`,
			`$${entry.usd.toLocaleString('en-US')}`,
			`${arrow}${change.toFixed(2)}% (24h)`
		].join('\n');
	} catch {
		return 'Could not reach the price service. Try again in a moment.';
	}
}
