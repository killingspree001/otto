// Returns plain text (no Markdown) so arbitrary definitions can't break formatting.
export async function defineWord(word: string): Promise<string> {
	try {
		const res = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
		);
		if (!res.ok) return `No dictionary entry for "${word}".`;

		const data: any = await res.json();
		const entry = data?.[0];
		const meaning = entry?.meanings?.[0];
		const definition = meaning?.definitions?.[0];
		if (!definition?.definition) return `No definition found for "${word}".`;

		const lines = [
			`${entry.word.toUpperCase()}  (${meaning.partOfSpeech ?? ''})`,
			definition.definition
		];
		if (definition.example) lines.push(`\n“${definition.example}”`);
		return lines.join('\n');
	} catch {
		return 'Could not reach the dictionary. Try again later.';
	}
}
