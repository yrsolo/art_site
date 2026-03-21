$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$bucket = "art.solofarm.ru"
$snapshotBucket = $env:OBJECT_STORAGE_BUCKET
$endpoint = "https://storage.yandexcloud.net"
$snapshotKey = "private/data/export/public-site.json"
$generatedDir = Join-Path $repoRoot "apps\\showcase\\src\\generated"
$generatedSnapshot = Join-Path $generatedDir "public-site.json"

Push-Location $repoRoot
try {
  New-Item -ItemType Directory -Force -Path $generatedDir | Out-Null

  if (-not $snapshotBucket) {
    $snapshotBucket = "art-site"
  }

  try {
    aws --endpoint-url $endpoint s3 cp "s3://$snapshotBucket/$snapshotKey" $generatedSnapshot | Out-Null
  }
  catch {
    Write-Host "showcase snapshot not found in bucket, using local fallback data"
  }

  npm run build:showcase

  aws --endpoint-url $endpoint s3 website "s3://$bucket/" --index-document index.html --error-document 404.html
  aws --endpoint-url $endpoint s3 sync "apps/showcase/out" "s3://$bucket" --delete --acl public-read
}
finally {
  Pop-Location
}
