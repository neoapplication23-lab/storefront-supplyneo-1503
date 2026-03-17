import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: {},      // { [productId]: quantity }

  add(id, maxQty = Infinity) {
    set(s => {
      const current = s.items[id] || 0
      // Respect the available stock ceiling
      if (current >= maxQty) return s
      return { items: { ...s.items, [id]: current + 1 } }
    })
  },

  remove(id) {
    const items = { ...get().items }
    if (!items[id]) return
    if (items[id] <= 1) delete items[id]
    else items[id]--
    set({ items })
  },

  clear() {
    set({ items: {} })
  },

  get count() {
    return Object.values(get().items).reduce((a, b) => a + b, 0)
  },

  // Accepts products array; uses priceOverride when available
  total(products = []) {
    return Object.entries(get().items).reduce((sum, [id, qty]) => {
      const p = products.find(x => String(x.id) === String(id))
      if (!p) return sum
      // priceOverride from inventory_calendar takes precedence over base price
      const unitPrice = p.priceOverride != null ? parseFloat(p.priceOverride) : parseFloat(p.price)
      return sum + unitPrice * qty
    }, 0)
  },
}))

export default useCartStore
