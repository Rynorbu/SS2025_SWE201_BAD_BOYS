// import { create } from 'zustand'
// import { Property } from '../services/propertyservice'

// interface PropertyState {
//   properties: Property[]
//   filteredProperties: Property[]
//   loading: boolean
//   error: string | null
//   searchQuery: string
//   refreshing: boolean
// }

// interface PropertyActions {
//   setProperties: (properties: Property[]) => void
//   setFilteredProperties: (properties: Property[]) => void
//   setLoading: (loading: boolean) => void
//   setError: (error: string | null) => void
//   setSearchQuery: (query: string) => void
//   setRefreshing: (refreshing: boolean) => void
//   filterProperties: (query: string) => void
//   reset: () => void
// }

// const initialState: PropertyState = {
//   properties: [],
//   filteredProperties: [],
//   loading: false,
//   error: null,
//   searchQuery: '',
//   refreshing: false,
// }

// export const usePropertyStore = create<PropertyState & PropertyActions>((set, get) => ({
//   ...initialState,

//   setProperties: (properties) => {
//     set({ properties })
//     // Also update filtered properties if no search query
//     const { searchQuery } = get()
//     if (!searchQuery.trim()) {
//       set({ filteredProperties: properties })
//     } else {
//       get().filterProperties(searchQuery)
//     }
//   },

//   setFilteredProperties: (filteredProperties) => set({ filteredProperties }),

//   setLoading: (loading) => set({ loading }),

//   setError: (error) => set({ error }),

//   setRefreshing: (refreshing) => set({ refreshing }),

//   setSearchQuery: (searchQuery) => {
//     set({ searchQuery })
//     get().filterProperties(searchQuery)
//   },

//   filterProperties: (query) => {
//     const { properties } = get()
//     if (!query.trim()) {
//       set({ filteredProperties: properties })
//       return
//     }

//     const filtered = properties.filter(property =>
//       property.title.toLowerCase().includes(query.toLowerCase()) ||
//       property.location.toLowerCase().includes(query.toLowerCase())
//     )
//     set({ filteredProperties: filtered })
//   },

//   reset: () => set(initialState),
// }))

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
  updatePropertyStatus: (propertyId: string, status: Property['status']) => void
  addProperty: (property: Property) => void
  removeProperty: (propertyId: string) => void
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
      (property.title?.toLowerCase().includes(query.toLowerCase()) ||
      property.location?.toLowerCase().includes(query.toLowerCase()))
    )
    set({ filteredProperties: filtered })
  },

  updatePropertyStatus: (propertyId, status) => {
    const { properties, filteredProperties } = get()
    
    const updatedProperties = properties.map(property =>
      property.id === propertyId ? { ...property, status } : property
    )
    
    const updatedFilteredProperties = filteredProperties.map(property =>
      property.id === propertyId ? { ...property, status } : property
    )

    set({ 
      properties: updatedProperties,
      filteredProperties: updatedFilteredProperties
    })
  },

  addProperty: (property) => {
    const { properties, searchQuery } = get()
    const updatedProperties = [property, ...properties]
    set({ properties: updatedProperties })
    
    // Update filtered properties based on current search
    if (!searchQuery.trim()) {
      set({ filteredProperties: updatedProperties })
    } else {
      get().filterProperties(searchQuery)
    }
  },

  removeProperty: (propertyId) => {
    const { properties, filteredProperties } = get()
    
    const updatedProperties = properties.filter(p => p.id !== propertyId)
    const updatedFilteredProperties = filteredProperties.filter(p => p.id !== propertyId)
    
    set({ 
      properties: updatedProperties,
      filteredProperties: updatedFilteredProperties
    })
  },

  reset: () => set(initialState),
}))