'use client';
import { useLayoutEffect, useState } from 'react';
import { resolveTheme, THEME_KEY, type Theme } from '@/lib/theme';

export function ThemeInitializer() {
  useLayoutEffect(() => {
    function restore() {
      try { document.documentElement.dataset.theme = resolveTheme(localStorage.getItem(THEME_KEY)); } catch { /* Keep the current appearance when storage is unavailable. */ }
    }
    restore();
    function sync(event: StorageEvent) { if (event.key === THEME_KEY || event.key === null) restore(); }
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  return null;
}

export function ThemePicker() {
  const [theme, setTheme] = useState<Theme>('paper');
  const [message, setMessage] = useState('');
  useLayoutEffect(() => {
    const sync = () => setTheme(resolveTheme(document.documentElement.dataset.theme));
    sync();
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function choose(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem(THEME_KEY, next); setMessage('主题已切换，已记住你的选择。'); }
    catch { setMessage('主题已切换，但此浏览器无法保存；刷新后将恢复默认主题。'); }
  }
  return <section className="appearance-settings"><h2>让学习空间更像你</h2><p>导航和课程位置保持一致。主题立即生效，此浏览器会记住你的选择。</p>
    <fieldset className="theme-options"><legend className="visually-hidden">页面主题</legend>
      {([['paper', '雾白', '清透纸面、深蓝文字与青绿点缀。'], ['classic', '深墨', '经典深色背景、冰蓝与柔紫，保留原版字体气质。']] as const).map(([value, title, description]) => <label className={`theme-option ${theme === value ? 'chosen' : ''}`} key={value}>
        <input type="radio" name="appearance" value={value} checked={theme === value} onChange={() => choose(value)} />
        <span className={`theme-swatch swatch-${value}`} aria-hidden="true"><i /><i /><i /><span>Recall.</span></span>
        <span className="theme-option-copy"><b>{title}<small>{value === 'classic' ? '经典主题' : '新版主题'}</small></b><span>{description}</span></span>
      </label>)}
    </fieldset><p role="status" className="theme-feedback">{message}</p>
  </section>;
}
