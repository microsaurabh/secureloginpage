param(
  [Parameter(Mandatory = $true)][string]$MongoUri,
  [Parameter(Mandatory = $true)][string]$ArchivePath
)

if (!(Test-Path -LiteralPath $ArchivePath)) { throw "Backup archive not found: $ArchivePath" }
mongorestore --uri="$MongoUri" --archive="$ArchivePath" --gzip --drop
if ($LASTEXITCODE -ne 0) { throw 'Database restore failed.' }
Write-Output 'Database restore completed.'
