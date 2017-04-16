using ScpDriverInterface;
using System.Collections.Generic;
using System.Linq;

namespace XArcade_XInput {
    public class IKeyboardActionToGamepad {
        public int Index;
        public virtual void Run (bool IsRelease = false) { }
    }

    public class KeyboardDownToButton : IKeyboardActionToGamepad {
        public X360Buttons Button;

        public override void Run (bool IsRelease = false) {
            if (IsRelease) {
                Program.Manager.ButtonUp(Index, Button);
                return;
            }

            Program.Manager.ButtonDown(Index, Button);
        }
    }

    public class KeyboardDownToAxis : IKeyboardActionToGamepad {
        public int DownValue;
        public int UpValue;
        public X360Axis Axis;

        override public void Run (bool IsRelease = false) {
            if (IsRelease) {
                Program.Manager.SetAxis(Index, Axis, UpValue);
                return;
            }

            Program.Manager.SetAxis(Index, Axis, DownValue);
        }
    }

    class Program {
        static Gma.System.MouseKeyHook.IKeyboardMouseEvents KeyboardHook;
        static public ControllerManager Manager;
        static ScpBus Bus;
        static bool IsRunning = false;
        static bool IsDebug = true;

        static void Main (string[] args) {
            KeyboardHook = Gma.System.MouseKeyHook.Hook.GlobalEvents();
            Manager = new ControllerManager();
            Bus = new ScpBus();

            ParseMapping();
            Start();

            for (var i = 0; i < args.Length; i++) {
                if (args[i] == "--debug") {
                    IsDebug = true;
                }
            }

            // See https://github.com/gmamaladze/globalmousekeyhook/issues/3#issuecomment-230909645
            System.Windows.Forms.ApplicationContext msgLoop = new System.Windows.Forms.ApplicationContext();
            System.Windows.Forms.Application.Run(msgLoop);
        }

        static void Start () {
            Bus.PlugIn(1);
            Bus.PlugIn(2);
            Manager.OnChange += Manager_OnChange;
            KeyboardHook.KeyDown += KeyboardHook_KeyDown;
            KeyboardHook.KeyUp += KeyboardHook_KeyUp;
            IsRunning = true;
            System.Console.WriteLine("Started.");
        }

        static void Stop () {
            Bus.UnplugAll();
            Manager.OnChange -= Manager_OnChange;
            KeyboardHook.KeyDown -= KeyboardHook_KeyDown;
            KeyboardHook.KeyUp -= KeyboardHook_KeyUp;
            IsRunning = false;
            System.Console.WriteLine("Stopped.");
        }

        static Dictionary<string, IKeyboardActionToGamepad> KeyboardMappings = new Dictionary<string, IKeyboardActionToGamepad>();

        static void ParseMapping () {
            KeyboardMappings.Clear();

            var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var mappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "default.json" });
            var mapping = ser.DeserializeObject(System.IO.File.ReadAllText(mappingPath)) as Dictionary<string, object>;

            foreach (var pair in mapping) {
                System.Console.WriteLine($"Loadding mapping for {pair.Key} ...");

                var shorthand = pair.Value as object[];
                var controllerIndex = (int)shorthand[0];
                var controllerKey = (string)shorthand[1];

                switch (controllerKey) {
                    case "LeftTrigger":
                    case "RightTrigger": {
                            var axis = (X360Axis)System.Enum.Parse(typeof(X360Axis), controllerKey);
                            float downMultiplier = 1;
                            float upMultiplier = 0;

                            if (shorthand.Length == 3) {
                                try {
                                    downMultiplier = (int)shorthand[2];
                                } catch (System.Exception) {
                                    downMultiplier = (float)(decimal)shorthand[2];
                                }
                            }
                            if (shorthand.Length == 4) {
                                try {
                                    downMultiplier = (int)shorthand[2];
                                } catch (System.Exception) {
                                    downMultiplier = (float)(decimal)shorthand[2];
                                }
                                try {
                                    upMultiplier = (int)shorthand[3];
                                } catch (System.Exception) {
                                    upMultiplier = (float)(decimal)shorthand[3];
                                }
                            }

                            var downValue = (int)System.Math.Round(byte.MaxValue * downMultiplier);
                            var upValue = (int)System.Math.Round(0 * upMultiplier);

                            KeyboardMappings[pair.Key] = new KeyboardDownToAxis { DownValue = downValue, UpValue = upValue, Index = controllerIndex, Axis = axis };

                            break;
                        }
                    case "LeftStickX":
                    case "LeftStickY":
                    case "RightStickX":
                    case "RightStickY": {
                            var axis = (X360Axis)System.Enum.Parse(typeof(X360Axis), controllerKey);
                            float downMultiplier = 1;
                            float upMultiplier = 0;

                            if (shorthand.Length == 3) {
                                try {
                                    downMultiplier = (int)shorthand[2];
                                } catch (System.Exception) {
                                    downMultiplier = (float)(decimal)shorthand[2];
                                }
                            }
                            if (shorthand.Length == 4) {
                                try {
                                    downMultiplier = (int)shorthand[2];
                                } catch (System.Exception) {
                                    downMultiplier = (float)(decimal)shorthand[2];
                                }
                                try {
                                    upMultiplier = (int)shorthand[3];
                                } catch (System.Exception) {
                                    upMultiplier = (float)(decimal)shorthand[3];
                                }
                            }

                            var downValue = (int)System.Math.Round(short.MaxValue * downMultiplier);
                            var upValue = (int)System.Math.Round(0 * upMultiplier);

                            KeyboardMappings[pair.Key] = new KeyboardDownToAxis { DownValue = downValue, UpValue = upValue, Index = controllerIndex, Axis = axis };

                            break;
                        }
                    default: {
                            var button = (X360Buttons)System.Enum.Parse(typeof(X360Buttons), controllerKey);

                            KeyboardMappings[pair.Key] = new KeyboardDownToButton { Index = controllerIndex, Button = button };

                            break;
                        }
                }
            }
        }

        static List<System.Windows.Forms.Keys> keysDown = new List<System.Windows.Forms.Keys>();

        private static void Manager_OnChange (object sender, ControllerManagerEventArgs e) {
            Bus.Report(e.Index + 1, e.Controller.GetReport());
        }

        private static void KeyboardHook_KeyDown (object sender, System.Windows.Forms.KeyEventArgs e) {
            if (KeyboardMappings.ContainsKey(e.KeyCode.ToString())) {
                KeyboardMappings[e.KeyCode.ToString()].Run();
                e.Handled = true;
            }

            if (IsDebug) {
                if (!keysDown.Contains(e.KeyCode)) {
                    keysDown.Add(e.KeyCode);
                    var message = string.Join(" + ", keysDown.Select(x => x.ToString()));
                    System.Console.WriteLine($"down: {message}");
                }
            }
        }

        private static void KeyboardHook_KeyUp (object sender, System.Windows.Forms.KeyEventArgs e) {
            if (KeyboardMappings.ContainsKey(e.KeyCode.ToString())) {
                KeyboardMappings[e.KeyCode.ToString()].Run(true);
                e.Handled = true;
            }

            if (IsDebug) {
                if (keysDown.Contains(e.KeyCode)) {
                    keysDown.Remove(e.KeyCode);
                    var message = string.Join(" + ", keysDown.Select(x => x.ToString()));
                    System.Console.WriteLine($"down: {message}");
                }
            }
        }
    }
}
