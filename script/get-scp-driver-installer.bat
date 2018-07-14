@echo off

rd /S /Q "Scp Driver Installer"
curl -L https://github.com/mogzol/ScpDriverInterface/releases/download/1.1/ScpDriverInterface_v1.1.zip --output "Scp Driver Installer.zip"
7z x -o"ScpDriverTemp" "Scp Driver Installer.zip"
move /Y "ScpDriverTemp\Driver Installer" "Scp Driver Installer"
rd /S /Q ScpDriverTemp
del /F /S /Q "Scp Driver Installer.zip"