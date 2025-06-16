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

      const { data, error } = await PropertyService.getAvailableProperties()

      if (error) {
        console.error('Error loading properties:', error)
        setError('Failed to load properties')
        Alert.alert('Error', 'Failed to load properties. Please try again.')
        return
      }

      setProperties(data || [])
    } catch (error) {
      console.error('Error in loadProperties:', error)
      console.log("Properties fetched:", setProperties)
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
    const { setLoading, setFilteredProperties, setError } = usePropertyStore.getState()
    
    try {
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
    const { setSearchQuery } = usePropertyStore.getState()
    setSearchQuery(query)

    if (SearchUtils.isValidQuery(query)) {
      this.searchProperties(query)
    } else if (!query.trim()) {
      // If query is empty, show all properties
      const { properties, setFilteredProperties } = usePropertyStore.getState()
      setFilteredProperties(properties)
    }
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
}