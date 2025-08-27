import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para buscar todas as memórias
export async function getMemories() {
    try {
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .order('date', { ascending: false })
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Erro ao buscar memórias:', error)
        return []
    }
}

// Função para buscar tags
export async function getTags() {
    try {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .order('name')
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Erro ao buscar tags:', error)
        return []
    }
}

// Função para adicionar nova memória (admin)
export async function addMemory(memoryData) {
    try {
        const { data, error } = await supabase
            .from('memories')
            .insert([memoryData])
            .select()
        
        if (error) throw error
        return data[0]
    } catch (error) {
        console.error('Erro ao adicionar memória:', error)
        throw error
    }
}

// Função para verificar se é admin
export async function isAdmin() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false
        
        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single()
        
        return !error && data
    } catch (error) {
        return false
    }
}

// Função para login
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        return data
    } catch (error) {
        console.error('Erro no login:', error)
        throw error
    }
}

// Função para logout
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        console.error('Erro no logout:', error)
        throw error
    }
}
