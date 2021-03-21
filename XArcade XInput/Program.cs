namespace XArcade_XInput {
    class Program {
        static public ControllerManager ControllerManagerInstance;
        static public KeyboardMapper KeyboardMapperInstance;
        static public RestServer RestServerInstance;
        static public bool IsDebug = false;
        static public bool ForceDefaultMapping = false;
        static public bool ShouldOpenUI = true;
        static public string InitialMappingName;

        static void Main (string[] args) {
            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--debug") {
                    IsDebug = true;
                }

                if (args[i] == "--default") {
                    ForceDefaultMapping = true;
                }

                if (args[i] == "--skip-ui") {
                    ShouldOpenUI = false;
                }

                if (args[i] == "--mapping") {
                    InitialMappingName = args[i + 1];
                    i++;
                }  
            }

            RestServerInstance = new RestServer();
            KeyboardMapperInstance = new KeyboardMapper();
            ControllerManagerInstance = new ControllerManager();

            KeyboardMapperInstance.OnParse += (s, e) => {
                if (ControllerManagerInstance.IsRunning) {
                    ControllerManagerInstance.Stop();
                    ControllerManagerInstance.Start();
                }
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
