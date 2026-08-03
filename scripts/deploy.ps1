param([ValidateSet('development', 'production')][string]$Profile = 'production')

$composeFiles = @('-f', 'docker/docker-compose.yml')
if ($Profile -eq 'production') { $composeFiles += @('-f', 'docker/docker-compose.production.yml') }

docker compose @composeFiles build
if ($LASTEXITCODE -ne 0) { throw 'Container build failed.' }
docker compose @composeFiles up -d --remove-orphans
if ($LASTEXITCODE -ne 0) { throw 'Deployment failed.' }
Write-Output 'Deployment completed. Verify /api/v1/health and /api/v1/health/ready.'
