/**
 * Utility functions for text processing
 */

/**
 * Removes emojis from text and cleans up formatting
 * @param text The text to clean
 * @returns Cleaned text without emojis
 */
export function removeEmojis(text: string): string {
	// Remove emoji characters using Unicode ranges
	return text
		.replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
		.replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc Symbols and Pictographs
		.replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport and Map
		.replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Regional indicator symbols
		.replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
		.replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
		.replace(/[\u{FE00}-\u{FE0F}]/gu, "") // Variation selectors
		.replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols and Pictographs
		.replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
		.trim();
}

/**
 * Processes a multi-line string by removing emojis from each line
 * @param text Multi-line text (typically separated by \n)
 * @returns Cleaned text with emojis removed from each line
 */
export function processMultilineText(text: string): string[] {
	return text
		.split("\n")
		.filter((line) => line.trim())
		.map((line) => removeEmojis(line).trim())
		.filter((line) => line); // Remove empty lines after emoji removal
}
