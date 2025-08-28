import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️  Supabase credentials not found. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Contract operations
export const contractService = {
    // Create a new contract
    async createContract(contractData) {
        try {
            const { data, error } = await supabase
                .from('contracts')
                .insert([contractData])
                .select()
            
            if (error) throw error
            
            return { success: true, data: data[0] }
        } catch (error) {
            console.error('Error creating contract:', error)
            return { success: false, error: error.message }
        }
    },

    // Get all contracts
    async getAllContracts() {
        try {
            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching contracts:', error)
            return { success: false, error: error.message }
        }
    },

    // Get contract by ID
    async getContractById(id) {
        try {
            const { data, error } = await supabase
                .from('contracts')
                .select('*')
                .eq('id', id)
                .single()
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching contract:', error)
            return { success: false, error: error.message }
        }
    },

    // Update contract
    async updateContract(id, updates) {
        try {
            const { data, error } = await supabase
                .from('contracts')
                .update(updates)
                .eq('id', id)
                .select()
            
            if (error) throw error
            
            return { success: true, data: data[0] }
        } catch (error) {
            console.error('Error updating contract:', error)
            return { success: false, error: error.message }
        }
    },

    // Delete contract
    async deleteContract(id) {
        try {
            const { error } = await supabase
                .from('contracts')
                .delete()
                .eq('id', id)
            
            if (error) throw error
            
            return { success: true }
        } catch (error) {
            console.error('Error deleting contract:', error)
            return { success: false, error: error.message }
        }
    }
}

// User operations
export const userService = {
    // Get all users for agent dropdown
    async getAllUsers() {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('user_id, user_name, user_email')
                .order('user_name', { ascending: true })
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching users:', error)
            return { success: false, error: error.message }
        }
    }
}

// Contract Template operations
export const contractTemplateService = {
    // Get all contract templates for dropdown
    async getAllContractTemplates() {
        try {
            const { data, error } = await supabase
                .from('contract_templates')
                .select('id, template_name, template_link')
                .order('template_name', { ascending: true })
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching contract templates:', error)
            return { success: false, error: error.message }
        }
    }
}

// Listings operations
export const listingsService = {
    // Get all listings for property dropdown
    async getAllListings() {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('list_num, list_name')
                .order('list_name', { ascending: true })
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching listings:', error)
            return { success: false, error: error.message }
        }
    }
}

// Template operations
export const templateService = {
    // Create a new template
    async createTemplate(templateData) {
        try {
            const { data, error } = await supabase
                .from('templates')
                .insert([templateData])
                .select()
            
            if (error) throw error
            
            return { success: true, data: data[0] }
        } catch (error) {
            console.error('Error creating template:', error)
            return { success: false, error: error.message }
        }
    },

    // Get all templates
    async getAllTemplates() {
        try {
            const { data, error } = await supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            
            return { success: true, data }
        } catch (error) {
            console.error('Error fetching templates:', error)
            return { error: error.message }
        }
        }
    }
