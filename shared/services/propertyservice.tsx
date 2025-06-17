import { supabase } from '../../lib/session'

export interface Property {
  id: string
  title: string
  description: string
  location: string
  price: number
  room: number
  bathroom: number
  image_url: string
  status: 'available' | 'pending' | 'booked'
  // created_at: string
  owner_id: string
}

export class PropertyService {
  /**
   * Get all available properties
   */
  static async getAvailableProperties(): Promise<{ data: Property[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('status', 'available')
        // .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching available properties:', error)
      return { data: null, error }
    }
  }

  /**
   * Get all properties (for stats)
   */
  static async getAllProperties(): Promise<{ data: Property[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        // .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching all properties:', error)
      return { data: null, error }
    }
  }

  /**
   * Search properties by title or location
   */
  static async searchProperties(query: string): Promise<{ data: Property[] | null; error: any }> {
    try {
      if (!query.trim()) {
        return this.getAvailableProperties()
      }

      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('status', 'available')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
        // .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error searching properties:', error)
      return { data: null, error }
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: string): Promise<{ data: Property | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('id', id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error fetching property by ID:', error)
      return { data: null, error }
    }
  }

  /**
   * Get properties by owner
   */
  static async getPropertiesByOwner(ownerId: string): Promise<{ data: Property[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('owner_id', ownerId)
        // .order('created_at', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching properties by owner:', error)
      return { data: null, error }
    }
  }
}