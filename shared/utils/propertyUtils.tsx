import { Property } from '../services/propertyservice'

export class PropertyUtils {
  /**
   * Transform database property to PropertyCard format
   */
  static transformToCardFormat(property: Property) {
    return {
      id: parseInt(property.id) || 0, // Convert string to number for compatibility
      title: property.title,
      location: property.location,
      price: property.price,
      bedrooms: property.room, // Map room to bedrooms
      bathrooms: property.bathroom,
      area: 0, // Not available in new schema
      type: 'Property', // Default type since removed from schema
      image: property.image_url || '/placeholder.svg?height=200&width=300',
      isAvailable: property.status === 'available',
      rating: 0, // Default rating since not in schema
    }
  }

  /**
   * Format price with currency
   */
  static formatPrice(price: number): string {
    return `$${price.toLocaleString()}`
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
   * Filter properties by search query
   */
  static filterProperties(properties: Property[], query: string): Property[] {
    if (!query.trim()) return properties

    const lowercaseQuery = query.toLowerCase()
    return properties.filter(property =>
      property.title.toLowerCase().includes(lowercaseQuery) ||
      property.location.toLowerCase().includes(lowercaseQuery)
    )
  }
}