$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$bucket = $env:ADMIN_OBJECT_STORAGE_BUCKET
$endpoint = $env:OBJECT_STORAGE_ENDPOINT

if (-not $bucket) {
  $bucket = "admin.art.solofarm.ru"
}

if (-not $endpoint) {
  $endpoint = "https://storage.yandexcloud.net"
}

Push-Location $repoRoot
try {
  npm run build:admin
  aws --endpoint-url $endpoint s3 website "s3://$bucket/" --index-document index.html --error-document 404.html
  aws --endpoint-url $endpoint s3 sync "apps/admin/out" "s3://$bucket" --delete --acl public-read
}
finally {
  Pop-Location
}
