$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$bucket = "art.solofarm.ru"
$endpoint = "https://storage.yandexcloud.net"

Push-Location $repoRoot
try {
  npm run build:showcase

  aws --endpoint-url $endpoint s3 website "s3://$bucket/" --index-document index.html --error-document 404.html
  aws --endpoint-url $endpoint s3 sync "apps/showcase/out" "s3://$bucket" --delete --acl public-read
}
finally {
  Pop-Location
}
