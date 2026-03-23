param(
  [string]$GatewayName = "art-site-public",
  [string]$BucketName = "art.solofarm.ru",
  [string]$Domain = "art.solofarm.ru",
  [string]$CertificateName = "art-site-public",
  [string]$DnsZoneName = "solofarmru",
  [int]$CertificateWaitSeconds = 600
)

$ErrorActionPreference = "Stop"

function Get-CertificateByName {
  param([string]$Name)

  $json = yc certificate-manager certificate list --format json | ConvertFrom-Json
  return $json | Where-Object { $_.name -eq $Name } | Select-Object -First 1
}

function Ensure-Certificate {
  param(
    [string]$Name,
    [string]$TargetDomain,
    [string]$ZoneName,
    [int]$TimeoutSeconds
  )

  $cert = Get-CertificateByName -Name $Name
  if (-not $cert) {
    yc certificate-manager certificate request `
      --name $Name `
      --domains $TargetDomain `
      --challenge dns | Out-Null
    $cert = Get-CertificateByName -Name $Name
  }

  if (-not $cert) {
    throw "Failed to create or find managed certificate '$Name'."
  }

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    $certState = yc certificate-manager certificate get --id $cert.id --full --format json | ConvertFrom-Json

    if ($certState.status -eq "ISSUED") {
      return $certState
    }

    $dnsChallenges = @()
    if ($certState.challenges) {
      $dnsChallenges = $certState.challenges | Where-Object { $_.type -eq "DNS_CNAME" -or $_.type -eq "DNS" }
    }

    foreach ($challenge in $dnsChallenges) {
      $dnsName = $challenge.dns_name
      $dnsValue = $challenge.dns_value
      if ($challenge.dns_challenge) {
        $dnsName = $challenge.dns_challenge.name
        $dnsValue = $challenge.dns_challenge.value
      }

      if ($dnsName -and $dnsValue) {
        yc dns zone replace-records --name $ZoneName `
          --record "$dnsName 600 CNAME $dnsValue" | Out-Null
      }
    }

    Start-Sleep -Seconds 10
  }

  throw "Certificate '$Name' for '$TargetDomain' was not issued within $TimeoutSeconds seconds."
}

function Upsert-Gateway {
  param(
    [string]$Name,
    [string]$Bucket,
    [string]$SpecFile
  )

  @"
openapi: 3.0.0
info:
  title: ART_SITE Public Gateway
  version: 1.0.0
paths:
  /:
    get:
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: index.html
    head:
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: index.html
  /_next/{path+}:
    get:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '_next/{path}'
    head:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '_next/{path}'
  /data/{path+}:
    get:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: 'data/{path}'
    head:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: 'data/{path}'
  /{file}:
    get:
      parameters:
        - name: file
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '{file}'
        error_object:
          object: index.html
          statusCode: 200
    head:
      parameters:
        - name: file
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '{file}'
        error_object:
          object: index.html
          statusCode: 200
  /{path+}:
    get:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '{path}'
        error_object:
          object: index.html
          statusCode: 200
    head:
      parameters:
        - name: path
          in: path
          required: false
          schema:
            type: string
            default: "-"
          style: simple
          explode: false
      x-yc-apigateway-integration:
        type: object_storage
        bucket: $Bucket
        object: '{path}'
        error_object:
          object: index.html
          statusCode: 200
"@ | Set-Content -Path $SpecFile -Encoding UTF8

  yc serverless api-gateway get --name $Name 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) {
    yc serverless api-gateway update --name $Name --spec $SpecFile | Out-Null
  } else {
    yc serverless api-gateway create --name $Name --spec $SpecFile | Out-Null
  }

  return yc serverless api-gateway get --name $Name --format json | ConvertFrom-Json
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

try {
  $certificate = Ensure-Certificate `
    -Name $CertificateName `
    -TargetDomain $Domain `
    -ZoneName $DnsZoneName `
    -TimeoutSeconds $CertificateWaitSeconds

  $specFile = Join-Path $env:TEMP "art-site-public-gateway.yaml"
  $gateway = Upsert-Gateway -Name $GatewayName -Bucket $BucketName -SpecFile $SpecFile

  try {
    yc serverless api-gateway add-domain `
      --name $GatewayName `
      --domain $Domain `
      --certificate-id $certificate.id | Out-Null
  }
  catch {
    Write-Host "Public gateway domain may already be attached: $Domain"
  }

  $gateway = yc serverless api-gateway get --name $GatewayName --format json | ConvertFrom-Json

  yc dns zone replace-records --name $DnsZoneName `
    --record "$Domain. 600 CNAME $($gateway.domain)." | Out-Null

  Write-Host "Gateway URL: https://$($gateway.domain)"
  Write-Host "Public domain target: https://$Domain"
  Write-Host "Certificate: $($certificate.id) ($($certificate.status))"
}
finally {
  Pop-Location
}
