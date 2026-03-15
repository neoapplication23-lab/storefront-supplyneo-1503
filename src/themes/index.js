// Theme registry — maps theme key to its component set
// Usage: const { Hero, CollectionGrid, ProductSection, ProductCard } = getTheme(themeKey)

import * as Classic from './classic'
import * as Compact from './compact'
import * as Premium from './premium'

const themes = {
  classic: Classic,
  compact: Compact,
  premium: Premium,
}

export function getTheme(key) {
  return themes[key] || themes.classic
}

export const THEME_KEYS = ['classic', 'compact', 'premium']
