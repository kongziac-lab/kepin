-- ─────────────────────────────────────────────────────────────
-- Kepin — Initial Schema
-- ─────────────────────────────────────────────────────────────

-- Enable pgvector for passport embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Enum ─────────────────────────────────────────────────────
CREATE TYPE role AS ENUM ('admin', 'partner', 'student');

-- ── partners ─────────────────────────────────────────────────
CREATE TABLE partners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  country       TEXT,
  contact_name  TEXT,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  status        TEXT NOT NULL DEFAULT 'invited',
  nominations   INT NOT NULL DEFAULT 0,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── students ─────────────────────────────────────────────────
CREATE TABLE students (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  profile_id UUID,                     -- filled after first login
  name_en    TEXT,
  name_ko    TEXT,
  email      TEXT UNIQUE NOT NULL,
  major      TEXT,
  grade      TEXT,
  status     TEXT NOT NULL DEFAULT 'application_pending',
  intake     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── profiles (mirrors auth.users, adds role) ─────────────────
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email      TEXT NOT NULL,
  role       role NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── invitations ──────────────────────────────────────────────
CREATE TABLE invitations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  role       role NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL,            -- admin auth.users id
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email)
);

-- ── passport_embeddings ──────────────────────────────────────
CREATE TABLE passport_embeddings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  passport_number TEXT,
  name_en         TEXT,
  birth_date      TEXT,
  nationality     TEXT,
  expiry_date     TEXT,
  gender          TEXT,
  raw_text        TEXT,
  embedding       vector(1536),        -- text-embedding-3-small
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id)
);

CREATE INDEX ON passport_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ── auto-create profile on first sign-in ─────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  inv invitations%ROWTYPE;
BEGIN
  SELECT * INTO inv FROM invitations WHERE email = NEW.email LIMIT 1;

  IF FOUND THEN
    INSERT INTO profiles (id, email, role, partner_id, student_id)
    VALUES (NEW.id, NEW.email, inv.role, inv.partner_id, inv.student_id);

    -- link student record
    IF inv.student_id IS NOT NULL THEN
      UPDATE students SET profile_id = NEW.id WHERE id = inv.student_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_embeddings ENABLE ROW LEVEL SECURITY;

-- profiles: own row only
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (auth.uid() = id);

-- admin service role bypasses RLS (use service-role key server-side)

-- partners: admins full access; partners read own row
CREATE POLICY "partners_admin" ON partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "partners_self_read" ON partners
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'partner' AND partner_id = partners.id
    )
  );

-- students: admins + owning partner full access; students read own
CREATE POLICY "students_admin" ON students
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "students_partner" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'partner' AND partner_id = students.partner_id
    )
  );
CREATE POLICY "students_self" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'student' AND student_id = students.id
    )
  );

-- passport_embeddings: student owns, admin reads all
CREATE POLICY "passport_student" ON passport_embeddings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND student_id = passport_embeddings.student_id
    )
  );
CREATE POLICY "passport_admin" ON passport_embeddings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
