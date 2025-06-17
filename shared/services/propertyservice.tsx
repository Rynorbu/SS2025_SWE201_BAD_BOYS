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
  owner_id: string
}

export interface PropertyData {
  title: string
  description: string
  location: string
  price: number
  room: number
  bathroom: number
  image_url: string
}

export class PropertyService {
  static async getAvailableProperties() {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('status', 'available')

      return { data, error }
    } catch (error) {
      console.error('Error fetching available properties:', error)
      return { data: null, error }
    }
  }

  static async searchProperties(query: string) {
    try {
      if (!query.trim()) return this.getAvailableProperties()

      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('status', 'available')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%`)

      return { data, error }
    } catch (error) {
      console.error('Error searching properties:', error)
      return { data: null, error }
    }
  }

  static async getPropertyById(id: string) {
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

  static async addProperty(propertyData: PropertyData) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('houses')
        .insert([{ ...propertyData, owner_id: user.id, status: 'available' }])
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  static async bookProperty(id: string) {
    try {
      const { error } = await supabase
        .from('houses')
        .update({ status: 'booked' })
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error booking property:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  static async deleteProperty(id: string) {
    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting property:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}
  