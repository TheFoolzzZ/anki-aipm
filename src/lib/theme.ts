export type Theme = 'paper' | 'classic';
export const THEME_KEY = 'recall.theme';
export const resolveTheme = (value: unknown): Theme => value === 'classic' ? 'classic' : 'paper';

// Runs before paint; stored values never become arbitrary attributes or script text.
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');document.documentElement.dataset.theme=t==='classic'?'classic':'paper'}catch(e){}})()`;
