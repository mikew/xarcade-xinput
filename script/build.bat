@echo off

call script\create-install-exe.bat

REM Build webapp
del /F /S /Q webapp\build\
pushd webapp\
call yarn install
call yarn run build
popd

REM "Clean" isn't a total clean.
del /F /S /Q "XArcade XInput"\bin

REM Build Project
nuget restore
MSBuild.exe "XArcade XInput".sln /t:Clean,Build /p:Configuration=Release
