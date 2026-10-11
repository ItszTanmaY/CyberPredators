/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        action: 'var(--color-action)',
        'action-hover': 'var(--color-action-hover)',
        evidence: 'var(--color-evidence)',
        verified: 'var(--color-verified)',
        'needs-check': 'var(--color-needs-check)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        control: 'var(--radius-control)',
        surface: 'var(--radius-surface)',
        chip: 'var(--radius-chip)',
      },
      fontFamily: {
        sans: ['var(--font-public-sans)', 'var(--font-noto-sans-devanagari)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['var(--font-literata)', 'var(--font-noto-serif-devanagari)', 'Georgia', 'Cambria', 'serif'],
      },
      minHeight: {
        tap: 'var(--size-tap-min)',
      },
      height: {
        header: 'var(--size-header-height)',
        chip: 'var(--size-chip-height)',
        tap: 'var(--size-tap-min)',
      },
      maxWidth: {
        container: 'var(--container-max)',
        reader: '70ch',
      },
    },
  },
  plugins: [],
};
