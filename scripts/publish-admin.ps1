$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$bucket = $env:ADMIN_OBJECT_STORAGE_BUCKET
$endpoint = $env:OBJECT_STORAGE_ENDPOINT
$apiBaseUrl = $env:NEXT_PUBLIC_API_BASE_URL
$certificateId = $env:ADMIN_BUCKET_CERTIFICATE_ID

if (-not $bucket) {
  $bucket = "admin.art.solofarm.ru"
}

if (-not $endpoint) {
  $endpoint = "https://storage.yandexcloud.net"
}

Push-Location $repoRoot
try {
  if (-not $apiBaseUrl) {
    $apiBaseUrl = "https://api.art.solofarm.ru"
  }

  $bucketExists = yc storage bucket list --format json | ConvertFrom-Json | Where-Object { $_.name -eq $bucket }
  if (-not $bucketExists) {
    yc storage bucket create --name $bucket | Out-Null
  }

  $env:NEXT_PUBLIC_API_BASE_URL = $apiBaseUrl
  $env:NEXT_PUBLIC_ADMIN_BASE_URL = "https://$bucket"
  npm run build:admin

  $websiteConfigFile = Join-Path $env:TEMP "art-site-admin-website.json"
  [System.IO.File]::WriteAllText(
    $websiteConfigFile,
    '{"index":"index.html","error":"404.html"}',
    (New-Object System.Text.UTF8Encoding($false))
  )
  yc storage bucket update $bucket --website-settings-from-file $websiteConfigFile | Out-Null

  if ($certificateId) {
    yc storage bucket set-https $bucket --certificate-id $certificateId | Out-Null
  }

  aws --endpoint-url $endpoint s3 sync "apps/admin/out" "s3://$bucket" --delete --acl public-read
}
finally {
  Pop-Location
}
