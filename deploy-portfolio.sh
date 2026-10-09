#!/bin/bash
set -euo pipefail

TARGET_DIR="/var/www/anikgfauzul.com"
SRC_DIR="/home/anikgfauzul/portfolio_deploy"
CF="/etc/caddy/Caddyfile"

echo "[1/4] Menyiapkan direktori $TARGET_DIR..."
mkdir -p "$TARGET_DIR"
cp -r "$SRC_DIR"/* "$TARGET_DIR"/
chown -R anikgfauzul:anikgfauzul "$TARGET_DIR"
chmod -R 755 "$TARGET_DIR"

echo "[2/4] Menyiapkan konfigurasi Caddy..."
if grep -q "anikgfauzul.com {" "$CF"; then
    echo "Blok anikgfauzul.com sudah ada di Caddyfile."
else
    BAK="$CF.bak-portfolio-$(date +%Y%m%d-%H%M%S)"
    cp -p "$CF" "$BAK"
    echo "Backup Caddyfile dibuat di $BAK"

    cat >> "$CF" << 'CADDY'

# Portfolio - Anik G Fauzul
anikgfauzul.com {
    root * /var/www/anikgfauzul.com
    encode zstd gzip
    file_server
}

www.anikgfauzul.com {
    redir https://anikgfauzul.com{uri} permanent
}
CADDY
fi

echo "[3/4] Validasi Caddyfile..."
if ! caddy validate --config "$CF" --adapter caddyfile; then
    echo "ERROR: Validasi Caddyfile gagal! Mengembalikan backup jika ada..."
    [ -n "${BAK:-}" ] && cp -p "$BAK" "$CF"
    exit 1
fi

echo "[4/4] Reload Caddy service..."
systemctl reload caddy

echo "============================================="
echo "BERHASIL! Portfolio aktif di https://anikgfauzul.com"
echo "============================================="
