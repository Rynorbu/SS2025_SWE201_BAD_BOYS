// import { supabase } from '../../lib/supabase'

// export interface PropertyData {
//   title: string
//   description: string
//   location: string
//   price: number
//   room: number
//   bathroom: number
//   image_url: string
// }

// export async function addProperty(propertyData: PropertyData) {
//   try {
//     // Get the current user
//     const { data: { user }, error: userError } = await supabase.auth.getUser()
    
//     if (userError || !user) {
//       throw new Error('User not authenticated')
//     }

//     // Insert the property with owner_id
//     const { data, error } = await supabase
//       .from('houses')
//       .insert([
//         {
//           ...propertyData,
//           owner_id: user.id
//         }
//       ])
//       .select()

//     if (error) {
//       throw error
//     }

//     return { success: true, data }
//   } catch (error) {
//     console.error('Error adding property:', error)
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : String(error) 
//     }
//   }
// }

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
   * Add a new property listing
   */
  static async addProperty(propertyData: PropertyData): Promise<{ success: boolean; data?: Property[]; error?: string }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('houses')
        .insert([
          {
            ...propertyData,
            owner_id: user.id,
            status: 'available', // default status
          }
        ])
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error adding property:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}
