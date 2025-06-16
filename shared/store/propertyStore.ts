import { create } from 'zustand'
import { Property } from '../services/propertyservice'

interface PropertyState {
  properties: Property[]
  filteredProperties: Property[]
  loading: boolean
  error: string | null
  searchQuery: string
  refreshing: boolean
}

interface PropertyActions {
  setProperties: (properties: Property[]) => void
  setFilteredProperties: (properties: Property[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchQuery: (query: string) => void
  setRefreshing: (refreshing: boolean) => void
  filterProperties: (query: string) => void
  reset: () => void
}

const initialState: PropertyState = {
  properties: [],
  filteredProperties: [],
  loading: false,
  error: null,
  searchQuery: '',
  refreshing: false,
}

export const usePropertyStore = create<PropertyState & PropertyActions>((set, get) => ({
  ...initialState,

  setProperties: (properties) => {
    set({ properties })
    // Also update filtered properties if no search query
    const { searchQuery } = get()
    if (!searchQuery.trim()) {
      set({ filteredProperties: properties })
    } else {
      get().filterProperties(searchQuery)
    }
  },

  setFilteredProperties: (filteredProperties) => set({ filteredProperties }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setRefreshing: (refreshing) => set({ refreshing }),

  setSearchQuery: (searchQuery) => {
    set({ searchQuery })
    get().filterProperties(searchQuery)
  },

  filterProperties: (query) => {
    const { properties } = get()
    if (!query.trim()) {
      set({ filteredProperties: properties })
      return
    }

    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(query.toLowerCase()) ||
      property.location.toLowerCase().includes(query.toLowerCase())
    )
    set({ filteredProperties: filtered })
  },

  reset: () => set(initialState),
}))