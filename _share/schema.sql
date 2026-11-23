-- Quyền xem trang của khách ngoài (người không phải team, _share/lib.js isTeam), mỗi (trang, email) 1 dòng.
-- status: pending (chờ duyệt) · approved (xem được tới khi thu hồi) · rejected (bị từ chối) · revoked (đã thu hồi).
-- Khách xin lại sau khi bị từ chối / thu hồi thì dòng cũ quay về pending.
CREATE TABLE IF NOT EXISTS share_grants (
  id TEXT PRIMARY KEY,
  page TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL,
  reason TEXT,
  requested_at TEXT NOT NULL,
  decided_at TEXT,
  decided_by TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS share_grants_page_email ON share_grants (page, email);

-- Người xem mọi trang, chỉ dùng khi site đặt biến TEAM_LIST = "d1" (bigate-docs-html, CLAUDE.md §11). Email chữ thường.
CREATE TABLE IF NOT EXISTS share_team (
  email TEXT PRIMARY KEY,
  added_at TEXT NOT NULL
);
