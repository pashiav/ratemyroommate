-- Table to track email changes for users, maintaining history of previous emails
-- and associated school affiliations for audit and recovery purposes
CREATE TABLE public.email_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  previous_email text NOT NULL CHECK (previous_email = lower(previous_email)),
  previous_school_id uuid,
  changed_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT email_history_pkey PRIMARY KEY (id),
  CONSTRAINT email_history_previous_school_id_fkey FOREIGN KEY (previous_school_id) REFERENCES public.schools(school_id),
  CONSTRAINT email_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
-- Table to store verified housing/apartment information for different schools
-- Includes location data, verification status, and creation tracking
CREATE TABLE public.housing (
  housing_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  housing_name text NOT NULL,
  school_id uuid NOT NULL,
  latitude numeric,
  longitude numeric,
  is_verified boolean NOT NULL DEFAULT false,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone,
  created_by_user_id text NOT NULL,
  CONSTRAINT housing_pkey PRIMARY KEY (housing_id),
  CONSTRAINT housing_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(user_id),
  CONSTRAINT housing_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id)
);
-- Table to store user-submitted housing suggestions that are pending review
-- Allows community-driven housing discovery before official verification
CREATE TABLE public.housing_suggestions (
  suggestion_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  suggested_housing_name text NOT NULL,
  school_id uuid NOT NULL,
  latitude numeric,
  longitude numeric,
  suggested_by_user_id text NOT NULL,
  is_reviewed boolean NOT NULL DEFAULT false,
  is_approved boolean,
  reviewed_at timestamp with time zone,
  deleted_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT housing_suggestions_pkey PRIMARY KEY (suggestion_id),
  CONSTRAINT housing_suggestions_suggested_by_user_id_fkey FOREIGN KEY (suggested_by_user_id) REFERENCES public.users(user_id),
  CONSTRAINT housing_suggestions_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id)
);
-- Table to store roommate reviews with detailed ratings and compatibility metrics
-- Includes comprehensive feedback on living habits, pet policies, and overall experience
CREATE TABLE public.reviews (
  rv_id uuid NOT NULL DEFAULT gen_random_uuid(),
  rm_id uuid NOT NULL,
  school_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  rating smallint NOT NULL,
  would_recommend boolean NOT NULL,
  has_pets boolean NOT NULL,
  pet_friendly text CHECK (pet_friendly IS NULL OR (pet_friendly = ANY (ARRAY['yes'::text, 'no'::text, 'n/a'::text]))),
  years_lived text NOT NULL CHECK (years_lived = ANY (ARRAY['<1'::text, '1'::text, '2'::text, '3+'::text])),
  comments text NOT NULL,
  housing_id uuid NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamp with time zone,
  unit_suffix USER-DEFINED NOT NULL,
  reported_count integer DEFAULT 0,
  updated_at timestamp with time zone,
  noise_level smallint NOT NULL CHECK (noise_level >= 1 AND noise_level <= 5),
  cleanliness smallint NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
  communication smallint NOT NULL CHECK (communication >= 1 AND communication <= 5),
  responsibility smallint NOT NULL CHECK (responsibility >= 1 AND responsibility <= 5),
  sleep_pattern text NOT NULL CHECK (sleep_pattern = ANY (ARRAY['early'::text, 'late'::text, 'variable'::text])),
  guest_frequency text NOT NULL CHECK (guest_frequency = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  study_compatibility text NOT NULL CHECK (study_compatibility = ANY (ARRAY['yes'::text, 'somewhat'::text, 'no'::text])),
  pet_type text,
  pet_impact text CHECK (pet_impact IS NULL OR (pet_impact = ANY (ARRAY['minimal'::text, 'moderate'::text, 'significant'::text]))),
  CONSTRAINT reviews_pkey PRIMARY KEY (rv_id),
  CONSTRAINT reviews_housing_id_fkey FOREIGN KEY (housing_id) REFERENCES public.housing(housing_id),
  CONSTRAINT reviews_rm_id_fkey FOREIGN KEY (rm_id) REFERENCES public.roommates(rm_id),
  CONSTRAINT reviews_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id)
);
-- Table to store roommate profiles with basic identification information
-- Links roommates to specific schools and tracks creation/deletion status
CREATE TABLE public.roommates (
  rm_id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  is_deleted boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  full_name text DEFAULT ((first_name || ' '::text) || last_name),
  updated_at timestamp with time zone,
  created_by_user_id text,
  CONSTRAINT roommates_pkey PRIMARY KEY (rm_id),
  CONSTRAINT roommates_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id),
  CONSTRAINT roommates_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(user_id)
);
-- Table to store supported schools/universities with their domain information
-- Serves as a lookup table for user authentication and content organization
CREATE TABLE public.schools (
  domain text NOT NULL DEFAULT ''::text UNIQUE,
  school_name text NOT NULL DEFAULT ''::text,
  school_slug text NOT NULL DEFAULT ''::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  school_id uuid NOT NULL DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT schools_pkey PRIMARY KEY (school_id)
);
-- Table to store user account information and preferences
-- Manages user authentication, privacy terms acceptance, and school affiliations
CREATE TABLE public.users (
  user_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  accepted_privacy_terms boolean NOT NULL DEFAULT false,
  privacy_terms_accepted_at timestamp with time zone,
  requested_account_deletion boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  school_id uuid,
  last_login timestamp with time zone,
  deletion_requested_at timestamp with time zone,
  updated_at timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(school_id)
);
