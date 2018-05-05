@echo off

call script\create-install-exe.bat

REM Build webapp
REM del /F /S /Q webapp\build\
REM cd webapp\
REM call yarn install
REM call yarn run build
REM cd ..

REM "Clean" isn't a total clean.
del /F /S /Q "XArcade XInput"\bin

REM Build Project
nuget restore
MSBuild.exe "XArcade XInput".sln /t:Clean,Build /p:Configuration=Release
