export async function convertCurrency(amount: number, from: string, to: string): Promise<string> {
	const f = from.toUpperCase();
	const t = to.toUpperCase();
	try {
		const data: any = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(f)}`).then(
			(r) => r.json()
		);

		if (data.result !== 'success' || typeof data.rates?.[t] !== 'number') {
			return `I couldn't convert ${f} to ${t}. Check the codes (e.g. USD, EUR, NGN, GBP).`;
		}

		const rate = data.rates[t];
		const result = amount * rate;
		return [
			`*${amount.toLocaleString('en-US')} ${f}* = *${result.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${t}*`,
			`1 ${f} = ${rate.toFixed(4)} ${t}`
		].join('\n');
	} catch {
		return 'Could not reach the currency service. Try again later.';
	}
}
