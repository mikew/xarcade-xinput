namespace Install_Driver {
    class Program {
        static void Main (string[] args) {
            InstallDriver();
            SetupFirewall();
            WaitAndExit(0);
        }

        static System.Diagnostics.Process RunCommand(System.Diagnostics.ProcessStartInfo startInfo, bool allowFail = false) {
            System.Console.WriteLine($"Running '{startInfo.FileName} {startInfo.Arguments}'");

            startInfo.UseShellExecute = false;
            startInfo.RedirectStandardOutput = true;
            startInfo.RedirectStandardError = true;

            var proc = new System.Diagnostics.Process {
                StartInfo = startInfo,
            };

            proc.OutputDataReceived += (sender, e) => System.Console.WriteLine(e.Data);
            proc.ErrorDataReceived += (sender, e) => System.Console.WriteLine(e.Data);

            try {
                proc.Start();
            } catch (System.Exception err) {
                System.Console.WriteLine(err.Message);
                WaitAndExit(1);
            }

            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();
            proc.WaitForExit();

            if (!allowFail && proc.ExitCode > 0) {
                System.Console.WriteLine($"Command exited with code {proc.ExitCode}");
                WaitAndExit(proc.ExitCode);
            }

            return proc;
        }

        static void InstallDriver() {
            var driverInstallerDir = System.IO.Path.Combine(
                        System.Environment.CurrentDirectory,
                        "Scp Driver Installer"
                );

            RunCommand(new System.Diagnostics.ProcessStartInfo {
                FileName = System.IO.Path.Combine(
                        driverInstallerDir,
                        "ScpDriverInstaller.exe"
                        ),
                Arguments = "--install --quiet",
                WorkingDirectory = driverInstallerDir,
            });
        }

        static void SetupFirewall() {
            RunCommand(new System.Diagnostics.ProcessStartInfo {
                FileName = "netsh",
                Arguments = "advfirewall firewall add rule name=\"XArcade XInput\" dir=in action=allow protocol=TCP localport=32123",
            }, true);

            RunCommand(new System.Diagnostics.ProcessStartInfo {
                FileName = "netsh",
                Arguments = "http add urlacl url=http://+:32123/ user=Everyone",
            }, true);
        }

        static void WaitAndExit(int exitCode) {
            if (exitCode > 0) {
                System.Console.WriteLine("Press any key to continue");
                System.Console.ReadKey();
            }
            System.Environment.Exit(exitCode);
        }
    }
}
