param(
  [string]$RegistryId = "crp5tssh5qkdk7mgcilj",
  [string]$ImageName = "art-site/web",
  [string]$ContainerName = "art-site-web",
  [string]$Tag = "latest",
  [string]$ServiceAccountId = "aje1kqd422vq2vefkbbl",
  [string]$SiteUrl = "",
  [string]$SiteDomain = "",
  [string]$AdminUsername = "",
  [string]$AdminPassword = "",
  [string]$SessionSecret = ""
)

$ErrorActionPreference = "Stop"

function Get-DotenvValue {
  param([string]$Key)

  $line = Get-Content ".env" | Where-Object { $_ -match "^$Key=(.+)$" } | Select-Object -First 1
  if (-not $line) {
    return $null
  }

  return ($line -replace "^$Key=", "").Trim('"')
}

$SiteUrl = if ($SiteUrl) { $SiteUrl } else { "https://art.solofarm.ru" }
$SiteDomain = if ($SiteDomain) { $SiteDomain } else { "art.solofarm.ru" }
$AdminUsername = if ($AdminUsername) { $AdminUsername } else { (Get-DotenvValue "ADMIN_USERNAME") }
$AdminPassword = if ($AdminPassword) { $AdminPassword } else { (Get-DotenvValue "ADMIN_PASSWORD") }
$SessionSecret = if ($SessionSecret) { $SessionSecret } else { (Get-DotenvValue "SESSION_SECRET") }

if (-not $AdminUsername) { $AdminUsername = "admin" }
if (-not $AdminPassword) { $AdminPassword = "change-me" }
if (-not $SessionSecret) { $SessionSecret = "change-me-long-random-string" }

$imageRef = "cr.yandex/$RegistryId/$ImageName`:$Tag"

Write-Host "Configuring Docker credential helper..."
yc container registry configure-docker | Out-Null

Write-Host "Building Docker image $imageRef ..."
docker build -t $imageRef .

Write-Host "Pushing Docker image..."
docker push $imageRef

$containerExists = $true
try {
  yc serverless container get --name $ContainerName | Out-Null
}
catch {
  $containerExists = $false
}

if (-not $containerExists) {
  Write-Host "Creating serverless container $ContainerName ..."
  yc serverless container create --name $ContainerName | Out-Null
}

Write-Host "Deploying new revision..."
yc serverless container revision deploy `
  --container-name $ContainerName `
  --image $imageRef `
  --memory 1GB `
  --cores 1 `
  --concurrency 8 `
  --execution-timeout 30s `
  --service-account-id $ServiceAccountId `
  --environment "NODE_ENV=production,NEXT_PUBLIC_SITE_URL=$SiteUrl,NEXT_PUBLIC_SITE_DOMAIN=$SiteDomain,ADMIN_USERNAME=$AdminUsername,ADMIN_PASSWORD=$AdminPassword,SESSION_SECRET=$SessionSecret,ARTWORKS_DATA_FILE=./apps/web/data/artworks.json" | Out-Null

Write-Host "Allowing unauthenticated invoke..."
yc serverless container allow-unauthenticated-invoke --name $ContainerName | Out-Null

Write-Host "Done. Inspect the public URL with:"
Write-Host "yc serverless container get --name $ContainerName"
