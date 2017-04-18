@echo off

del /F /S /Q webapp\build\

REM Build webapp
cd webapp\
call yarn install
call yarn run build
cd ..

REM "Clean" isn't a total clean.
del /F /S /Q "XArcade XInput"\bin

REM Build Project
nuget restore
MSBuild.exe "XArcade XInput".sln /t:Clean,Build /p:Configuration=Release

