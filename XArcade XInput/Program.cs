namespace XArcade_XInput {
    class Program {
        static public ControllerManager Manager;
        static public KeyboardMapper Mapper;
        static public RestServer Server;
        static public bool IsDebug = false;
        static public bool ForceDefaultMapping = false;

        static void Main (string[] args) {
            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--debug") {
                    IsDebug = true;
                }
            }

            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--default") {
                    ForceDefaultMapping = true;
                }
            }

            Server = new RestServer();
            Mapper = new KeyboardMapper();
            Manager = new ControllerManager();

            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var defaultMappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "X-Arcade 2 Player Analog.json" });
            var currentMappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "current.json" });

            if (!ForceDefaultMapping && System.IO.File.Exists(currentMappingPath)) {
                defaultMappingPath = currentMappingPath;
            }

            System.Console.WriteLine($"Loading mapping from {defaultMappingPath}");
            Mapper.ParseMapping(System.IO.File.ReadAllText(defaultMappingPath));

            Mapper.OnParse += (s, e) => {
                if (Mapper.IsRunning) {
                    Manager.Stop();
                    Manager.Start();
                }
            };

            Server.Start();
            Mapper.Start();
            Manager.Start();

            // See https://github.com/gmamaladze/globalmousekeyhook/issues/3#issuecomment-230909645
            System.Windows.Forms.ApplicationContext msgLoop = new System.Windows.Forms.ApplicationContext();
            System.Windows.Forms.Application.Run(msgLoop);
        }
    }
}
