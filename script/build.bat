@echo off

REM "Clean" isn't a total clean.
del /F /S /Q "XArcade XInput"\bin

REM Build Project
nuget restore
MSBuild.exe "XArcade XInput".sln /t:Clean,Build /p:Configuration=Release

