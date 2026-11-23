#!/usr/bin/env bash
# Kiểm tra thẻ owner trong <head> (CLAUDE.md §4, §6, §13):
#   <meta name="owner" content="<email>@pancake.vn">
# Kiểm 2 nhóm trang: trang HTML mới (chưa có trên origin/main) và mọi trang có thẻ <meta name="share" content="guest">.
# Chạy trước khi push: bash _share/check-owner.sh
# Thiếu owner → in danh sách trang, thoát mã 1; không đọc được origin/main → thoát mã 2; đủ → thoát mã 0.
set -uo pipefail
cd "$(git rev-parse --show-toplevel)" || exit 2
git fetch -q origin main 2>/dev/null || echo "Cảnh báo: không tải được origin/main, so với bản đã tải lần trước" >&2
git rev-parse -q --verify origin/main >/dev/null || { echo "Không có origin/main: không biết trang nào là trang mới" >&2; exit 2; }

list=$(mktemp)
raw=$(mktemp)
trap 'rm -f "$list" "$raw"' EXIT
# --no-renames: file đổi tên cũng tính là trang mới; core.quotePath=false: tên có dấu tiếng Việt không bị đổi thành \ooo
# Ghi ra file riêng từng lệnh (không qua pipe) để lỗi của git dừng được script
git -c core.quotePath=false diff --no-renames --name-only --diff-filter=A origin/main -- '*.html' > "$raw" || exit 2
git -c core.quotePath=false ls-files --others --exclude-standard -- '*.html' >> "$raw" || exit 2
grep -v -E '^(sample|skills|_share|_comments|_history|_theme|functions)/' "$raw" > "$list"
# Trang đang chia sẻ cho khách (có thẻ share, kể cả file chưa commit)
# Chỉ dòng bắt đầu bằng thẻ (thẻ nằm trong comment <!-- --> không tính, giống _share/lib.js)
git -c core.quotePath=false grep -l --untracked -E '^[[:space:]]*<meta name="share" content="guest">' -- '*.html' ':!sample/*' >> "$list"
[ $? -le 1 ] || exit 2

missing=0
checked=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  if [ ! -f "$f" ]; then
    continue # file đã xoá trong nhánh này
  fi
  checked=$((checked + 1))
  if ! sed -n '1,/<\/head>/Ip' "$f" | grep -q -E '<meta name="owner" content="[a-z0-9._%+-]+@pancake\.vn">'; then
    echo "Thiếu owner: $f"
    missing=1
  fi
done < <(sort -u "$list")

if [ "$missing" = 1 ]; then
  echo 'Thêm vào <head> của từng trang trên: <meta name="owner" content="<email>@pancake.vn"> (email người phụ trách trang).'
  exit 1
fi
echo "Đủ owner: $checked trang (trang mới + trang có thẻ share)."
