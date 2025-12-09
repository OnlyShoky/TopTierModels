
# Product Requirements Specification (PRS)
## TopTierModels

**Version:** 2.0  
**Date:** [Current Date]  
**Status:** Draft  
**Author:** Product Management Team  
**Change:** Added Local Processing Studio with Preview System

---

## 1. Project Overview

### 1.1 Purpose of the Project

TopTierModels is a web application designed to automatically discover, analyze, and rank artificial intelligence models from Hugging Face or other pages. The platform transforms technical model documentation into accessible content by generating comprehensive blog articles, simplified social media posts, and visual tier rankings. This enables AI practitioners, researchers, and enthusiasts to quickly evaluate and discover the best models for their use cases.

### 1.2 Target Users

**Primary Users:**
- AI/ML Engineers seeking model recommendations
- Data Scientists evaluating models for production
- AI Researchers tracking state-of-the-art developments
- Technical Content Creators covering AI advancements
- Product Managers making ML tooling decisions

**Secondary Users:**
- AI Enthusiasts learning about new models
- Company Decision Makers evaluating AI capabilities
- Developer Community seeking implementation guidance

### 1.3 Key Objectives

1. **Automate Content Creation:** Transform Hugging Face model pages into publication-ready technical articles
2. **Enable Discovery:** Provide visual tier rankings to help users identify top-performing models by category
3. **Simplify Technical Information:** Generate accessible summaries for broader audiences
4. **Centralize Model Intelligence:** Create a single source of truth for AI model evaluation and metrics
5. **Drive Engagement:** Produce shareable content optimized for professional social networks
6. **Provide Preview Capabilities:** Enable local preview and approval before publishing to production

### 1.4 Success Metrics

| Metric | Target | Measurement Period |
|--------|--------|-------------------|
| Models Processed | 50+ models | First 3 months |
| Article Quality Score | 4.0/5.0+ | User feedback |
| Page Load Time | <2 seconds | 95th percentile |
| Mobile Responsiveness | 100% pass | Lighthouse audit |
| Tierlist Accuracy | 85%+ user agreement | Survey feedback |
| Content Generation Time | <5 minutes per model | Average processing |
| Preview-to-Publish Time | <3 minutes | Admin workflow |
| User Retention Rate | 40%+ return visits | Monthly active users |

---

## 2. Functional Requirements

### 2.1 Core Pipeline Architecture

#### 2.1.1 Input Processing

**FR-001: URL Input Validation**
- System must accept Hugging Face model URLs and blog post URLs
- Initial implementation must support: `https://huggingface.co/Tongyi-MAI/Z-Image-Turbo`
- URL validation must verify domain (`huggingface.co`) and path structure
- Future versions must support multiple Hugging Face link types (models, datasets, spaces)

**FR-002: URL Queue Management**
- System must maintain a processing queue for submitted URLs
- Queue must track status: pending, processing, completed, failed
- System must prevent duplicate URL processing within 30 days

#### 2.1.2 Web Scraping Module

**FR-003: Content Extraction**
- System must scrape the following elements from Hugging Face pages:
  - Model name and organization
  - Model description and README content
  - Model card metadata (license, languages, tasks)
  - Performance metrics and benchmarks
  - Code snippets and usage examples
  - All embedded images (thumbnails, charts, diagrams)
  - External links and references
  - Model file information (size, format)

**FR-004: Image Processing**
- System must download and store all relevant images
- Images must be stored with unique identifiers
- Image metadata must include: source URL, dimensions, file size, alt text
- System must generate thumbnails (300x300px) for card displays

**FR-005: Structured Data Extraction**
- System must parse model metadata into structured JSON
- System must extract quantitative metrics (accuracy, speed, parameters)
- System must identify model category (image generation, NLP, multimodal, etc.)
- System must capture tags and keywords

#### 2.1.3 LLM Processing Engine

**FR-006: Article Generation**
- LLM must generate comprehensive technical blog articles (800-1500 words)
- Articles must include:
  - Executive summary
  - Model architecture overview
  - Key features and innovations
  - Performance analysis and benchmarks
  - Use cases and applications
  - Implementation guidance
  - Comparison with similar models
  - Conclusion and recommendations
- Articles must maintain technical accuracy while being accessible
- Generated content must include proper citations to source material

**FR-007: LinkedIn Post Generation**
- LLM must generate simplified LinkedIn posts (150-300 words)
- Posts must include:
  - Attention-grabbing hook
  - Key model highlights (3-5 bullet points)
  - Business impact or use case
  - Call-to-action (link to full article)
  - Relevant hashtags (3-5)
- Tone must be professional yet engaging

**FR-008: Code Snippet Curation**
- System must extract or generate practical code examples
- Code must include:
  - Installation instructions
  - Basic usage example
  - Advanced configuration options
  - Common troubleshooting tips
- Code must be tested for syntax validity
- Multiple language implementations when applicable (Python, JavaScript, etc.)

**FR-009: Model Scoring and Ranking**
- LLM must generate comprehensive model scores based on:
  - Performance metrics (accuracy, speed, efficiency)
  - Ease of use (documentage quality, API simplicity)
  - Innovation factor (novelty of approach)
  - Community adoption (downloads, likes, discussions)
  - Production readiness (stability, support)
- Scoring must use weighted algorithm producing values 0-100
- System must assign tier rating: S (90-100), A (80-89), B (70-79), C (60-69), D (<60)

**FR-010: Tierlist Generation**
- System must categorize models into domain categories:
  - Image Generation
  - Text Generation (LLMs)
  - Computer Vision
  - Natural Language Processing
  - Multimodal Models
  - Audio Processing
  - Video Generation
  - Reinforcement Learning
  - Other/Emerging
- Each category must maintain separate tierlist rankings
- Tierlists must update automatically when new models are added

#### 2.1.4 Local Processing Studio

**FR-030: Local Web Server**
- Processing script must start local web server on port 3001
- Server must persist for preview and approval workflow
- Automatic browser opening to preview URL upon completion
- Server shutdown after successful publication or explicit stop

**FR-031: Local Data Storage**
- All processed data must be saved locally before cloud upload
- Structured storage in SQLite database for relational data
- JSON files for configuration and processed content
- Local image cache for preview rendering
- Temporary storage cleanup after successful publication

**FR-032: Preview Interface**
- Local server must serve React-based preview interface
- Interface must mirror production frontend components
- Preview must show exact rendering of blog article
- LinkedIn post must display in mock LinkedIn UI component
- Side-by-side comparison of original vs generated content

**FR-033: Preview Controls**
- "Publish to Supabase" button to trigger cloud upload
- "Copy LinkedIn Post" button for manual sharing
- "Regenerate Section" options for manual corrections
- "Export Local" option to save as offline archive
- Preview-only mode without internet connection required

#### 2.1.5 Data Storage (Supabase)

**FR-011: Database Schema Implementation**
- System must implement complete data model (see Section 4)
- All tables must include created_at and updated_at timestamps
- Foreign key relationships must be properly enforced
- Row Level Security (RLS) must be enabled on all tables

**FR-012: Image Storage**
- Images must be stored in Supabase Storage buckets
- Bucket structure: `/models/{model_id}/{image_name}`
- Public URLs must be generated for frontend access
- Storage must implement automatic cleanup for deleted models

**FR-013: Metadata Management**
- All JSON payloads must be validated before storage
- System must maintain version history for articles
- Audit logs must track all data modifications
- Backup procedures must run daily

### 2.2 Front-End Functionality

#### 2.2.1 Blog Page

**FR-014: Article Listing**
- Display article cards in grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Each card must show:
  - Featured image
  - Model name and category
  - Excerpt (150 characters)
  - Tier badge (S/A/B/C/D)
  - Publication date
  - Read time estimate
- Cards must have hover effects and smooth transitions

**FR-015: Pagination and Filtering**
- Implement pagination with 12 articles per page
- Provide category filter dropdown
- Provide tier filter (All, S, A, B, C, D)
- Display total article count
- Maintain filter state in URL parameters

**FR-016: Search Functionality**
- Real-time search across article titles and excerpts
- Search must highlight matching terms
- Search must show "No results" state with suggestions
- Search must debounce input (300ms delay)

#### 2.2.2 Article Detail Page

**FR-017: Article Display**
- Full-width article layout with readable line length (65-75 characters)
- Article must render:
  - Hero image
  - Model metadata sidebar (category, tier, metrics)
  - Full article content with proper typography
  - Code blocks with syntax highlighting
  - Embedded images and charts
  - Author information and date
- Table of contents for navigation (auto-generated from headings)
- Social sharing buttons (LinkedIn, Twitter, Copy Link)

**FR-018: Related Models Section**
- Display 3-4 related models at article end
- Related models based on category similarity
- Include thumbnail, name, tier, and brief description

#### 2.2.3 Tierlist Page

**FR-019: Tier Display Structure**
- Visual tier sections: S, A, B, C, D (descending order)
- Each tier must have distinct color coding:
  - S Tier: Gold/Yellow (#FFD700)
  - A Tier: Red/Orange (#FF6B6B)
  - B Tier: Blue (#4ECDC4)
  - C Tier: Green (#95E77D)
  - D Tier: Gray (#9E9E9E)
- Models displayed as cards within each tier
- Drag-and-drop disabled (rankings are computed)

**FR-020: Model Cards in Tierlist**
- Each model card shows:
  - Model icon/logo
  - Model name
  - Overall score (e.g., 87/100)
  - Key metrics badges (speed, accuracy, etc.)
  - Quick-view tooltip on hover
- Click opens article detail page

**FR-021: Category Filtering**
- Category tabs or dropdown at page top
- Selecting category filters tierlist to show only that category
- "All Categories" default view shows all models
- Active category highlighted visually

**FR-022: Search and Sort**
- Search bar filters models by name in real-time
- Sort options: Score (high to low), Newest, Most Popular
- Filter panel for additional criteria (license type, model size, etc.)

#### 2.2.4 Local Preview Interface

**FR-034: Preview Layout**
- Two-pane layout: left for article preview, right for controls
- Article preview matches production styling exactly
- LinkedIn preview in realistic LinkedIn interface mockup
- Real-time character count and validation for LinkedIn post

**FR-035: Publication Controls**
- "Publish to Supabase" button with progress indicator
- "Copy LinkedIn Post" with confirmation toast
- "Open Live Site" button post-publication
- "Discard" option to clear local data
- Keyboard shortcuts for common actions

**FR-036: Preview Data Management**
- Local SQLite database for structured preview data
- JSON export/import for manual backup
- Image preview from local cache
- Side-by-side comparison with source material

#### 2.2.5 Responsive Design

**FR-023: Mobile Optimization**
- All pages must be fully responsive (breakpoints: 320px, 768px, 1024px, 1440px)
- Mobile navigation: hamburger menu
- Touch-friendly UI elements (minimum 44x44px tap targets)
- Optimized images for mobile bandwidth
- Lazy loading for images and content

**FR-024: Cross-Browser Compatibility**
- Support for Chrome, Firefox, Safari, Edge (latest 2 versions)
- Graceful degradation for older browsers
- Progressive Web App (PWA) considerations for future implementation

#### 2.2.6 User Interface Elements

**FR-025: Navigation**
- Persistent header with logo and main navigation
- Navigation items: Home, Blog, Tierlist, About
- Search icon triggering overlay search
- Sticky header on scroll

**FR-026: Footer**
- Links to social media and GitHub repository
- Contact information
- Privacy policy and terms of service links
- Attribution to data sources (Hugging Face)

**FR-027: Theme Support**
- Dark mode and light mode toggle
- Theme preference stored in localStorage
- System preference detection (prefers-color-scheme)
- Smooth theme transition animations

### 2.3 Optional Features (Phase 2)

**FR-028: LinkedIn API Integration**
- Automated posting of simplified articles to LinkedIn
- OAuth authentication flow for admin users
- Posting schedule configuration
- Post preview before publishing
- Analytics tracking for post performance

**FR-029: Manual Model Submission**
- Admin interface for adding models manually
- Form validation for required fields
- Image upload functionality
- Draft and publish workflow

---

## 3. Non-Functional Requirements

### 3.1 Security

**NFR-001: Authentication and Authorization**
- Supabase Row Level Security (RLS) must be enabled on all tables
- Public read access for articles and models
- Write access restricted to service role key only
- Admin operations must use service_role key with secure storage
- No API keys or secrets in frontend code

**NFR-002: Data Protection**
- All API communications must use HTTPS
- Input validation and sanitization for all user inputs
- Protection against SQL injection via parameterized queries
- XSS protection through content sanitization
- CSRF tokens for state-changing operations

**NFR-003: Secrets Management**
- Environment variables for all sensitive configuration
- Service role keys stored securely in backend environment only
- No credentials committed to version control
- Secrets rotation policy every 90 days

**NFR-017: Local Data Security**
- Local SQLite database must be encrypted
- Temporary files must be cleaned after session
- No sensitive data persisted in local storage
- Optional password protection for local previews

### 3.2 Performance

**NFR-004: Scraping Efficiency**
- Single model scraping must complete within 30 seconds
- Concurrent scraping must support up to 5 parallel jobs
- Rate limiting compliance with Hugging Face (1 request/second)
- Retry logic with exponential backoff for failed requests
- Timeout handling for unresponsive pages (15 second timeout)

**NFR-005: LLM Processing**
- Article generation must complete within 60 seconds per model
- LLM context window must accommodate full model documentation
- Batch processing capability for multiple models
- Token usage optimization to minimize API costs
- Fallback to cached responses when LLM unavailable

**NFR-006: Frontend Performance**
- Initial page load: <2 seconds (Lighthouse target: 90+)
- Time to Interactive (TTI): <3 seconds
- First Contentful Paint (FCP): <1 second
- Lazy loading for images below the fold
- Code splitting for route-based optimization
- CDN distribution for static assets

**NFR-007: Database Performance**
- Query response time: <100ms for 95% of queries
- Indexing on frequently queried fields (model_id, category, tier)
- Connection pooling for database efficiency
- Query optimization and EXPLAIN plan analysis
- Caching layer for frequently accessed data

**NFR-018: Local Preview Performance**
- Local server startup time: <5 seconds
- Preview rendering time: <2 seconds
- Local image processing: <10 seconds
- Memory usage for local session: <500MB
- Offline preview capability when internet unavailable

### 3.3 Reliability

**NFR-008: Error Handling**
- Comprehensive error logging for all failures
- User-friendly error messages on frontend
- Automatic retry mechanism for transient failures
- Circuit breaker pattern for external service calls
- Graceful degradation when services unavailable

**NFR-009: Logging and Monitoring**
- Structured logging for all pipeline operations
- Log levels: DEBUG, INFO, WARN, ERROR
- Log aggregation and searchability
- Performance metrics tracking (processing time, success rate)
- Alerting for critical failures

**NFR-010: Data Integrity**
- Transaction management for multi-step operations
- Data validation at all input points
- Referential integrity enforcement
- Backup and recovery procedures
- Data consistency checks

**NFR-019: Local Session Reliability**
- Local session auto-save every 30 seconds
- Session recovery after unexpected shutdown
- Conflict detection for concurrent local sessions
- Data integrity validation before cloud upload

### 3.4 Scalability

**NFR-011: Horizontal Scaling**
- Pipeline scripts must be stateless for parallel execution
- Database connection pool sizing for increased load
- Storage bucket organization for large image volumes
- API rate limit management for multiple concurrent users
- Queue-based architecture for batch processing

**NFR-012: Data Volume Management**
- Support for 1000+ models in database
- Efficient pagination for large result sets
- Archive strategy for outdated content
- Storage optimization for images (compression, format selection)

### 3.5 Usability

**NFR-013: User Experience**
- Intuitive navigation requiring no training
- Consistent design language across all pages
- Accessibility compliance (WCAG 2.1 Level AA)
- Loading states for asynchronous operations
- Empty states with helpful guidance

**NFR-014: Design Aesthetics**
- Modern, minimalist design focused on content
- Data-centric visual hierarchy
- Professional color palette suitable for technical audience
- Typography optimized for readability
- Micro-interactions for engagement

**NFR-015: Accessibility**
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (WCAG AA compliance)
- Alt text for all images

### 3.6 Maintainability

**NFR-016: Code Quality**
- Modular, reusable component architecture
- Clear separation of concerns (data, logic, presentation)
- Comprehensive inline documentation
- Consistent coding style (enforced by linters)
- Test coverage minimum 70% for critical paths

**NFR-017: Project Structure**
- Logical folder organization by feature/domain
- Configuration management via environment files
- Dependency management with version pinning
- README documentation for setup and deployment
- API documentation for internal endpoints

**NFR-018: Version Control**
- Git-based version control with branch strategy
- Feature branches for development
- Pull request reviews required
- Semantic versioning for releases
- Changelog maintenance

---

## 4. Data Model

### 4.1 Database Schema

#### 4.1.1 Table: `models`

**Purpose:** Store core information about AI models from Hugging Face

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique model identifier |
| huggingface_url | TEXT | UNIQUE, NOT NULL | Original Hugging Face URL |
| model_name | TEXT | NOT NULL | Full model name (e.g., "Tongyi-MAI/Z-Image-Turbo") |
| display_name | TEXT | NOT NULL | Human-readable name |
| organization | TEXT | | Organization/author name |
| category | TEXT | NOT NULL | Model category (see FR-010) |
| description | TEXT | | Short description (from model card) |
| readme_content | TEXT | | Full README markdown |
| license | TEXT | | Model license |
| tags | JSONB | DEFAULT '[]' | Array of tags |
| model_metadata | JSONB | DEFAULT '{}' | Flexible metadata storage |
| featured_image_url | TEXT | | Primary image URL |
| downloads | INTEGER | DEFAULT 0 | Hugging Face download count |
| likes | INTEGER | DEFAULT 0 | Hugging Face likes count |
| status | TEXT | DEFAULT 'active' | active, archived, deprecated |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |
| scraped_at | TIMESTAMP | | Last scrape timestamp |

**Indexes:**
- `idx_models_category` on `category`
- `idx_models_status` on `status`
- `idx_models_organization` on `organization`

#### 4.1.2 Table: `articles`

**Purpose:** Store generated technical blog articles

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique article identifier |
| model_id | UUID | FOREIGN KEY REFERENCES models(id) ON DELETE CASCADE, NOT NULL | Associated model |
| title | TEXT | NOT NULL | Article title |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly slug |
| excerpt | TEXT | NOT NULL | Brief summary (150-200 chars) |
| content | TEXT | NOT NULL | Full article content (markdown) |
| hero_image_url | TEXT | | Featured article image |
| read_time_minutes | INTEGER | | Estimated read time |
| author | TEXT | DEFAULT 'TopTierModels AI' | Author name |
| version | INTEGER | DEFAULT 1 | Content version number |
| seo_keywords | TEXT[] | | Array of SEO keywords |
| related_model_ids | UUID[] | | Related model references |
| published | BOOLEAN | DEFAULT TRUE | Publication status |
| published_at | TIMESTAMP | DEFAULT NOW() | Publication date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_articles_model_id` on `model_id`
- `idx_articles_slug` on `slug`
- `idx_articles_published` on `published`

#### 4.1.3 Table: `simplified_articles`

**Purpose:** Store LinkedIn-optimized post content

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique post identifier |
| article_id | UUID | FOREIGN KEY REFERENCES articles(id) ON DELETE CASCADE, NOT NULL | Associated article |
| model_id | UUID | FOREIGN KEY REFERENCES models(id) ON DELETE CASCADE, NOT NULL | Associated model |
| content | TEXT | NOT NULL | LinkedIn post content |
| hook | TEXT | | Opening hook sentence |
| key_points | TEXT[] | | Array of bullet points |
| call_to_action | TEXT | | CTA text |
| hashtags | TEXT[] | | Array of hashtags |
| character_count | INTEGER | | Total character count |
| posted_to_linkedin | BOOLEAN | DEFAULT FALSE | Posting status |
| linkedin_post_id | TEXT | | LinkedIn API post ID |
| posted_at | TIMESTAMP | | LinkedIn posting timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_simplified_articles_article_id` on `article_id`
- `idx_simplified_articles_model_id` on `model_id`

#### 4.1.4 Table: `model_scores`

**Purpose:** Store detailed scoring metrics for each model

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique score identifier |
| model_id | UUID | FOREIGN KEY REFERENCES models(id) ON DELETE CASCADE, UNIQUE, NOT NULL | Associated model |
| overall_score | DECIMAL(5,2) | CHECK (overall_score >= 0 AND overall_score <= 100), NOT NULL | Overall score (0-100) |
| tier | TEXT | CHECK (tier IN ('S', 'A', 'B', 'C', 'D')), NOT NULL | Tier classification |
| performance_score | DECIMAL(5,2) | CHECK (performance_score >= 0 AND performance_score <= 100) | Performance metrics score |
| usability_score | DECIMAL(5,2) | CHECK (usability_score >= 0 AND usability_score <= 100) | Ease of use score |
| innovation_score | DECIMAL(5,2) | CHECK (innovation_score >= 0 AND innovation_score <= 100) | Innovation factor score |
| adoption_score | DECIMAL(5,2) | CHECK (adoption_score >= 0 AND adoption_score <= 100) | Community adoption score |
| production_score | DECIMAL(5,2) | CHECK (production_score >= 0 AND production_score <= 100) | Production readiness score |
| benchmarks | JSONB | DEFAULT '{}' | Raw benchmark data |
| metrics_details | JSONB | DEFAULT '{}' | Additional metrics |
| scoring_methodology | TEXT | | Description of scoring logic |
| scored_at | TIMESTAMP | DEFAULT NOW() | Score calculation timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_model_scores_model_id` on `model_id`
- `idx_model_scores_tier` on `tier`
- `idx_model_scores_overall_score` on `overall_score` DESC

#### 4.1.5 Table: `tierlists`

**Purpose:** Store category-specific tierlist configurations and metadata

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique tierlist identifier |
| category | TEXT | UNIQUE, NOT NULL | Category name |
| display_name | TEXT | NOT NULL | Human-readable category name |
| description | TEXT | | Category description |
| icon | TEXT | | Icon identifier or URL |
| model_count | INTEGER | DEFAULT 0 | Number of models in category |
| last_updated | TIMESTAMP | DEFAULT NOW() | Last tierlist update |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_tierlists_category` on `category`

#### 4.1.6 Table: `images`

**Purpose:** Track all images associated with models and articles

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique image identifier |
| model_id | UUID | FOREIGN KEY REFERENCES models(id) ON DELETE CASCADE | Associated model (nullable) |
| article_id | UUID | FOREIGN KEY REFERENCES articles(id) ON DELETE CASCADE | Associated article (nullable) |
| source_url | TEXT | NOT NULL | Original image URL |
| storage_path | TEXT | UNIQUE, NOT NULL | Supabase storage path |
| public_url | TEXT | NOT NULL | Public CDN URL |
| thumbnail_url | TEXT | | Thumbnail version URL |
| alt_text | TEXT | | Accessibility description |
| width | INTEGER | | Image width in pixels |
| height | INTEGER | | Image height in pixels |
| file_size | INTEGER | | File size in bytes |
| mime_type | TEXT | | Image MIME type |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_images_model_id` on `model_id`
- `idx_images_article_id` on `article_id`

#### 4.1.7 Table: `code_snippets`

**Purpose:** Store reusable code examples for each model

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique snippet identifier |
| model_id | UUID | FOREIGN KEY REFERENCES models(id) ON DELETE CASCADE, NOT NULL | Associated model |
| title | TEXT | NOT NULL | Snippet title |
| description | TEXT | | What the code demonstrates |
| language | TEXT | NOT NULL | Programming language |
| code | TEXT | NOT NULL | Code content |
| snippet_type | TEXT | | installation, basic_usage, advanced, etc. |
| order | INTEGER | DEFAULT 0 | Display order |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_code_snippets_model_id` on `model_id`

### 4.2 Local Data Model (SQLite)

#### 4.2.1 Table: `local_previews`

**Purpose:** Track local preview sessions before cloud upload

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| preview_id | TEXT | PRIMARY KEY | Unique preview session ID |
| model_data | TEXT | NOT NULL | JSON string of complete model data |
| article_data | TEXT | NOT NULL | JSON string of article content |
| linkedin_data | TEXT | NOT NULL | JSON string of LinkedIn post |
| scores_data | TEXT | NOT NULL | JSON string of model scores |
| images | TEXT | | JSON array of local image paths |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Preview creation timestamp |
| last_modified | TEXT | DEFAULT CURRENT_TIMESTAMP | Last modification timestamp |
| publish_status | TEXT | DEFAULT 'draft' | draft, pending, published, failed |
| supabase_references | TEXT | | JSON mapping after upload |

#### 4.2.2 Table: `local_config`

**Purpose:** Store local configuration and session data

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| key | TEXT | PRIMARY KEY | Configuration key |
| value | TEXT | NOT NULL | Configuration value |
| type | TEXT | DEFAULT 'string' | Data type (string, json, number, boolean) |
| last_updated | TEXT | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### 4.3 Relationships

```
models (1) ─────┬─────> (N) articles
                ├─────> (N) simplified_articles
                ├─────> (1) model_scores
                ├─────> (N) images
                └─────> (N) code_snippets

articles (1) ───┬─────> (1) simplified_articles
                └─────> (N) images

tierlists (category) ←─── models (category)

local_previews (standalone) ───> (uploads to) Supabase tables
```

### 4.4 Storage Buckets

**Bucket: `model-images`**
- Structure: `/{model_id}/{image_filename}`
- Public access: Read-only
- File types: PNG, JPG, WEBP, SVG
- Max file size: 10MB

**Bucket: `article-images`**
- Structure: `/{article_id}/{image_filename}`
- Public access: Read-only
- File types: PNG, JPG, WEBP
- Max file size: 5MB

**Bucket: `thumbnails`**
- Structure: `/{model_id}/thumb_{image_filename}`
- Public access: Read-only
- Dimensions: 300x300px
- Format: WEBP

**Local Cache: `./.top-tier-cache/`**
- Structure: `/previews/{preview_id}/{files}`
- Temporary storage for preview sessions
- Auto-cleanup after 7 days or successful upload

---

## 5. System Architecture

### 5.1 Architecture Overview

TopTierModels follows a decoupled architecture optimized for **free-tier deployment** with four primary components:

1. **Local Processing Studio** (Python/Node.js with local web server)
2. **Database & Storage** (Supabase Free Tier)
3. **Frontend Application** (React/Next.js on Netlify Free Tier)
4. **Local Preview Interface** (React app served locally)

```
┌─────────────────────────────────────────────────────────┐
│                    Local Processing Studio               │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Processing Script                              │   │
│  │  1. Input URL                                  │   │
│  │  2. Scrape → LLM → Score                      │   │
│  │  3. Save to local SQLite/JSON                 │   │
│  │  4. Start local server (port 3001)            │   │
│  │  5. Open browser to localhost:3001/preview    │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Local Preview Interface                         │   │
│  │  • Article Preview (WYSIWYG)                     │   │
│  │  • LinkedIn Post Mockup                         │   │
│  │  • Publish Controls                             │   │
│  │  • Copy LinkedIn Post                           │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
└────────────────────────┼─────────────────────────────────┘
                         │ Manual Approval & Publish
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Frontend Application (Web)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Blog Page   │  │ Tierlist Page│  │Article Detail│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────┬───────────────────────────────────────────────┘
          │ REST API / GraphQL
          ▼
┌─────────────────────────────────────────────────────────┐
│            Supabase (Database + Storage)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │  Storage API │  │   Auth API   │  │
│  │   Database   │  │   (Images)   │  │   (Future)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Component Details

#### 5.2.1 Local Processing Studio

**Architecture:** Modular Python script with integrated local web server
**Execution:** Local development machine only
**Components:**

1. **URL Input Handler**
   - Accepts Hugging Face URLs from command line or config file
   - Validates URL format and checks for duplicates
   - Generates unique preview session ID

2. **Web Scraper Module**
   - Technology: BeautifulSoup (Python) with async support
   - Extracts text, images, metadata from Hugging Face
   - Rate limiting and retry logic
   - Saves images to local cache directory

3. **LLM Processing Module**
   - Technology: LangChain or direct API calls
   - Supports: OpenAI GPT-4, Claude, Local models (Ollama)
   - Prompt templates for article and post generation
   - Token optimization and cost tracking
   - Results saved to local SQLite database

4. **Scoring Engine**
   - Analyzes extracted metrics
   - Applies weighted scoring algorithm
   - Assigns tier classifications
   - Outputs to local JSON structure

5. **Local Web Server (FastAPI)**
   - Starts on port 3001 (configurable)
   - Serves React preview interface
   - API endpoints for preview data retrieval
   - Endpoint for triggering Supabase upload
   - Auto-opens browser to preview page

6. **Local Data Manager**
   - SQLite database for structured data
   - JSON files for configuration
   - Local image cache management
   - Session persistence and recovery

#### 5.2.2 Local Preview Interface

**Framework:** React with identical components to production
**Serving:** Local FastAPI server on port 3001
**Features:**

1. **Article Preview Pane**
   - Exact rendering using production CSS/JS
   - Interactive table of contents
   - Code syntax highlighting
   - Image gallery with lightbox

2. **LinkedIn Preview Pane**
   - Realistic LinkedIn interface mockup
   - Character count validation
   - Hashtag formatting
   - One-click copy to clipboard

3. **Publication Control Panel**
   - "Publish to Supabase" button with progress bar
   - "Copy LinkedIn Post" with success notification
   - "Regenerate Section" options
   - "Export as JSON" for offline backup
   - "Discard Preview" to clean up

4. **Live Preview Updates**
   - WebSocket connection for real-time updates
   - Auto-refresh when data changes
   - Unsaved changes warnings

#### 5.2.3 Supabase Backend

**Services Used:**
1. **PostgreSQL Database**
   - Hosts all tables defined in Data Model
   - Row Level Security for access control
   - Automatic backups and point-in-time recovery

2. **Storage API**
   - Stores model images and thumbnails
   - CDN distribution for performance
   - Public buckets with read-only access

3. **REST API / GraphQL**
   - Auto-generated from database schema
   - Used by frontend for data fetching
   - Supports filtering, sorting, pagination

**Security Configuration:**
- RLS policies for public read access
- Service role key restricted to local studio only
- API keys separated by environment (dev, prod)

#### 5.2.4 Frontend Application

**Platform:** Netlify (Free Tier)
**Framework:** React with Next.js or Vite
**Deployment:** Git-based continuous deployment

**Free Tier Specifications:**
- 100GB bandwidth per month
- 300 build minutes per month
- Automatic HTTPS
- CDN distribution
- Instant cache invalidation

**Frontend Architecture:**

1. **Static Site Generation (SSG)**
   - Pre-render blog and tierlist pages at build time
   - Optimizes for Netlify's free tier strengths
   - Reduces client-side API calls

2. **Incremental Static Regeneration (ISR)**
   - Rebuild pages when content changes
   - Trigger rebuilds via Netlify Build Hooks
   - Keep content fresh without constant rebuilds

3. **Client-Side Data Fetching**
   - Direct Supabase API calls from browser
   - Uses anon public key (safe for frontend)
   - Real-time search and filtering

### 5.3 Free Tier Constraints and Optimizations

#### 5.3.1 Supabase Free Tier Limits

**Database:**
- 500MB database space
- Unlimited API requests
- Paused after 1 week of inactivity
- 2 concurrent connections
- 50MB file uploads limit per file
- 1GB total storage

**Optimization Strategies:**

1. **Database Size Management**
   - Limit article content to essential text
   - Store only web-optimized images
   - Compress images before upload (WebP format)
   - Archive old content after 6 months
   - Monitor database size weekly

2. **Storage Optimization**
   - Maximum image size: 500KB per file
   - Use WebP format (60-80% smaller than PNG/JPG)
   - Generate thumbnails at 300x300px maximum
   - Limit to 2-3 images per model article
   - Total target: <800MB storage usage

3. **Connection Management**
   - Use connection pooling
   - Close connections after operations
   - Batch database operations
   - Implement retry logic for connection limits

4. **Activity Management**
   - Set up ping service to prevent inactivity pause
   - Use free uptime monitoring (UptimeRobot)
   - Schedule weekly automated requests

#### 5.3.2 Netlify Free Tier Optimization

**Build Minutes Conservation:**
- Limit rebuilds to content changes only
- Avoid rebuilds for style/minor tweaks
- Use build hooks selectively
- Target: <10 builds per month

**Bandwidth Management:**
- Serve optimized images (WebP, compressed)
- Implement lazy loading for all images
- Minimize JavaScript bundle size
- Use efficient caching headers
- Target: <50GB bandwidth per month

**Best Practices:**
- Deploy production builds only
- Test locally before deploying
- Use preview deployments sparingly
- Monitor analytics dashboard

### 5.4 Local Processing Studio Execution Strategy

**For Free Tier Deployment:**

**Local Studio Workflow:**
1. Admin runs local processing script with Hugging Face URL
2. Script scrapes, processes with LLM, generates content
3. Script starts local FastAPI server on port 3001
4. Browser automatically opens to `http://localhost:3001/preview/{id}`
5. Admin reviews preview in WYSIWYG interface
6. Admin clicks "Publish to Supabase" when satisfied
7. Local studio uploads data to Supabase, images to storage
8. Optional: Trigger Netlify rebuild via webhook
9. Content appears on live site within minutes

**Local Studio Benefits:**
- ✅ Complete offline processing capability
- ✅ No cloud costs during development/review
- ✅ Manual approval before publishing
- ✅ Exact WYSIWYG preview
- ✅ LinkedIn post copy functionality
- ✅ No internet required for preview

**Technology Stack:**
- **Local Server:** FastAPI (Python) for speed and async support
- **Local Database:** SQLite for simplicity and portability
- **Preview Interface:** React with same components as production
- **Processing:** Python with BeautifulSoup, LangChain, etc.

### 5.5 Cost Analysis for Free Tier

**Monthly Costs: $0**

| Service | Free Tier Limits | Usage Estimate | Cost |
|---------|------------------|----------------|------|
| Supabase Database | 500MB | 300MB (60 models) | $0 |
| Supabase Storage | 1GB | 800MB (images) | $0 |
| Netlify Hosting | 100GB bandwidth | 40GB | $0 |
| Netlify Builds | 300 minutes | 60 minutes | $0 |
| Local Processing | No cost | Local resources | $0 |
| LLM Processing | Pay-per-use | Local/free tier | $0* |

*Note: LLM costs depend on choice:
- **Local Ollama:** Free, requires local GPU
- **OpenAI Free Tier:** Limited tokens
- **Anthropic Claude:** Pay-per-use (estimate $2-5/month for 20 models)

**Scaling Trigger Points:**
- 100+ models: Upgrade Supabase ($25/month)
- 100K+ monthly visitors: Upgrade Netlify ($19/month)
- Daily builds needed: Consider dedicated CI/CD

---

## 6. Local Preview System

### 6.1 Local Processing Script Enhancements

#### 6.1.1 Local Web Server Integration
- Processing script now starts a local FastAPI web server on port 3001
- Server persists for the duration of the preview and approval workflow
- Automatic browser opening to `http://localhost:3001/preview/{preview_id}`
- Server shutdown after successful publication or explicit stop command

#### 6.1.2 Local Data Storage Architecture
- All processed data saved locally before any cloud upload
- **SQLite database** for structured relational data (models, articles, scores)
- **JSON files** for configuration and processed content
- **Local image cache** directory for downloaded images
- **Temporary session storage** with automatic cleanup (7-day retention)

#### 6.1.3 Processing Pipeline Modifications
```python
# Previous flow:
# 1. Process URL → 2. Generate content → 3. Upload to Supabase

# New flow with preview:
# 1. Process URL → 2. Generate content → 3. Save to local storage
# 4. Start local server → 5. Open preview → 6. Wait for approval
# 7. On approval: upload to Supabase → 8. Cleanup local data
```

#### 6.1.4 Session Management
- Unique preview session ID generation for each processing run
- Session persistence across browser refreshes
- Auto-save functionality every 30 seconds
- Session recovery after unexpected shutdown
- Multi-session support for parallel processing

### 6.2 Local Preview Interface

#### 6.2.1 Interface Layout
**Two-Pane Design:**
- **Left Pane (70%):** Article preview with exact production styling
- **Right Pane (30%):** Controls and LinkedIn post preview

**Article Preview Features:**
- WYSIWYG rendering using identical React components as production
- Interactive table of contents with smooth scrolling
- Code blocks with syntax highlighting and copy buttons
- Image gallery with lightbox functionality
- Responsive design mirroring mobile/tablet/desktop views
- Side-by-side comparison with source Hugging Face content

**LinkedIn Post Preview:**
- Realistic LinkedIn interface mockup
- Character count validation (within 3000 character limit)
- Hashtag formatting and validation
- Preview of how post will appear on LinkedIn feed
- One-click copy to clipboard with formatting preserved

#### 6.2.2 Publication Controls
**Primary Actions:**
1. **"Publish to Supabase" Button**
   - Triggers upload of all local data to cloud
   - Progress bar showing upload status
   - Error handling with retry options
   - Success confirmation with live URL

2. **"Copy LinkedIn Post" Button**
   - Copies formatted LinkedIn post to clipboard
   - Toast notification confirming copy
   - Option to open LinkedIn composer with pre-filled content

3. **"Regenerate Section" Options**
   - Selective regeneration of article sections
   - Option to regenerate LinkedIn post with different tone
   - Score recalibration with adjusted weights

4. **"Export Local" Button**
   - Save preview as offline archive (JSON + images)
   - Export as Markdown for external editing
   - Backup functionality for later publication

#### 6.2.3 Real-Time Preview Updates
- WebSocket connection between server and preview interface
- Live updates when data changes (e.g., regenerated sections)
- Auto-refresh of preview when underlying data updates
- Unsaved changes warnings before navigation
- Keyboard shortcuts for common actions (Ctrl+S to save, Ctrl+P to publish)

### 6.3 Preview Publication Flow

#### 6.3.1 Publication Steps
1. **Local Data Validation**
   - Check for completeness of all required fields
   - Validate image formats and sizes
   - Verify LinkedIn post character limits
   - Ensure scoring algorithm consistency

2. **Supabase Upload Sequence**
   - **Step A:** Upload images to Supabase Storage
     - Convert to WebP format if needed
     - Generate thumbnails (300x300px)
     - Set proper CORS headers and public access
   
   - **Step B:** Insert data into tables in transaction
     - Insert into `models` table (returns model_id)
     - Insert into `articles` table with foreign key
     - Insert into `simplified_articles` table
     - Insert into `model_scores` table
     - Insert into `images` table with URLs
     - Insert into `code_snippets` table if present
   
   - **Step C:** Update tierlist rankings
     - Recalculate category tierlist based on new scores
     - Update `tierlists` table with new model count

3. **Post-Publication Actions**
   - **Optional:** Trigger Netlify rebuild via webhook
   - **Optional:** Post to LinkedIn via API (Phase 2)
   - Display success message with live URL
   - Offer to open live article in new tab
   - Cleanup local temporary data

#### 6.3.2 Error Handling and Recovery
- **Network failures:** Automatic retry with exponential backoff
- **Database constraints:** Validation before upload, user-friendly error messages
- **Image upload failures:** Individual retry for failed images
- **Partial failures:** Rollback transaction to maintain data consistency
- **Recovery options:** Save failed session for later retry, export as backup

#### 6.3.3 Success Confirmation
- Green checkmark with "Published Successfully" message
- Display of live URL with clickable link
- Option to open live site immediately
- Summary of published items (article, LinkedIn post, images)
- Estimated time until Netlify rebuild completes (if triggered)

#### 6.3.4 Local Cleanup
- **Successful publication:** Automatic cleanup of local session data
- **Discarded preview:** Manual cleanup option
- **Session persistence:** Option to keep local copy for archive
- **Cache management:** Automatic cleanup of images older than 7 days
- **Database maintenance:** Vacuum SQLite database after session end

---

## 7. User Stories

### 7.1 Primary User Stories

**US-001: Discover Top AI Models**
- **As a** data scientist
- **I want to** browse a curated tierlist of AI models by category
- **So that** I can quickly identify the best models for my project
- **Acceptance Criteria:**
  - Categories clearly labeled (Image Gen, NLP, etc.)
  - Models sorted by tier (S → D)
  - Model cards show key metrics at a glance
  - Clicking a model opens full article

**US-002: Read Detailed Model Analysis**
- **As an** AI engineer
- **I want to** read comprehensive technical articles about specific models
- **So that** I can understand capabilities, limitations, and implementation details
- **Acceptance Criteria:**
  - Article includes architecture overview, benchmarks, use cases
  - Code snippets provided with syntax highlighting
  - Links to original Hugging Face page
  - Related models suggested at end

**US-003: Get Quick Implementation Guidance**
- **As a** developer new to AI
- **I want to** find copy-paste code examples for using a model
- **So that** I can get started quickly without deep diving into documentation
- **Acceptance Criteria:**
  - Installation instructions included
  - Basic usage example provided
  - Code is tested and functional
  - Comments explain key parameters

**US-004: Search for Specific Models**
- **As a** researcher
- **I want to** search for models by name or keyword
- **So that** I can find relevant models without browsing all categories
- **Acceptance Criteria:**
  - Search bar prominently displayed
  - Real-time results as I type
  - Search works across model names, categories, tags
  - "No results" state shows suggestions

**US-005: Filter Models by Category**
- **As a** product manager
- **I want to** filter the tierlist by specific AI domains
- **So that** I can focus on models relevant to my product needs
- **Acceptance Criteria:**
  - Category filter visible on tierlist page
  - Selecting category updates view instantly
  - Model count shown per category
  - "All Categories" option available

**US-006: Share Content on LinkedIn**
- **As a** content creator
- **I want to** access pre-written LinkedIn posts about models
- **So that** I can share insights with my professional network
- **Acceptance Criteria:**
  - Simplified post included in article
  - Copy button for easy sharing
  - Post includes hashtags and CTA
  - Character count within LinkedIn limits

**US-007: View on Mobile Device**
- **As a** commuter
- **I want to** browse articles and tierlists on my phone
- **So that** I can learn about AI models during my commute
- **Acceptance Criteria:**
  - Responsive design works on all screen sizes
  - Touch-friendly navigation
  - Images load quickly
  - Text remains readable

**US-008: Compare Models in Same Tier**
- **As an** ML team lead
- **I want to** see multiple models in the same tier side-by-side
- **So that** I can make informed decisions for model selection
- **Acceptance Criteria:**
  - Models grouped visibly by tier
  - Key differentiators highlighted in cards
  - Metrics comparable across models
  - Easy navigation between articles

### 7.2 Admin User Stories

**US-009: Submit New Model for Processing**
- **As an** admin
- **I want to** add a Hugging Face URL to the processing queue
- **So that** new models are automatically analyzed and published
- **Acceptance Criteria:**
  - Simple command-line or config file URL input
  - URL validation prevents duplicates
  - Processing status visible in terminal
  - Browser opens automatically to preview

**US-010: Preview Content Before Publishing**
- **As an** admin
- **I want to** see exactly how the article will appear before publishing
- **So that** I can ensure quality and accuracy before going live
- **Acceptance Criteria:**
  - Local preview shows exact production styling
  - LinkedIn post preview in realistic interface
  - Option to regenerate sections if needed
  - Side-by-side comparison with source

**US-011: Approve and Publish Content**
- **As an** admin
- **I want to** manually approve and publish content after preview
- **So that** I maintain editorial control over published content
- **Acceptance Criteria:**
  - One-click publish button in preview interface
  - Progress indicator during upload
  - Success confirmation with live URL
  - Error handling with retry options

**US-012: Copy LinkedIn Post for Manual Sharing**
- **As an** admin
- **I want to** easily copy the generated LinkedIn post
- **So that** I can share it immediately on my professional network
- **Acceptance Criteria:**
  - One-click copy button with formatting preserved
  - Character count validation
  - Option to open LinkedIn composer
  - Toast notification confirming copy

**US-013: Monitor Local Processing Status**
- **As an** admin
- **I want to** view logs and status of local processing
- **So that** I can identify and fix issues quickly
- **Acceptance Criteria:**
  - Terminal output shows processing steps
  - Local server logs accessible
  - Preview interface shows processing status
  - Error messages with actionable solutions

---

## 8. Wireframes / Page Descriptions

### 8.1 Homepage / Blog Page

**Layout:** Grid-based article listing

**Components:**
1. **Header Navigation**
   - Logo: "TopTierModels" (left)
   - Navigation links: Home | Blog | Tierlist | About (center)
   - Search icon (right)
   - Theme toggle (dark/light mode)

2. **Hero Section**
   - Headline: "Discover the Best AI Models, Ranked"
   - Subheadline: "Comprehensive analysis and tierlists for every AI domain"
   - Featured model of the week (large card)

3. **Filter Bar**
   - Category dropdown: All | Image Gen | NLP | Vision | Audio | etc.
   - Tier filter: All Tiers | S | A | B | C | D
   - Sort by: Newest | Highest Score | Most Popular

4. **Article Grid**
   - 3 columns (desktop), 2 (tablet), 1 (mobile)
   - Each card contains:
     - Featured image (16:9 ratio)
     - Category badge (top-left)
     - Tier badge (S/A/B/C/D, top-right)
     - Model name (headline)
     - Excerpt (2 lines, truncated)
     - Read time estimate
     - "Read More" link
   - Hover effect: subtle elevation and border highlight

5. **Pagination**
   - Page numbers (1, 2, 3... 10)
   - Previous / Next buttons
   - "Showing X-Y of Z articles"

6. **Footer**
   - About section
   - Social links (GitHub, LinkedIn, Twitter)
   - Contact email
   - Data attribution: "Powered by Hugging Face"

**Visual Style:**
- Clean, modern, minimalist
- Generous whitespace
- Data-focused typography
- Accent color for tier badges
- Card-based design system

### 8.2 Tierlist Page

**Layout:** Vertical tier sections

**Components:**
1. **Header** (same as homepage)

2. **Page Title Section**
   - Headline: "AI Model Tierlist"
   - Description: "Models ranked by performance, usability, and innovation"
   - Last updated timestamp

3. **Category Tabs**
   - Horizontal tabs: All | Image Generation | Text Generation | Vision | Audio | Multimodal | Other
   - Active tab highlighted
   - Model count per category shown

4. **Search Bar**
   - Prominent search input
   - Placeholder: "Search models by name..."
   - Real-time filtering

5. **Tier Sections** (Repeated for S, A, B, C, D)
   - **Tier Header:**
     - Large tier letter (S, A, B, C, D)
     - Color-coded background
     - Score range (e.g., "90-100")
     - Model count in this tier
   
   - **Model Cards (Horizontal scroll or grid):**
     - Model icon/logo
     - Model name
     - Organization
     - Overall score badge (e.g., "87/100")
     - 3-4 key metric badges (Speed, Accuracy, etc.)
     - Hover: tooltip with quick summary
     - Click: navigate to article

6. **Empty State** (if no models in tier)
   - "No models in this tier yet"
   - Encouragement to check other categories

7. **Methodology Button**
   - "How are models scored?" link
   - Opens modal explaining scoring algorithm

**Visual Hierarchy:**
- S Tier most prominent (larger cards, gold accent)
- Gradient from S → D in visual weight
- Clear tier separation with colored dividers

### 8.3 Article Detail Page

**Layout:** Full-width article with sidebar

**Components:**
1. **Header** (same as homepage)

2. **Hero Section**
   - Full-width hero image (model example output)
   - Overlay gradient
   - Model name (large headline)
   - Category and tier badges
   - Breadcrumb: Home > Blog > Category > Article

3. **Article Metadata Bar**
   - Author name + avatar
   - Publication date
   - Read time
   - Share buttons (LinkedIn, Twitter, Copy Link)

4. **Two-Column Layout:**
   
   **Main Content (70% width):**
   - Table of contents (sticky, collapsible)
   - Article body with:
     - Section headings (H2, H3)
     - Paragraphs with optimal line length
     - Embedded images with captions
     - Code blocks with syntax highlighting and copy button
     - Blockquotes for key insights
     - Bullet lists for features
     - Performance charts/tables
   
   **Sidebar (30% width, sticky):**
   - **Model Info Card:**
     - Overall score (large number)
     - Tier badge
     - Category
     - Organization/Author
     - License
     - Downloads count
     - "View on Hugging Face" button
   
   - **Quick Metrics:**
     - Performance: 85/100
     - Usability: 90/100
     - Innovation: 88/100
     - Adoption: 92/100
     - Production: 87/100
   
   - **Quick Links:**
     - GitHub repository
     - Demo/playground
     - Documentation

5. **Code Snippet Section**
   - Tabbed interface: Installation | Basic Usage | Advanced
   - Copy button per snippet
   - Language selector (Python, JavaScript, etc.)

6. **LinkedIn Post Section**
   - Collapsible card: "Shareable LinkedIn Post"
   - Pre-written post text
   - Copy button
   - "Post to LinkedIn" button (future feature)

7. **Related Models Section**
   - "You might also like..."
   - 3-4 model cards (same category or tier)
   - Small card format with image, name, tier, score

8. **Comments/Discussion** (Future)
   - Placeholder for community engagement

**Responsive Behavior:**
- Mobile: Sidebar moves below content
- Sticky TOC collapses to hamburger menu
- Full-width images on mobile

### 8.4 Local Preview Interface

**Layout:** Two-pane preview with controls

**Components:**
1. **Header**
   - "TopTierModels Preview Studio"
   - Preview session ID and timestamp
   - Connection status indicator

2. **Left Pane - Article Preview**
   - Exact replica of production article view
   - Interactive TOC with current section highlight
   - Code blocks with working copy buttons
   - Image gallery with zoom functionality
   - Responsive view toggle (desktop/tablet/mobile)

3. **Right Pane - Controls**
   - **Publication Status:**
     - Preview-only badge
     - "Ready to publish" indicator
   
   - **LinkedIn Post Preview:**
     - Realistic LinkedIn feed mockup
     - Character counter (max 3000)
     - Hashtag validation
     - "Copy Post" button with icon
   
   - **Publication Actions:**
     - Primary "Publish to Supabase" button (green)
     - Secondary "Copy LinkedIn Post" button (blue)
     - "Regenerate Section" dropdown
     - "Export as JSON" button
     - "Discard Preview" button (red)
   
   - **Live Preview Updates:**
     - "Auto-refresh" toggle
     - "Unsaved changes" indicator
     - Keyboard shortcuts help

4. **Bottom Status Bar**
   - Processing step indicators
   - Upload progress when publishing
   - Error messages with details
   - Success confirmation with live URL

**Visual Style:**
- Developer-focused interface
- Clear distinction between preview and production
- Status colors: green (ready), yellow (processing), red (error)
- Minimal distraction from content preview

### 8.5 Search Overlay

**Triggered by:** Clicking search icon in header

**Components:**
- Full-screen overlay (semi-transparent backdrop)
- Large centered search box
- Real-time results below search box
  - Article results (title, excerpt, category)
  - Model results (name, tier, score)
  - Grouped by type
- "Esc to close" hint
- Recent searches (if implemented)

---

## 9. Acceptance Criteria

### 9.1 Local Processing Studio

**AC-001: Local Server Startup**
- ✅ Processing script starts FastAPI server on port 3001
- ✅ Server automatically opens browser to preview URL
- ✅ Server persists for entire preview session
- ✅ Clean shutdown after successful publication
- ✅ Error handling for port conflicts

**AC-002: Local Data Storage**
- ✅ All processed data saved to local SQLite database
- ✅ Images cached in local directory with proper structure
- ✅ JSON configuration files maintain session state
- ✅ Auto-save every 30 seconds
- ✅ Session recovery after unexpected shutdown

**AC-003: Preview Interface Functionality**
- ✅ Article preview matches production styling exactly
- ✅ LinkedIn post preview in realistic interface
- ✅ Interactive controls for publication
- ✅ Real-time updates via WebSocket
- ✅ Keyboard shortcuts work correctly

**AC-004: Publication Flow**
- ✅ "Publish" button triggers Supabase upload sequence
- ✅ Progress indicator shows upload status
- ✅ Error handling with retry options
- ✅ Success confirmation with live URL
- ✅ Local cleanup after successful publication

### 9.2 Pipeline Processing

**AC-005: URL Validation**
- ✅ System accepts valid Hugging Face URLs
- ✅ System rejects invalid URLs with clear error message
- ✅ System detects and prevents duplicate processing
- ✅ System logs all validation attempts

**AC-006: Web Scraping Success**
- ✅ All text content extracted from model page
- ✅ All relevant images downloaded (minimum 1, maximum 5)
- ✅ Metadata correctly parsed into structured format
- ✅ Code snippets extracted when present
- ✅ Scraping completes within 30 seconds
- ✅ Errors handled gracefully with retry logic

**AC-007: Article Generation Quality**
- ✅ Generated article is 800-1500 words
- ✅ Article includes all required sections (summary, features, benchmarks, use cases)
- ✅ Technical accuracy verified against source material
- ✅ Tone is professional and accessible
- ✅ No hallucinated information
- ✅ Proper citations to Hugging Face source

**AC-008: LinkedIn Post Generation**
- ✅ Post is 150-300 words
- ✅ Post includes hook, key points, CTA
- ✅ 3-5 relevant hashtags included
- ✅ Character count within LinkedIn limits (3000 chars)
- ✅ Tone is engaging and professional

**AC-009: Model Scoring**
- ✅ Overall score calculated (0-100)
- ✅ Tier assigned correctly (S/A/B/C/D) based on score
- ✅ Individual component scores present (performance, usability, etc.)
- ✅ Scoring methodology documented
- ✅ Scores are consistent and reproducible

### 9.3 Frontend Display

**AC-010: Blog Page Functionality**
- ✅ All published articles displayed
- ✅ Pagination works correctly (12 articles per page)
- ✅ Category filter updates results instantly
- ✅ Tier filter works correctly
- ✅ Article cards display all required information
- ✅ Clicking card navigates to article detail
- ✅ Page loads in under 2 seconds

**AC-011: Tierlist Page Functionality**
- ✅ All tiers displayed in order (S → D)
- ✅ Models grouped correctly by tier
- ✅ Category tabs filter tierlist correctly
- ✅ Search filters models in real-time
- ✅ Model cards display key metrics
- ✅ Empty tiers show appropriate message
- ✅ Clicking model opens article detail

**AC-012: Article Detail Page**
- ✅ Full article content displayed with proper formatting
- ✅ Code blocks have syntax highlighting
- ✅ Images load correctly with captions
- ✅ Sidebar displays model info and metrics
- ✅ Table of contents links to sections
- ✅ Share buttons functional
- ✅ LinkedIn post section displays correctly
- ✅ Related models displayed at end

**AC-013: Search Functionality**
- ✅ Search overlay opens when icon clicked
- ✅ Search results appear as user types (debounced)
- ✅ Results include both articles and models
- ✅ Clicking result navigates to correct page
- ✅ "No results" state displayed when appropriate
- ✅ Overlay closes on Esc key or backdrop click

**AC-014: Responsive Design**
- ✅ All pages render correctly on mobile (320px width)
- ✅ All pages render correctly on tablet (768px width)
- ✅ All pages render correctly on desktop (1440px width)
- ✅ Touch targets are minimum 44x44px
- ✅ Navigation collapses to hamburger menu on mobile
- ✅ Images scale appropriately for viewport

**AC-015: Performance**
- ✅ Lighthouse score ≥90 (Performance)
- ✅ First Contentful Paint <1 second
- ✅ Time to Interactive <3 seconds
- ✅ Images lazy load below fold
- ✅ Total bundle size <500KB (initial load)

### 9.4 Data Integrity

**AC-016: Database Operations**
- ✅ All CRUD operations function correctly
- ✅ RLS policies enforce read-only public access
- ✅ Service role key operations succeed
- ✅ Foreign key constraints enforced
- ✅ Timestamps automatically updated
- ✅ No orphaned records after deletions

**AC-017: Image Management**
- ✅ All images stored in correct buckets
- ✅ Public URLs accessible without authentication
- ✅ Thumbnails generated at correct size (300x300px)
- ✅ Image compression maintains acceptable quality
- ✅ Broken image links handled gracefully
- ✅ Storage usage stays under 1GB limit

### 9.5 Free Tier Compliance

**AC-018: Supabase Free Tier**
- ✅ Database size remains under 500MB
- ✅ Storage usage remains under 1GB
- ✅ No inactivity pause (ping service configured)
- ✅ Connection pooling prevents limit breaches
- ✅ API request patterns optimized

**AC-019: Netlify Free Tier**
- ✅ Monthly bandwidth stays under 100GB
- ✅ Build minutes stay under 300 per month
- ✅ Build time per deployment <5 minutes
- ✅ HTTPS certificate auto-renews
- ✅ CDN delivers assets globally

**AC-020: Local Processing Requirements**
- ✅ Local studio works offline for processing and preview
- ✅ No cloud dependencies during preview phase
- ✅ Minimal local resource usage (<500MB RAM)
- ✅ Cross-platform compatibility (Windows, macOS, Linux)
- ✅ Clear installation documentation

---

## 10. Future Considerations

### 10.1 Enhanced Features (Phase 2-3)

**Feature: User Authentication**
- User accounts for saving favorites
- Personalized model recommendations
- Comment and discussion system
- Contribution system for community reviews

**Feature: Advanced Search**
- Multi-faceted search (tags, licenses, model size)
- Boolean operators (AND, OR, NOT)
- Saved searches and alerts
- Search analytics

**Feature: Interactive Comparisons**
- Side-by-side model comparison tool
- Interactive benchmark visualizations
- Custom weighting for scoring criteria
- Export comparison reports

**Feature: API for Developers**
- REST API for accessing tierlist data
- Webhooks for new model notifications
- Rate-limited public endpoints
- API documentation portal

**Feature: Community Features**
- User-submitted reviews and ratings
- Discussion forums per model
- Upvoting/downvoting system
- Expert contributor badges

### 10.2 Content Expansion

**Multi-Source Support:**
- Support for additional model repositories beyond Hugging Face:
  - GitHub model releases
  - Papers with Code
  - Model Zoo repositories
  - ArXiv papers
- Unified scoring across sources

**Multi-Language Support:**
- Internationalization (i18n) infrastructure
- Translated articles (Spanish, Chinese, French)
- Localized model descriptions
- Regional model rankings

**Content Types:**
- Video walkthroughs and tutorials
- Podcast-style audio summaries
- Interactive code playgrounds
- Live demo integrations

### 10.3 Integration Enhancements

**Social Media Automation:**
- Automated LinkedIn posting via API
- Twitter/X thread generation
- Reddit post formatting
- Scheduled social media campaigns

**Workflow Automation:**
- Zapier integration for custom workflows
- Slack notifications for new models
- Email newsletter generation
- RSS feed for updates

**Analytics and Insights:**
- User engagement tracking
- Popular model trends dashboard
- Category growth analysis
- Traffic source attribution

### 10.4 Technical Improvements

**Performance Optimization:**
- Edge caching strategies
- Incremental static regeneration
- Service worker for offline access
- Optimistic UI updates

**LLM Enhancements:**
- Multi-model LLM ensemble for better quality
- Fine-tuned models for domain-specific content
- Automated fact-checking pipeline
- Version control for generated content

**Infrastructure Scaling:**
- Migration to paid tiers when needed:
  - Supabase Pro ($25/mo) at 100+ models
  - Netlify Pro ($19/mo) at 100K+ visitors
- Dedicated CI/CD pipeline
- Distributed scraping infrastructure
- Caching layer (Redis/Upstash)

**Developer Experience:**
- CLI tool for local pipeline testing
- Docker compose for full local environment
- Automated testing suite
- Contribution guidelines for open source

### 10.5 Business Model (Long-term)

**Potential Revenue Streams:**
- Premium tier with advanced features ($9/mo)
- Sponsored model placements
- API access for enterprises
- White-label solutions for companies
- Affiliate links for model hosting services

**Community Engagement:**
- Open source contributions
- Model developer partnerships
- Academic research collaborations
- Conference presentations and workshops

### 10.6 Compliance and Legal

**Future Requirements:**
- GDPR compliance for EU users
- Cookie consent management
- Privacy policy and terms of service
- Content moderation policies
- Intellectual property guidelines
- Data retention policies

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **Artifact** | Generated content from the pipeline (article, post, scores) |
| **Hugging Face** | Platform hosting AI models and datasets |
| **LLM** | Large Language Model used for content generation |
| **Model Card** | Metadata and documentation for an AI model |
| **RLS** | Row Level Security in Supabase for access control |
| **Service Role Key** | Supabase admin key for backend operations |
| **Tierlist** | Ranking system with categories S, A, B, C, D |
| **Anon Key** | Supabase public key safe for frontend use |
| **Build Hook** | Webhook URL to trigger Netlify deployment |
| **SSG** | Static Site Generation for pre-rendered pages |
| **ISR** | Incremental Static Regeneration for fresh content |
| **Local Studio** | Local processing environment with preview system |
| **Preview Session** | Temporary local instance for content review |
| **WYSIWYG** | What You See Is What You Get (exact preview) |

---

## 12. Appendices

### Appendix A: Enhanced Example Model Processing Flow

**Input:** `https://huggingface.co/Tongyi-MAI/Z-Image-Turbo`

**Step 1: Local Processing**
```bash
# Command line execution
python process_model.py --url "https://huggingface.co/Tongyi-MAI/Z-Image-Turbo"

# Script output:
# 1. Validating URL... ✓
# 2. Scraping content... ✓ (15 seconds)
# 3. Generating article... ✓ (45 seconds)
# 4. Calculating scores... ✓ (5 seconds)
# 5. Starting local server on port 3001... ✓
# 6. Opening browser to http://localhost:3001/preview/abc123... ✓
```

**Step 2: Local Preview**
- Browser opens to local preview interface
- Admin reviews article in left pane
- Admin reviews LinkedIn post in right pane
- Admin verifies scores and tier assignment
- Admin makes any necessary adjustments

**Step 3: Publication**
- Admin clicks "Publish to Supabase"
- Progress bar shows:
  - Uploading images (0/3)... ✓
  - Inserting model data... ✓
  - Creating article... ✓
  - Updating tierlist... ✓
- Success message: "Published! View live at https://toptiermodels.com/models/z-image-turbo"

**Step 4: Live Site**
- Netlify rebuild triggered automatically
- New content appears on live site within 2-3 minutes
- LinkedIn post ready for sharing via copy button

### Appendix B: Local Studio Architecture

```
Local Processing Studio Structure:
├── process_model.py              # Main entry point
├── local_server.py               # FastAPI server (port 3001)
├── preview_interface/            # React preview app
│   ├── src/
│   │   ├── components/           # Same as production components
│   │   ├── pages/
│   │   │   ├── PreviewPage.jsx   # Main preview interface
│   │   │   └── PreviewControls.jsx
│   │   └── App.jsx
├── data/
│   ├── local.db                  # SQLite database
│   ├── sessions/                 # Preview session data
│   └── cache/                    # Image cache
├── config/
│   ├── prompts/                  # LLM prompt templates
│   └── settings.json             # Local configuration
└── modules/
    ├── scraper.py               # Web scraping module
    ├── llm_processor.py         # LLM content generation
    ├── scoring_engine.py        # Model scoring
    └── uploader.py              # Supabase upload (triggered manually)
```

### Appendix C: Scoring Algorithm

**Overall Score Calculation:**
```
Overall Score = (Performance × 0.30) + 
                (Usability × 0.25) + 
                (Innovation × 0.20) + 
                (Adoption × 0.15) + 
                (Production × 0.10)
```

**Tier Assignment:**
- **S Tier:** 90-100 (Exceptional, industry-leading)
- **A Tier:** 80-89 (Excellent, highly recommended)
- **B Tier:** 70-79 (Good, solid choice)
- **C Tier:** 60-69 (Adequate, situational use)
- **D Tier:** 0-59 (Limited, not recommended)

### Appendix D: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Local Processing | Python + FastAPI | 3.11+ / 0.104+ | Local studio server |
| Local Database | SQLite | 3.40+ | Local session storage |
| Preview Interface | React + Vite | 18+ / 5+ | Local preview UI |
| Production Frontend | Next.js or Vite+React | 14+ / 5+ | Web application |
| Styling | Tailwind CSS | 3+ | Utility-first CSS |
| Database | Supabase PostgreSQL | Latest | Production data storage |
| Storage | Supabase Storage | Latest | Image hosting |
| Hosting | Netlify | Free Tier | Static site hosting |
| Scraping | BeautifulSoup4 + requests | Latest | Web scraping |
| LLM | Ollama/OpenAI/Claude | Latest | Content generation |
| Version Control | Git + GitHub | Latest | Code management |

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-09 | Product Team | Initial PRS with free-tier optimization |
| 2.0 | [Current Date] | Product Team | Added Local Processing Studio with Preview System |

**Approvals:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Manager | ___________ | ___________ | _____ |
| Tech Lead | ___________ | ___________ | _____ |
| Stakeholder | ___________ | ___________ | _____ |

**Next Steps:**
1. Technical review of local studio architecture
2. Development of FastAPI local server component
3. Creation of preview interface React components
4. Integration of local SQLite storage
5. Testing of complete local-to-cloud publication flow
6. Documentation for local studio setup and usage

---
