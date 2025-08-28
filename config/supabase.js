import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
export async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('contracts')
            .select('count')
            .limit(1)
        
        if (error) {
            console.log('Supabase connection test:', error.message)
            return false
        }
        
        console.log('✅ Supabase connected successfully!')
        return true
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message)
        return false
    }
}

