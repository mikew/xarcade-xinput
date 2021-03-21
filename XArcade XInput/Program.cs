namespace XArcade_XInput {
    class Program {
        static public ControllerManager ControllerManagerInstance;
        static public KeyboardMapper KeyboardMapperInstance;
        static public RestServer RestServerInstance;
        static public bool IsDebug = false;
        static public bool ForceDefaultMapping = false;
        static public bool ShouldOpenUI = true;
        static public bool ShouldStartDisabled = false;

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

                if (args[i] == "--start-disabled") {
                    ShouldStartDisabled = true;
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

            if (!ShouldStartDisabled) {
                KeyboardMapperInstance.Start();
                ControllerManagerInstance.Start();
            }

            // See https://github.com/gmamaladze/globalmousekeyhook/issues/3#issuecomment-230909645
            System.Windows.Forms.ApplicationContext msgLoop = new System.Windows.Forms.ApplicationContext();
            System.Windows.Forms.Application.Run(msgLoop);
        }
    }
}
