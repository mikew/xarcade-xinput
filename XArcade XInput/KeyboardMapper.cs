using ScpDriverInterface;
using System.Collections.Generic;
using System.Linq;

namespace XArcade_XInput {
    class KeyboardMapper {
        public bool IsRunning = false;
        Dictionary<string, IKeyboardActionToGamepad> KeyboardMappings = new Dictionary<string, IKeyboardActionToGamepad>();
        Gma.System.MouseKeyHook.IKeyboardMouseEvents KeyboardHook;

        public KeyboardMapper () {
            KeyboardHook = Gma.System.MouseKeyHook.Hook.GlobalEvents();
        }

        public void Start () {
            IsRunning = true;
            KeyboardHook.KeyDown += KeyboardHook_KeyDown;
            KeyboardHook.KeyUp += KeyboardHook_KeyUp;
            System.Console.WriteLine("Started KeyboardMapper");
        }

        public void Stop () {
            IsRunning = false;
            KeyboardHook.KeyDown -= KeyboardHook_KeyDown;
            KeyboardHook.KeyUp -= KeyboardHook_KeyUp;
            System.Console.WriteLine("Stopped KeyboardMapper");
        }

        static List<System.Windows.Forms.Keys> keysDown = new List<System.Windows.Forms.Keys>();

        void KeyboardHook_KeyDown (object sender, System.Windows.Forms.KeyEventArgs e) {
            if (KeyboardMappings.ContainsKey(e.KeyCode.ToString())) {
                KeyboardMappings[e.KeyCode.ToString()].Run();
                e.Handled = true;
            }

            if (Program.IsDebug) {
                if (!keysDown.Contains(e.KeyCode)) {
                    keysDown.Add(e.KeyCode);
                    var message = string.Join(" + ", keysDown.Select(x => x.ToString()));
                    System.Console.WriteLine($"down: {message}");
                }
            }
        }

        void KeyboardHook_KeyUp (object sender, System.Windows.Forms.KeyEventArgs e) {
            if (KeyboardMappings.ContainsKey(e.KeyCode.ToString())) {
                KeyboardMappings[e.KeyCode.ToString()].Run(true);
                e.Handled = true;
            }

            if (Program.IsDebug) {
                if (keysDown.Contains(e.KeyCode)) {
                    keysDown.Remove(e.KeyCode);
                    var message = string.Join(" + ", keysDown.Select(x => x.ToString()));
                    System.Console.WriteLine($"down: {message}");
                }
            }
        }

        public void ParseMapping (string mappingJsonContents) {
            KeyboardMappings.Clear();

            var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            var mapping = ser.DeserializeObject(mappingJsonContents) as Dictionary<string, object>;

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

    }

    class IKeyboardActionToGamepad {
        public int Index;
        public virtual void Run (bool IsRelease = false) { }
    }

    class KeyboardDownToButton : IKeyboardActionToGamepad {
        public X360Buttons Button;

        public override void Run (bool IsRelease = false) {
            if (IsRelease) {
                Program.Manager.ButtonUp(Index, Button);
                return;
            }

            Program.Manager.ButtonDown(Index, Button);
        }
    }

    class KeyboardDownToAxis : IKeyboardActionToGamepad {
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
}
