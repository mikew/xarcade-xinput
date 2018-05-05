@echo off

REM Install ScpDriver
REM Prefer pushd / popd to cd, since it handles network paths.
pushd "%~dp0\Scp Driver Installer"
ScpDriverInstaller.exe --install --quiet
popd

REM Setup firewall
netsh advfirewall firewall add rule name="XArcade XInput" dir=in action=allow protocol=TCP localport=32123
netsh http add urlacl url=http://+:32123/ user=Everyone
