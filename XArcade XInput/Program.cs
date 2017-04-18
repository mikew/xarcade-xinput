namespace XArcade_XInput {
    class Program {
        static public ControllerManager ControllerManagerInstance;
        static public KeyboardMapper KeyboardMapperInstance;
        static public RestServer RestServerInstance;
        static public bool IsDebug = false;
        static public bool ForceDefaultMapping = false;

        static void Main (string[] args) {
            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--debug") {
                    IsDebug = true;
                }

                if (args[i] == "--default") {
                    ForceDefaultMapping = true;
                }
            }

            RestServerInstance = new RestServer();
            KeyboardMapperInstance = new KeyboardMapper();
            ControllerManagerInstance = new ControllerManager();

            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var defaultMappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "X-Arcade 2 Player Analog.json" });
            var currentMappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "current.json" });

            if (!ForceDefaultMapping && System.IO.File.Exists(currentMappingPath)) {
                defaultMappingPath = currentMappingPath;
            }

            System.Console.WriteLine($"Loading mapping from {defaultMappingPath}");
            KeyboardMapperInstance.ParseMapping(System.IO.File.ReadAllText(defaultMappingPath));

            KeyboardMapperInstance.OnParse += (s, e) => {
                if (ControllerManagerInstance.IsRunning) {
                    ControllerManagerInstance.Stop();
                    ControllerManagerInstance.Start();
                }

                System.IO.File.WriteAllText(currentMappingPath, KeyboardMapperInstance.CurrentMapping);
            };

            RestServerInstance.Start();
            KeyboardMapperInstance.Start();
            ControllerManagerInstance.Start();

            // See https://github.com/gmamaladze/globalmousekeyhook/issues/3#issuecomment-230909645
            System.Windows.Forms.ApplicationContext msgLoop = new System.Windows.Forms.ApplicationContext();
            System.Windows.Forms.Application.Run(msgLoop);
        }
    }
}
