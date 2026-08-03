param(
  [Parameter(Mandatory = $true)][string]$MongoUri,
  [string]$OutputDirectory = "./backups"
)

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$destination = Join-Path $OutputDirectory "secure-login-portal-$timestamp.archive.gz"
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
mongodump --uri="$MongoUri" --archive="$destination" --gzip
if ($LASTEXITCODE -ne 0) { throw 'Database backup failed.' }
Write-Output "Backup created: $destination"
