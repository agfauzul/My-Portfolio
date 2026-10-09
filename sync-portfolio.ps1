# Script untuk update cepat portfolio ke VPS
Write-Host "Mengompresi file website..." -ForegroundColor Cyan
tar -czf portfolio_update.tar.gz -C website .

Write-Host "Mengunggah ke VPS..." -ForegroundColor Cyan
scp portfolio_update.tar.gz vps:/tmp/portfolio_update.tar.gz

Write-Host "Mengekstrak ke /var/www/anikgfauzul.com..." -ForegroundColor Cyan
ssh vps "tar -xzf /tmp/portfolio_update.tar.gz -C /var/www/anikgfauzul.com/ && rm -f /tmp/portfolio_update.tar.gz"

Remove-Item portfolio_update.tar.gz
Write-Host "Berhasil! Perubahan sudah aktif di https://anikgfauzul.com" -ForegroundColor Green
