import { Alert } from 'react-native'
import { PropertyService } from './propertyservice'
import { usePropertyStore } from '../store/propertyStore'
import { SearchUtils } from '../utils/searchUtils'

export class PropertyBusinessLogic {
  /**
   * Load all available properties
   */
  static async loadProperties(): Promise<void> {
    const { setLoading, setProperties, setError } = usePropertyStore.getState()
    
    try {
      setLoading(true)
      setError(null)

      // For home page, we want to show all properties for stats, but filter available ones for display
      const { data: allProperties, error: allError } = await PropertyService.getAllProperties()
      
      if (allError) {
        console.error('Error loading properties:', allError)
        setError('Failed to load properties')
        Alert.alert('Error', 'Failed to load properties. Please try again.')
        return
      }

      // Set all properties for stats calculation
      setProperties(allProperties || [])
      
    } catch (error) {
      console.error('Error in loadProperties:', error)
      setError('Something went wrong')
      Alert.alert('Error', 'Something went wrong while loading properties')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load only available properties
   */
  static async loadAvailableProperties(): Promise<void> {
    const { setLoading, setProperties, setError } = usePropertyStore.getState()
    
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await PropertyService.getAvailableProperties()

      if (error) {
        console.error('Error loading available properties:', error)
        setError('Failed to load properties')
        Alert.alert('Error', 'Failed to load properties. Please try again.')
        return
      }

      setProperties(data || [])
      
    } catch (error) {
      console.error('Error in loadAvailableProperties:', error)
      setError('Something went wrong')
      Alert.alert('Error', 'Something went wrong while loading properties')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Search properties with debouncing
   */
  static searchProperties = SearchUtils.debounce(async (query: string): Promise<void> => {
    const { setLoading, setFilteredProperties, setError, properties } = usePropertyStore.getState()
    
    try {
      // If no query, show all current properties
      if (!query.trim()) {
        setFilteredProperties(properties)
        return
      }

      setLoading(true)
      setError(null)

      const { data, error } = await PropertyService.searchProperties(query)

      if (error) {
        console.error('Error searching properties:', error)
        setError('Search failed')
        return
      }

      setFilteredProperties(data || [])
    } catch (error) {
      console.error('Error in searchProperties:', error)
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }, 500)

  /**
   * Handle search input change
   */
  static handleSearchChange(query: string): void {
    const { setSearchQuery, filterProperties, properties } = usePropertyStore.getState()
    setSearchQuery(query)

    // For immediate local filtering
    if (!SearchUtils.isValidQuery(query)) {
      if (!query.trim()) {
        // If query is empty, show all properties
        filterProperties('')
      }
      return
    }

    // For server-side search (debounced)
    this.searchProperties(query)
  }

  /**
   * Refresh properties
   */
  static async refreshProperties(): Promise<void> {
    const { setRefreshing } = usePropertyStore.getState()
    
    try {
      setRefreshing(true)
      await this.loadProperties()
    } finally {
      setRefreshing(false)
    }
  }

  /**
   * Filter properties by status
   */
  static filterPropertiesByStatus(status: 'all' | 'available' | 'pending' | 'booked'): void {
    const { properties, setFilteredProperties } = usePropertyStore.getState()
    
    if (status === 'all') {
      setFilteredProperties(properties)
    } else {
      const filtered = properties.filter(property => property.status === status)
      setFilteredProperties(filtered)
    }
  }

  /**
   * Sort properties
   */
  static sortProperties(sortBy: 'price' | 'date' | 'title', ascending: boolean = true): void {
    const { filteredProperties, setFilteredProperties } = usePropertyStore.getState()
    
    const sorted = [...filteredProperties].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'date':
        //   comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        default:
          return 0
      }
      
      return ascending ? comparison : -comparison
    })
    
    setFilteredProperties(sorted)
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: string): Promise<any> {
    try {
      const { data, error } = await PropertyService.getPropertyById(id)
      
      if (error) {
        console.error('Error fetching property:', error)
        Alert.alert('Error', 'Failed to load property details')
        return null
      }
      
      return data
    } catch (error) {
      console.error('Error in getPropertyById:', error)
      Alert.alert('Error', 'Something went wrong')
      return null
    }
  }

  /**
   * Update property status in store
   */
  static updatePropertyStatus(propertyId: string, status: 'available' | 'pending' | 'booked'): void {
    const { updatePropertyStatus } = usePropertyStore.getState()
    updatePropertyStatus(propertyId, status)
  }

  /**
   * Add new property to store
   */
  static addPropertyToStore(property: any): void {
    const { addProperty } = usePropertyStore.getState()
    addProperty(property)
  }

  /**
   * Remove property from store
   */
  static removePropertyFromStore(propertyId: string): void {
    const { removeProperty } = usePropertyStore.getState()
    removeProperty(propertyId)
  }
}