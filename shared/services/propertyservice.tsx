import { supabase } from '../../lib/supabase'

export interface PropertyData {
  title: string
  description: string
  location: string
  price: number
  room: number
  bathroom: number
  image_url: string
}

export async function addProperty(propertyData: PropertyData) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Insert the property with owner_id
    const { data, error } = await supabase
      .from('houses')
      .insert([
        {
          ...propertyData,
          owner_id: user.id
        }
      ])
      .select()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error adding property:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    }
  }
}