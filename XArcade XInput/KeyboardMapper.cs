using ScpDriverInterface;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace XArcade_XInput {
    class KeyboardMapper {
        public bool IsRunning = false;
        public List<int> MappedControllerIndexes = new List<int>();
        Dictionary<string, IKeyboardActionToGamepad> KeyboardMappings = new Dictionary<string, IKeyboardActionToGamepad>();
        Gma.System.MouseKeyHook.IKeyboardMouseEvents KeyboardHook;
        public event System.EventHandler OnParse;

        public string CurrentMappingName;
        string DefaultMappingName = "X-Arcade 2 Player Analog";

        public KeyboardMapper () {
            KeyboardHook = Gma.System.MouseKeyHook.Hook.GlobalEvents();

            LoadPreviousMapping();
        }

        public void Start () {
            if (IsRunning) {
                return;
            }

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

        void LoadPreviousMapping () {
            var name = "";

            if (File.Exists(GetMappingPath("CurrentMappingName"))) {
                name = File.ReadAllText(GetMappingPath("CurrentMappingName")).Trim();
            }

            if (!string.IsNullOrEmpty(Program.InitialMappingName)) {
                name = Program.InitialMappingName;
            }
            
            if (Program.ForceDefaultMapping) {
                name = DefaultMappingName;
            }

            if (!DoesMappingExist(name)) {
                name = DefaultMappingName;
            }

            SetCurrentMappingName(name);
        }

        public void SaveMapping (string name, string contents) {
            if (name == DefaultMappingName) {
                return;
            }

            name = SanitizeName(name);
            var path = GetMappingPath($"{name}.json");

            System.Console.WriteLine($"Saving mapping to {path}");
            File.WriteAllText(path, contents);

            if (name == CurrentMappingName) {
                ParseMapping(contents);
            }
        }

        string GetMappingPath (string part) {
            return GetMappingPath(new string[] { part });
        }

        string GetMappingPath (string[] parts) {
            var allParts = new List<string> {
                System.AppDomain.CurrentDomain.BaseDirectory,
                "mappings",
            };

            allParts.AddRange(parts);

            return Path.Combine(allParts.ToArray());
        }

        public void DeleteMapping (string name) {
            if (name == DefaultMappingName) {
                return;
            }

            name = SanitizeName(name);
            File.Delete(GetMappingPath($"{name}.json"));
            if (name == CurrentMappingName) {
                SetCurrentMappingName(DefaultMappingName);
            }
        }

        public void RenameMapping (string name, string newName) {
            if (name == DefaultMappingName) {
                return;
            }

            name = SanitizeName(name);
            newName = SanitizeName(newName);
            File.Move(GetMappingPath($"{name}.json"), GetMappingPath($"{newName}.json"));

            if (name == CurrentMappingName) {
                CurrentMappingName = newName;
            }
        }

        public void SetCurrentMappingName (string name) {
            if (!DoesMappingExist(name)) {
                return;
            }

            name = SanitizeName(name);
            var path = GetMappingPath($"{name}.json");

            System.Console.WriteLine($"Loading mapping from {path}");
            ParseMapping(File.ReadAllText(path));
            CurrentMappingName = name;
            File.WriteAllText(GetMappingPath("CurrentMappingName"), name);
        }

        public bool DoesMappingExist (string name) {
            return File.Exists(GetMappingPath($"{SanitizeName(name)}.json"));
        }

        public static string SanitizeName (string name) {
            if (string.IsNullOrEmpty(name)) {
                return System.Guid.NewGuid().ToString();
            }

            var pattern = "[^0-9a-zA-Z\\-_]+";
            var replacement = " ";
            var rgx = new System.Text.RegularExpressions.Regex(pattern);

            return rgx.Replace(name, replacement).Trim();
        }

        public Dictionary<string, string> GetAllMappings () {
            var ret = new Dictionary<string, string>();

            foreach (var f in Directory.GetFiles(GetMappingPath(""), "*.json")) {
                var key = Path.GetFileNameWithoutExtension(f);
                var value = File.ReadAllText(f).Trim();

                ret.Add(key, value);
            }

            return ret;
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
                    System.Console.WriteLine($"Keyboard: {message}");
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
                    if (string.IsNullOrEmpty(message)) {
                        message = "All keys released";
                    }
                    System.Console.WriteLine($"Keyboard: {message}");
                }
            }
        }

        public void ParseMapping (string mappingJsonContents) {
            var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            var mapping = ser.DeserializeObject(mappingJsonContents) as Dictionary<string, object>;

            MappedControllerIndexes.Clear();
            KeyboardMappings.Clear();

            foreach (var pair in mapping) {
                System.Console.WriteLine($"Loading mapping for {pair.Key} ...");

                var shorthand = pair.Value as object[];
                var controllerIndex = (int)shorthand[0];
                var controllerKey = (string)shorthand[1];
                var didMap = false;

                switch (controllerKey) {
                    case "LeftTrigger":
                    case "RightTrigger":
                    case "LeftStickX":
                    case "LeftStickY":
                    case "RightStickX":
                    case "RightStickY": {
                            var maxValue = short.MaxValue;

                            if (controllerKey == "LeftTrigger" || controllerKey == "RightTrigger") {
                                maxValue = byte.MaxValue;
                            }

                            var axis = (X360Axis)System.Enum.Parse(typeof(X360Axis), controllerKey);
                            var multipliers = ParseAxisMultipliers(shorthand);
                            var downMultiplier = multipliers[0];
                            var upMultiplier = multipliers[1];
                            var downValue = (int)System.Math.Round(maxValue * downMultiplier);
                            var upValue = (int)System.Math.Round(0 * upMultiplier);

                            KeyboardMappings[pair.Key] = new KeyboardDownToAxis { DownValue = downValue, UpValue = upValue, Index = controllerIndex, Axis = axis };
                            didMap = true;

                            break;
                        }
                    default: {
                            var button = (X360Buttons)System.Enum.Parse(typeof(X360Buttons), controllerKey);

                            KeyboardMappings[pair.Key] = new KeyboardDownToButton { Index = controllerIndex, Button = button };
                            didMap = true;

                            break;
                        }
                }

                if (didMap) {
                    if (!MappedControllerIndexes.Contains(controllerIndex)) {
                        MappedControllerIndexes.Add(controllerIndex);
                    }
                }
            }

            OnParse?.Invoke(this, new System.EventArgs());
        }

        float[] ParseAxisMultipliers (object[] shorthand) {
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

            return new float[] { downMultiplier, upMultiplier };
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
                Program.ControllerManagerInstance.ButtonUp(Index, Button);
                return;
            }

            Program.ControllerManagerInstance.ButtonDown(Index, Button);
        }
    }

    class KeyboardDownToAxis : IKeyboardActionToGamepad {
        public int DownValue;
        public int UpValue;
        public X360Axis Axis;

        override public void Run (bool IsRelease = false) {
            if (IsRelease) {
                Program.ControllerManagerInstance.SetAxis(Index, Axis, UpValue);
                return;
            }

            Program.ControllerManagerInstance.SetAxis(Index, Axis, DownValue);
        }
    }
}
