# First launch prepares Node.js and dependencies when they are missing. Later launches are handled by the bat file.
$ErrorActionPreference = 'Stop'
if (Get-Variable PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
try { $Host.UI.RawUI.WindowTitle = '小鱼塘' } catch {}
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$electron = Join-Path $root 'node_modules\electron\dist\electron.exe'

function Say([string]$Message) {
  Write-Host $Message
}

function Start-Pond {
  if (-not (Test-Path $electron)) {
    throw '没有找到 Electron，环境还没准备好。'
  }
  Remove-Item Env:npm_config_registry -ErrorAction SilentlyContinue
  Remove-Item Env:ELECTRON_MIRROR -ErrorAction SilentlyContinue
  Say '正在打开小鱼塘…'
  Start-Process -FilePath $electron -ArgumentList $root -WorkingDirectory $root
}

function Test-NodeOk([string]$NodeExe) {
  if (-not (Test-Path $NodeExe)) { return $false }
  $version = & $NodeExe -v 2>$null
  if ($LASTEXITCODE -ne 0) { return $false }
  if ($version -notmatch '^v(\d+)\.') { return $false }
  return [int]$Matches[1] -ge 18
}

function Resolve-NodeVersion {
  $indexes = @(
    'https://cdn.npmmirror.com/binaries/node/index.json',
    'https://nodejs.org/dist/index.json'
  )
  foreach ($url in $indexes) {
    $raw = & curl.exe -fsSL --retry 2 --max-time 40 $url
    if ($LASTEXITCODE -ne 0 -or -not $raw) { continue }
    try {
      $index = ($raw -join "`n") | ConvertFrom-Json
      $hit = $index | Where-Object { $_.version -like 'v22.*' } | Select-Object -First 1
      if ($hit.version) { return [string]$hit.version }
    } catch {
      continue
    }
  }
  return 'v22.23.4'
}

function Save-Url([string]$Url, [string]$Destination) {
  & curl.exe -L --fail --retry 3 --retry-delay 2 -o $Destination $Url
  if ($LASTEXITCODE -ne 0) { throw "下载失败：$Url" }
}

function Install-PortableNode {
  $arch = 'x64'
  if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64' -or $env:PROCESSOR_ARCHITEW6432 -eq 'ARM64') {
    $arch = 'arm64'
  } elseif ($env:PROCESSOR_ARCHITECTURE -eq 'x86' -and -not $env:PROCESSOR_ARCHITEW6432) {
    throw '需要 64 位 Windows。'
  }

  $version = Resolve-NodeVersion
  $name = "node-$version-win-$arch.zip"
  $tools = Join-Path $root '.tools'
  $tempZip = Join-Path $tools $name
  $extract = Join-Path $tools 'node-tmp'
  $portable = Join-Path $tools 'node'
  New-Item -ItemType Directory -Force -Path $tools | Out-Null
  if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
  if (Test-Path $portable) { Remove-Item $portable -Recurse -Force }

  $urls = @(
    "https://cdn.npmmirror.com/binaries/node/$version/$name",
    "https://nodejs.org/dist/$version/$name"
  )
  $downloaded = $false
  foreach ($url in $urls) {
    Say "正在下载 Node.js $version …"
    try {
      Save-Url $url $tempZip
      $downloaded = $true
      break
    } catch {
      Say $_.Exception.Message
    }
  }
  if (-not $downloaded) { throw 'Node.js 下载失败。请检查网络后重新双击启动。' }

  Say '正在解压 Node.js …'
  New-Item -ItemType Directory -Force -Path $extract | Out-Null
  & tar.exe -xf $tempZip -C $extract
  if ($LASTEXITCODE -ne 0) {
    if (Test-Path $extract) { Remove-Item $extract -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $extract | Out-Null
    Expand-Archive -Path $tempZip -DestinationPath $extract -Force
  }
  $inner = Get-ChildItem $extract -Directory | Select-Object -First 1
  if (-not $inner) { throw 'Node.js 压缩包是空的。' }
  Move-Item $inner.FullName $portable
  Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
  Remove-Item $extract -Recurse -Force -ErrorAction SilentlyContinue

  $nodeExe = Join-Path $portable 'node.exe'
  if (-not (Test-NodeOk $nodeExe)) { throw '自带的 Node.js 无法运行。' }
  return $portable
}

function Find-NodeHome {
  $system = Get-Command node -ErrorAction SilentlyContinue
  $systemNpm = Get-Command npm -ErrorAction SilentlyContinue
  if ($system -and $systemNpm -and (Test-NodeOk $system.Source)) {
    Say "使用本机 Node.js $(& $system.Source -v)"
    return (Split-Path $system.Source)
  }

  $portableExe = Join-Path $root '.tools\node\node.exe'
  if (Test-NodeOk $portableExe) {
    Say "使用已准备好的 Node.js $(& $portableExe -v)"
    return (Split-Path $portableExe)
  }

  Say '没有找到可用的 Node.js，正在准备一份便携环境。这一步只在第一次需要。'
  return Install-PortableNode
}

function Invoke-Install([string]$NodeHome, [bool]$UseMirror) {
  $env:PATH = "$NodeHome;$env:PATH"
  if ($UseMirror) {
    $env:npm_config_registry = 'https://registry.npmmirror.com'
    $env:ELECTRON_MIRROR = 'https://npmmirror.com/mirrors/electron/'
    Say '正在安装依赖（国内镜像）…'
  } else {
    Remove-Item Env:npm_config_registry -ErrorAction SilentlyContinue
    Remove-Item Env:ELECTRON_MIRROR -ErrorAction SilentlyContinue
    Say '镜像没有成功，改用官方源再试一次…'
    if (Test-Path (Join-Path $root 'node_modules')) {
      Remove-Item (Join-Path $root 'node_modules') -Recurse -Force
    }
  }

  Remove-Item Env:npm_config_omit -ErrorAction SilentlyContinue
  $env:NODE_ENV = 'development'
  $npm = Join-Path $NodeHome 'npm.cmd'
  if (-not (Test-Path $npm)) { $npm = 'npm.cmd' }
  $npmArgs = @('install', '--include=dev', '--no-fund', '--no-audit')
  if (Test-Path (Join-Path $root 'package-lock.json')) {
    $npmArgs = @('ci', '--include=dev', '--no-fund', '--no-audit')
  }
  & $npm @npmArgs
  if ($LASTEXITCODE -ne 0) { throw "依赖安装失败（退出码 $LASTEXITCODE）。" }
}

try {
  if (Test-Path $electron) {
    Start-Pond
    exit 0
  }

  Say '第一次打开，正在配置运行环境。需要联网，完成之后再双击就会直接进入。'
  $nodeHome = Find-NodeHome
  try {
    Invoke-Install $nodeHome $true
  } catch {
    Say $_.Exception.Message
    Invoke-Install $nodeHome $false
  }

  if (-not (Test-Path $electron)) {
    throw '依赖装完了，但没有找到 Electron。'
  }
  Start-Pond
} catch {
  Say ''
  Say "启动失败：$($_.Exception.Message)"
  Say '看完上面的提示后，按任意键关闭。'
  exit 1
}
