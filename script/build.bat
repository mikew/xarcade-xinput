@echo off

REM Build webapp
rd /S /Q webapp\build\
pushd webapp\
call npm install
call node_modules\.bin\react-scripts-ts build
popd

REM Grab Scp Driver Installer
call script\get-scp-driver-installer.bat

REM "Clean" isn't a total clean.
del /F /S /Q "XArcade XInput"\bin
rd /S /Q "XArcade XInput"\bin

REM Build Project
nuget restore
MSBuild.exe "XArcade XInput".sln /t:Clean,Build /p:Configuration=Release
