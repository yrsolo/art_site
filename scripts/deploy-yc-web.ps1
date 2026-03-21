param(
  [string]$RegistryId = "crp5tssh5qkdk7mgcilj",
  [string]$ImageName = "art-site/api",
  [string]$ContainerName = "art-site-api",
  [string]$GatewayName = "art-site-api",
  [string]$Tag = "latest",
  [string]$ServiceAccountId = "aje1kqd422vq2vefkbbl",
  [string]$SiteUrl = "",
  [string]$AdminBaseUrl = "",
  [string]$ApiBaseUrl = "",
  [string]$ApiDomain = "",
  [string]$CertificateId = ""
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

function Ensure-Container {
  param([string]$Name)

  $existing = yc serverless container get --name $Name --format json 2>$null
  if ($LASTEXITCODE -eq 0 -and $existing) {
    return $existing | ConvertFrom-Json
  }

  yc serverless container create --name $Name | Out-Null
  $created = yc serverless container get --name $Name --format json
  if ($LASTEXITCODE -ne 0 -or -not $created) {
    throw "Failed to create or fetch container '$Name'."
  }

  return $created | ConvertFrom-Json
}

function Upsert-Gateway {
  param(
    [string]$Name,
    [string]$SpecFile
  )

  yc serverless api-gateway get --name $Name 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    yc serverless api-gateway update --name $Name --spec $SpecFile | Out-Null
  } else {
    yc serverless api-gateway create --name $Name --spec $SpecFile | Out-Null
  }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
  $SiteUrl = if ($SiteUrl) { $SiteUrl } else { (Get-DotenvValue "NEXT_PUBLIC_SITE_URL") }
  $AdminBaseUrl = if ($AdminBaseUrl) { $AdminBaseUrl } else { (Get-DotenvValue "NEXT_PUBLIC_ADMIN_BASE_URL") }
  $ApiBaseUrl = if ($ApiBaseUrl) { $ApiBaseUrl } else { (Get-DotenvValue "NEXT_PUBLIC_API_BASE_URL") }
  $ApiDomain = if ($ApiDomain) { $ApiDomain } else { "api.art.solofarm.ru" }

  if (-not $SiteUrl) { $SiteUrl = "https://art.solofarm.ru" }
  if (-not $AdminBaseUrl) { $AdminBaseUrl = "https://admin.art.solofarm.ru" }
  if (-not $ApiBaseUrl) { $ApiBaseUrl = "https://api.art.solofarm.ru" }

  $sessionSecret = Get-DotenvValue "SESSION_SIGNING_SECRET"
  $bootstrapPassword = Get-DotenvValue "ADMIN_BOOTSTRAP_PASSWORD"
  $cookieName = Get-DotenvValue "COOKIE_NAME"
  $cookieSecure = Get-DotenvValue "COOKIE_SECURE"
  $cookieSameSite = Get-DotenvValue "COOKIE_SAMESITE"
  $cookiePath = Get-DotenvValue "COOKIE_PATH"
  $cookieDomain = Get-DotenvValue "COOKIE_DOMAIN"
  $sessionTtl = Get-DotenvValue "SESSION_TTL_SECONDS"
  $allowedOrigins = Get-DotenvValue "ADMIN_ALLOWED_ORIGINS"

  $objectStorageMode = Get-DotenvValue "OBJECT_STORAGE_MODE"
  $objectStorageEndpoint = Get-DotenvValue "OBJECT_STORAGE_ENDPOINT"
  $objectStorageRegion = Get-DotenvValue "OBJECT_STORAGE_REGION"
  $objectStorageBucket = Get-DotenvValue "OBJECT_STORAGE_BUCKET"
  $objectStorageDataPrefix = Get-DotenvValue "OBJECT_STORAGE_DATA_PREFIX"
  $objectStorageMediaPrefix = Get-DotenvValue "OBJECT_STORAGE_MEDIA_PREFIX"
  $objectStorageSnapshotPrefix = Get-DotenvValue "OBJECT_STORAGE_PUBLIC_SNAPSHOT_PREFIX"
  $publicSiteSnapshotKey = Get-DotenvValue "PUBLIC_SITE_SNAPSHOT_KEY"
  $accessKeyId = Get-DotenvValue "AWS_ACCESS_KEY_ID"
  $secretAccessKey = Get-DotenvValue "AWS_SECRET_ACCESS_KEY"

  if (-not $sessionSecret) { $sessionSecret = "change-me-long-random-string" }
  if (-not $bootstrapPassword) { $bootstrapPassword = "333" }
  if (-not $cookieName) { $cookieName = "art-site-session" }
  if (-not $cookieSecure) { $cookieSecure = "true" }
  if (-not $cookieSameSite) { $cookieSameSite = "Lax" }
  if (-not $cookiePath) { $cookiePath = "/" }
  if (-not $cookieDomain) { $cookieDomain = ".art.solofarm.ru" }
  if (-not $sessionTtl) { $sessionTtl = "2592000" }
  if (-not $allowedOrigins) { $allowedOrigins = $AdminBaseUrl }
  if (-not $objectStorageMode) { $objectStorageMode = "s3" }
  if (-not $objectStorageEndpoint) { $objectStorageEndpoint = "https://storage.yandexcloud.net" }
  if (-not $objectStorageRegion) { $objectStorageRegion = "ru-central1" }
  if (-not $objectStorageBucket) { $objectStorageBucket = "art-site" }
  if (-not $objectStorageDataPrefix) { $objectStorageDataPrefix = "private/data" }
  if (-not $objectStorageMediaPrefix) { $objectStorageMediaPrefix = "media" }
  if (-not $objectStorageSnapshotPrefix) { $objectStorageSnapshotPrefix = "private/data/export" }
  if (-not $publicSiteSnapshotKey) { $publicSiteSnapshotKey = "public-site.json" }

  if (-not $accessKeyId -or -not $secretAccessKey) {
    throw "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required for production Object Storage mode."
  }

  $imageRef = "cr.yandex/$RegistryId/$ImageName`:$Tag"

  yc container registry configure-docker | Out-Null

  docker build -t $imageRef .
  docker push $imageRef

  $container = Ensure-Container -Name $ContainerName

  yc serverless container revision deploy `
    --container-name $ContainerName `
    --image $imageRef `
    --runtime http `
    --memory 1GB `
    --cores 1 `
    --concurrency 8 `
    --execution-timeout 30s `
    --service-account-id $ServiceAccountId `
    --environment "NODE_ENV=production,NEXT_PUBLIC_SITE_URL=$SiteUrl,NEXT_PUBLIC_ADMIN_BASE_URL=$AdminBaseUrl,NEXT_PUBLIC_API_BASE_URL=$ApiBaseUrl,SESSION_SIGNING_SECRET=$sessionSecret,ADMIN_BOOTSTRAP_PASSWORD=$bootstrapPassword,COOKIE_NAME=$cookieName,COOKIE_SECURE=$cookieSecure,COOKIE_SAMESITE=$cookieSameSite,COOKIE_PATH=$cookiePath,COOKIE_DOMAIN=$cookieDomain,SESSION_TTL_SECONDS=$sessionTtl,ADMIN_ALLOWED_ORIGINS=$allowedOrigins,OBJECT_STORAGE_MODE=$objectStorageMode,OBJECT_STORAGE_ENDPOINT=$objectStorageEndpoint,OBJECT_STORAGE_REGION=$objectStorageRegion,OBJECT_STORAGE_BUCKET=$objectStorageBucket,OBJECT_STORAGE_DATA_PREFIX=$objectStorageDataPrefix,OBJECT_STORAGE_MEDIA_PREFIX=$objectStorageMediaPrefix,OBJECT_STORAGE_PUBLIC_SNAPSHOT_PREFIX=$objectStorageSnapshotPrefix,PUBLIC_SITE_SNAPSHOT_KEY=$publicSiteSnapshotKey,AWS_ACCESS_KEY_ID=$accessKeyId,AWS_SECRET_ACCESS_KEY=$secretAccessKey" | Out-Null

  $container = yc serverless container get --name $ContainerName --format json | ConvertFrom-Json

  $specFile = Join-Path $env:TEMP "art-site-api-gateway.yaml"
  @"
openapi: 3.0.0
info:
  title: ART_SITE API
  version: 1.0.0
paths:
  /:
    x-yc-apigateway-any-method:
      x-yc-apigateway-integration:
        type: serverless_containers
        container_id: $($container.id)
        service_account_id: $ServiceAccountId
  /{proxy+}:
    x-yc-apigateway-any-method:
      parameters:
        - name: proxy
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: serverless_containers
        container_id: $($container.id)
        service_account_id: $ServiceAccountId
"@ | Set-Content -Path $specFile -Encoding UTF8

  Upsert-Gateway -Name $GatewayName -SpecFile $specFile

  if ($CertificateId -and $ApiDomain) {
    try {
      yc serverless api-gateway add-domain --name $GatewayName --domain $ApiDomain --certificate-id $CertificateId | Out-Null
    }
    catch {
      Write-Host "Gateway domain may already be attached: $ApiDomain"
    }
  }

  $gateway = yc serverless api-gateway get --name $GatewayName --format json | ConvertFrom-Json

  Write-Host "Container URL: $($container.url)"
  Write-Host "Gateway URL: https://$($gateway.domain)"
  if ($ApiDomain) {
    Write-Host "Target custom domain: https://$ApiDomain"
  }
}
finally {
  Pop-Location
}
