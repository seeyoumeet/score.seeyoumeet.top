export type LinkHintType = 'internal' | 'external' | 'regex';
export type LinkHintMode = 'modal' | 'popovers';

export interface LinkHintBase {
	letter: string;
	type: LinkHintType;
	linkText: string;
}

export interface PreviewLinkHint extends LinkHintBase {
	left: number;
	top: number;
}

export interface SourceLinkHint extends LinkHintBase {
	index: number
}

export class Settings {
	mode: LinkHintMode = 'popovers';
	// Defaults as in Vimium extension for browsers
	letters: string = 'sadfjklewcmpgh';
	jumpToAnywhereRegex: string = '\\b\\w{3,}\\b';
}
