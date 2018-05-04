REM Install ScpDriver
cd /D "%~dp0"
cd "Scp Driver Installer"
ScpDriverInstaller.exe --install --quiet

REM Setup firewall
netsh advfirewall firewall add rule name="XArcade XInput" dir=in action=allow protocol=TCP localport=32123
netsh http add urlacl url=http://+:32123/ user=Everyone
