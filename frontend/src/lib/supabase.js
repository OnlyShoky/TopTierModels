/**
 * Supabase Client Configuration
 * 
 * This module initializes the Supabase client for frontend use.
 * Uses the anon key which is safe for client-side code.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetch all published articles with optional filters
 */
export async function getArticles({ category, tier, page = 1, limit = 12 }) {
  let query = supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      hero_image_url,
      read_time_minutes,
      published_at,
      models!inner (
        id,
        category,
        model_scores!inner (
          tier,
          overall_score
        )
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (category && category !== 'all') {
    query = query.eq('models.category', category)
  }

  if (tier && tier !== 'all') {
    query = query.eq('models.model_scores.tier', tier)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      read_time_minutes,
      author,
      published_at,
      seo_keywords,
      models (
        id,
        model_name,
        display_name,
        category,
        organization,
        license,
        huggingface_url,
        safetensors,
        model_size,
        tensor_types,
        featured_image_url,
        model_scores (*),
        code_snippets (*)
      ),
      simplified_articles (*)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

/**
 * Fetch all models with scores for tierlist
 */
export async function getModelsForTierlist(category) {
  let query = supabase
    .from('models')
    .select(`
      id,
      model_name,
      display_name,
      category,
      featured_image_url,
      model_scores!inner (
        overall_score,
        quality_score,
        speed_score,
        freedom_score,
        tier
      ),
      articles (
        slug
      )
    `)
    .eq('status', 'active')
    .order('model_scores(overall_score)', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Search articles and models
 */
export async function searchContent(query) {
  const searchTerm = `%${query}%`

  const [articlesResult, modelsResult] = await Promise.all([
    supabase
      .from('articles')
      .select('id, title, slug, excerpt')
      .eq('published', true)
      .ilike('title', searchTerm)
      .limit(5),
    supabase
      .from('models')
      .select(`
        id,
        display_name,
        category,
        model_scores (tier, overall_score),
        articles (slug)
      `)
      .eq('status', 'active')
      .ilike('display_name', searchTerm)
      .limit(5)
  ])

  return {
    articles: articlesResult.data || [],
    models: modelsResult.data || []
  }
}

/**
 * Get tierlist categories with counts
 */
export async function getTierlistCategories() {
  const { data, error } = await supabase
    .from('tierlists')
    .select('*')
    .order('model_count', { ascending: false })

  if (error) throw error
  return data
}
