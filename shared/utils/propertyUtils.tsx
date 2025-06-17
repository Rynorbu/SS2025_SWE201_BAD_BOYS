import { Property } from '../services/propertyservice'

export class PropertyUtils {
  /**
   * Transform database property to PropertyCard format
   */
  static transformToCardFormat(property: Property) {
    return {
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.room, // Map room to bedrooms for card compatibility
      bathrooms: property.bathroom,
      area: 0, // Not available in new schema
      type: 'Property', // Default type since removed from schema
      image: property.image_url || '/placeholder.svg?height=200&width=300',
      isAvailable: property.status === 'available',
      rating: 0, // Default rating since not in schema
      description: property.description,
      status: property.status,
      // created_at: property.created_at,
      owner_id: property.owner_id,
    }
  }

  /**
   * Transform card format back to database format
   */
  static transformFromCardFormat(cardProperty: any): Partial<Property> {
    return {
      id: cardProperty.id,
      title: cardProperty.title,
      location: cardProperty.location,
      price: cardProperty.price,
      room: cardProperty.bedrooms,
      bathroom: cardProperty.bathrooms,
      image_url: cardProperty.image,
      status: cardProperty.isAvailable ? 'available' : 'booked',
      description: cardProperty.description || '',
    }
  }

  /**
   * Format price with currency
   */
  static formatPrice(price: number): string {
    return `$${price.toLocaleString()}`
  }

  /**
   * Format room count
   */
  static formatRoomCount(rooms: number): string {
    return `${rooms} ${rooms === 1 ? 'Room' : 'Rooms'}`
  }

  /**
   * Format bathroom count
   */
  static formatBathroomCount(bathrooms: number): string {
    return `${bathrooms} ${bathrooms === 1 ? 'Bath' : 'Baths'}`
  }

  /**
   * Get status color
   */
  static getStatusColor(status: Property['status']): string {
    switch (status) {
      case 'available':
        return '#28a745'
      case 'pending':
        return '#ffc107'
      case 'booked':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  /**
   * Get status text
   */
  static getStatusText(status: Property['status']): string {
    switch (status) {
      case 'available':
        return 'Available'
      case 'pending':
        return 'Pending'
      case 'booked':
        return 'Booked'
      default:
        return 'Unknown'
    }
  }

  /**
   * Check if property is bookable
   */
  static isBookable(status: Property['status']): boolean {
    return status === 'available'
  }

  /**
   * Filter properties by search query
   */
  static filterProperties(properties: Property[], query: string): Property[] {
    if (!query.trim()) return properties

    const lowercaseQuery = query.toLowerCase()
    return properties.filter(property =>
      property.title.toLowerCase().includes(lowercaseQuery) ||
      property.location.toLowerCase().includes(lowercaseQuery) ||
      property.description.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Sort properties by different criteria
   */
  static sortProperties(properties: Property[], sortBy: 'price' | 'date' | 'title', ascending: boolean = true): Property[] {
    return [...properties].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'date':
          // comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        default:
          return 0
      }
      
      return ascending ? comparison : -comparison
    })
  }

  /**
   * Get property statistics
   */
  static getPropertyStats(properties: Property[]) {
    const total = properties.length
    const available = properties.filter(p => p.status === 'available').length
    const pending = properties.filter(p => p.status === 'pending').length
    const booked = properties.filter(p => p.status === 'booked').length
    
    const averagePrice = total > 0 
      ? properties.reduce((sum, p) => sum + p.price, 0) / total 
      : 0

    return {
      total,
      available,
      pending,
      booked,
      averagePrice: Math.round(averagePrice),
    }
  }
}