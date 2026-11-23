-- Góp ý trên trang HTML. Góp ý gốc có selector + quote (đoạn được bôi đen); trả lời có parent_id, không có selector.
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  parent_id TEXT,
  selector TEXT,
  quote TEXT,
  body TEXT NOT NULL,
  author_email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  resolved_at TEXT,
  resolved_by TEXT
);
CREATE INDEX IF NOT EXISTS comments_page_created ON comments (page, created_at);
CREATE INDEX IF NOT EXISTS comments_parent ON comments (parent_id);
