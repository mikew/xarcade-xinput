namespace XArcade_XInput {
    class Program {
        static public ControllerManager Manager;
        static public KeyboardMapper Mapper;
        static public bool IsDebug = false;

        static void Main (string[] args) {
            Manager = new ControllerManager();
            Mapper = new KeyboardMapper();

            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var mappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "default.json" });
            Mapper.ParseMapping(System.IO.File.ReadAllText(mappingPath));

            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--debug") {
                    IsDebug = true;
                }
            }

            Start();

            System.Threading.Tasks.Task.Run(() => {
                System.Threading.Thread.Sleep(5000);
                Stop();
            });

            // See https://github.com/gmamaladze/globalmousekeyhook/issues/3#issuecomment-230909645
            System.Windows.Forms.ApplicationContext msgLoop = new System.Windows.Forms.ApplicationContext();
            System.Windows.Forms.Application.Run(msgLoop);
        }

        static void Start () {
            Manager.Start();
            Mapper.Start();
            System.Console.WriteLine("Started.");
        }

        static void Stop () {
            Manager.Stop();
            Mapper.Stop();
            System.Console.WriteLine("Stopped.");
        }
    }
}
