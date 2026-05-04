-- ============================================================
-- KREWSTAGE — Schema completa
-- Ruleaza TOT in Supabase > SQL Editor > New Query > Run
-- O singura executie, nu rula de mai multe ori.
-- ============================================================

-- 1. PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  city TEXT,
  country TEXT DEFAULT 'RO',

  -- Roluri muzicale (poate avea mai multe)
  roles TEXT[] DEFAULT '{}',
  -- vocalist | guitarist | bassist | drummer | keys | producer | composer | lyricist | dj | engineer

  -- Instrumente cu nivel
  instruments TEXT[] DEFAULT '{}',
  instrument_levels JSONB DEFAULT '{}',   -- { "Guitar": "Advanced" }

  -- Genuri muzicale
  genres TEXT[] DEFAULT '{}',

  -- Experienta
  experience_level TEXT DEFAULT 'intermediate', -- beginner | intermediate | professional

  -- Disponibilitate
  available_days TEXT[] DEFAULT '{}',
  available_time TEXT DEFAULT '',
  open_to_collaborate BOOLEAN DEFAULT true,

  -- Social links
  social_youtube TEXT DEFAULT '',
  social_instagram TEXT DEFAULT '',
  social_soundcloud TEXT DEFAULT '',
  social_spotify TEXT DEFAULT '',
  social_tiktok TEXT DEFAULT '',
  website TEXT DEFAULT '',

  -- Media
  avatar_url TEXT,

  -- Stats (actualizate prin triggers)
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  projects_count INT DEFAULT 0,

  -- Pro subscription
  is_pro BOOLEAN DEFAULT false,
  pro_until TIMESTAMPTZ,

  -- Venue specific (activ doar daca roles contine 'venue')
  is_venue BOOLEAN DEFAULT false,
  venue_name TEXT,
  venue_type TEXT,         -- Bar / Club / Concert Hall / etc.
  venue_capacity INT,
  venue_website TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VIDEOS (Cloudflare Stream)
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  cloudflare_video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'processing',  -- processing | ready | error
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AUDIO DEMOS (Cloudflare R2)
CREATE TABLE audio_demos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  r2_key TEXT NOT NULL,           -- calea fisierului in R2
  r2_url TEXT NOT NULL,           -- URL public R2
  title TEXT NOT NULL,
  description TEXT,
  duration_seconds INT,
  file_size_bytes INT,
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROJECTS (proiecte muzicale cu stadii)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  mood TEXT,          -- chill | energetic | dark | uplifting | emotional
  status TEXT DEFAULT 'open',  -- open | in_progress | completed | cancelled

  -- Tipul proiectului
  project_type TEXT DEFAULT 'collab',
  -- collab | live_gig | band_search | session

  -- Remote sau Local
  location_type TEXT DEFAULT 'both',
  -- remote | local | both
  location_city TEXT,   -- completat daca e local

  -- Ce cauta owner-ul
  roles_needed TEXT[] DEFAULT '{}',
  -- vocalist | guitarist | bassist | drummer | keys | producer | composer | lyricist | dj | engineer | venue

  -- Fisiere atasate
  demo_audio_url TEXT,   -- demo R2
  demo_audio_key TEXT,
  reference_links TEXT[] DEFAULT '{}',  -- YouTube / SoundCloud links

  -- Collaborators acceptati (user IDs)
  collaborator_ids UUID[] DEFAULT '{}',

  -- Vizibilitate
  is_featured BOOLEAN DEFAULT false,

  views_count INT DEFAULT 0,
  applications_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROJECT APPLICATIONS (candidaturi la proiecte)
CREATE TABLE project_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role_offered TEXT NOT NULL,      -- ce rol ofera candidatul
  message TEXT,                    -- mesaj de intentie
  demo_url TEXT,                   -- link demo (audio R2 sau extern)
  status TEXT DEFAULT 'pending',   -- pending | accepted | rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, applicant_id)
);

-- 6. PROJECT MESSAGES (chat privat per proiect)
CREATE TABLE project_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BANDS (trupe)
CREATE TABLE bands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  city TEXT,
  cover_color TEXT DEFAULT '#ff6b35',
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_looking_for_members BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BAND_MEMBERS
CREATE TABLE band_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  band_id UUID REFERENCES bands(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member',   -- owner | member
  instrument TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(band_id, user_id)
);

-- 9. CONVERSATIONS (mesaje directe 1-la-1)
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_a UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant_b UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant_a, participant_b)
);

-- 10. MESSAGES (mesaje directe)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. FOLLOWS
CREATE TABLE follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- 12. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  -- message | project_application | application_accepted | application_rejected
  -- band_invite | new_follower | project_completed
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_roles ON profiles USING GIN(roles);
CREATE INDEX idx_profiles_genres ON profiles USING GIN(genres);
CREATE INDEX idx_profiles_open ON profiles(open_to_collaborate);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_audio_demos_user_id ON audio_demos(user_id);
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_genre ON projects(genre);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_location ON projects(location_type);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_project_applications_project_id ON project_applications(project_id);
CREATE INDEX idx_project_applications_applicant_id ON project_applications(applicant_id);
CREATE INDEX idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX idx_bands_owner_id ON bands(owner_id);
CREATE INDEX idx_band_members_band_id ON band_members(band_id);
CREATE INDEX idx_band_members_user_id ON band_members(user_id);
CREATE INDEX idx_conversations_participant_a ON conversations(participant_a);
CREATE INDEX idx_conversations_participant_b ON conversations(participant_b);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- VIDEOS
CREATE POLICY "Public videos" ON videos FOR SELECT USING (true);
CREATE POLICY "Insert own videos" ON videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update own videos" ON videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own videos" ON videos FOR DELETE USING (auth.uid() = user_id);

-- AUDIO DEMOS
CREATE POLICY "Public audio demos" ON audio_demos FOR SELECT USING (true);
CREATE POLICY "Insert own audio" ON audio_demos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own audio" ON audio_demos FOR DELETE USING (auth.uid() = user_id);

-- PROJECTS
CREATE POLICY "Public projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Authenticated can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner updates project" ON projects FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner deletes project" ON projects FOR DELETE USING (auth.uid() = owner_id);

-- PROJECT APPLICATIONS
CREATE POLICY "Owner and applicant see applications" ON project_applications FOR SELECT
  USING (auth.uid() = applicant_id OR EXISTS (
    SELECT 1 FROM projects WHERE id = project_id AND owner_id = auth.uid()
  ));
CREATE POLICY "Authenticated can apply" ON project_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Owner updates application status" ON project_applications FOR UPDATE
  USING (auth.uid() = applicant_id OR EXISTS (
    SELECT 1 FROM projects WHERE id = project_id AND owner_id = auth.uid()
  ));
CREATE POLICY "Applicant withdraws" ON project_applications FOR DELETE
  USING (auth.uid() = applicant_id);

-- PROJECT MESSAGES (doar owner + colaboratori acceptati)
CREATE POLICY "Collaborators see project messages" ON project_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR auth.uid() = ANY(p.collaborator_ids))
  ));
CREATE POLICY "Collaborators send project messages" ON project_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM projects p WHERE p.id = project_id
    AND (p.owner_id = auth.uid() OR auth.uid() = ANY(p.collaborator_ids))
  ));

-- BANDS
CREATE POLICY "Public bands" ON bands FOR SELECT USING (true);
CREATE POLICY "Create band" ON bands FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner edits band" ON bands FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner deletes band" ON bands FOR DELETE USING (auth.uid() = owner_id);

-- BAND MEMBERS
CREATE POLICY "Public band members" ON band_members FOR SELECT USING (true);
CREATE POLICY "Owner adds members" ON band_members FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bands WHERE id = band_id AND owner_id = auth.uid()) OR auth.uid() = user_id);
CREATE POLICY "Owner or member removes" ON band_members FOR DELETE
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM bands WHERE id = band_id AND owner_id = auth.uid()));

-- CONVERSATIONS
CREATE POLICY "Participants see conversation" ON conversations FOR SELECT
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);
CREATE POLICY "Create conversation" ON conversations FOR INSERT
  WITH CHECK (auth.uid() = participant_a OR auth.uid() = participant_b);
CREATE POLICY "Participants update conversation" ON conversations FOR UPDATE
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

-- MESSAGES
CREATE POLICY "Participants see messages" ON messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id
    AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())));
CREATE POLICY "Participants send messages" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversations c WHERE c.id = conversation_id
    AND (c.participant_a = auth.uid() OR c.participant_b = auth.uid())));

-- FOLLOWS
CREATE POLICY "Public follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Follow" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- NOTIFICATIONS
CREATE POLICY "Own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Mark read" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Delete own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true), ('audio-demos', 'audio-demos', true)
  ON CONFLICT (id) DO NOTHING;

-- Avatars
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Upload avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Update avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Delete avatar" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Audio demos
CREATE POLICY "Public audio read" ON storage.objects FOR SELECT USING (bucket_id = 'audio-demos');
CREATE POLICY "Upload audio" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-demos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Delete audio" ON storage.objects FOR DELETE
  USING (bucket_id = 'audio-demos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER trg_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER trg_bands_updated_at BEFORE UPDATE ON bands FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER trg_applications_updated_at BEFORE UPDATE ON project_applications FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Follow counts
CREATE OR REPLACE FUNCTION public.handle_follow_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON follows FOR EACH ROW EXECUTE FUNCTION handle_follow_change();

-- Project application count
CREATE OR REPLACE FUNCTION public.handle_application_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET applications_count = applications_count + 1 WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET applications_count = GREATEST(0, applications_count - 1) WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_application_change
  AFTER INSERT OR DELETE ON project_applications FOR EACH ROW EXECUTE FUNCTION handle_application_change();

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE videos;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE project_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE project_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;

-- ============================================================
-- SECURITATE: Protejeaza campurile is_pro si pro_until
-- Utilizatorii nu pot seta is_pro = true singuri
-- ============================================================
CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_pro := OLD.is_pro;
  NEW.pro_until := OLD.pro_until;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER protect_profile_pro_fields
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  WHEN (NEW.is_pro IS DISTINCT FROM OLD.is_pro OR NEW.pro_until IS DISTINCT FROM OLD.pro_until)
  EXECUTE FUNCTION protect_sensitive_profile_fields();

-- ============================================================
-- SECURITATE: Anti-spam notificari — max 10/minut per actor
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_notification_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INT;
BEGIN
  IF NEW.actor_id IS NULL THEN RETURN NEW; END IF;
  SELECT COUNT(*) INTO recent_count
  FROM notifications
  WHERE actor_id = NEW.actor_id
    AND created_at > NOW() - INTERVAL '1 minute';
  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit: too many notifications sent recently';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notification_rate_limit
  BEFORE INSERT ON notifications
  FOR EACH ROW EXECUTE FUNCTION check_notification_rate_limit();

-- ============================================================
-- SECURITATE: Band join — nu te poti alatura unei trupe
-- care nu cauta membri (is_looking_for_members = false)
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_band_join_allowed()
RETURNS TRIGGER AS $$
DECLARE
  band_open BOOLEAN;
  band_owner UUID;
BEGIN
  SELECT is_looking_for_members, owner_id INTO band_open, band_owner
  FROM bands WHERE id = NEW.band_id;
  IF band_owner = auth.uid() THEN RETURN NEW; END IF;
  IF NOT band_open THEN
    RAISE EXCEPTION 'This band is not currently looking for new members';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER band_join_check
  BEFORE INSERT ON band_members
  FOR EACH ROW EXECUTE FUNCTION check_band_join_allowed();

-- ============================================================
-- CLEANUP: audio orfane demo la stergerea proiectului
-- Supabase Storage nu poate fi apelat direct din SQL, asa ca
-- logam demo_audio_key intr-un tabel de cleanup si procesam
-- periodic (sau la cerere) prin Edge Function / script.
-- ============================================================
CREATE TABLE IF NOT EXISTS storage_cleanup_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket TEXT NOT NULL,
  file_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE storage_cleanup_queue ENABLE ROW LEVEL SECURITY;
-- Doar service role poate accesa (cleanup script-uri server-side)
CREATE POLICY "Service role only" ON storage_cleanup_queue USING (false);

-- Trigger: cand un proiect cu demo audio este sters,
-- adauga fisierul in coada de cleanup
CREATE OR REPLACE FUNCTION public.handle_project_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.demo_audio_key IS NOT NULL AND OLD.demo_audio_key != '' THEN
    INSERT INTO storage_cleanup_queue (bucket, file_key)
    VALUES ('audio-demos', OLD.demo_audio_key);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_project_delete
  BEFORE DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_project_delete();

-- ============================================================
-- DONE. KrewStage schema applied successfully.
-- ============================================================
