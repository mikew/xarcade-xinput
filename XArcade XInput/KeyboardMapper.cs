using ScpDriverInterface;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Gma.System.MouseKeyHook;

namespace XArcade_XInput {
    class KeyboardMapper {
        public bool IsRunning = false;
        public List<int> MappedControllerIndexes = new List<int>();
        readonly Dictionary<string, IProgramAction> KeyboardMappings = new Dictionary<string, IProgramAction>();
        private readonly List<Combo> ComboMappings = new List<Combo>();
        static readonly List<string> keysDown = new List<string>();
        private readonly Dictionary<string, Combo> runningCombos = new Dictionary<string, Combo>();
        private readonly IKeyboardMouseEvents KeyboardHook;
        public event System.EventHandler OnParse;

        public string CurrentMappingName;
        private readonly string DefaultMappingName = "X-Arcade 2 Player Analog";

        public KeyboardMapper () {
            KeyboardHook = Hook.GlobalEvents();

            LoadPreviousMapping();
        }

        public void Start () {
            if (IsRunning) {
                return;
            }

            IsRunning = true;
            KeyboardHook.KeyDown += KeyboardHook_KeyDown;
            KeyboardHook.KeyUp += KeyboardHook_KeyUp;
            KeyboardHook.MouseDownExt += KeyboardHook_MouseDown;
            KeyboardHook.MouseUpExt += KeyboardHook_MouseUp;
            System.Console.WriteLine("Started KeyboardMapper");
        }

        public void Stop () {
            IsRunning = false;
            KeyboardHook.KeyDown -= KeyboardHook_KeyDown;
            KeyboardHook.KeyUp -= KeyboardHook_KeyUp;
            KeyboardHook.MouseDownExt -= KeyboardHook_MouseDown;
            KeyboardHook.MouseUpExt -= KeyboardHook_MouseUp;
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


        bool RunKeyDownAction(string keyCodeString) {
            if (KeyboardMappings.ContainsKey(keyCodeString)) {
                KeyboardMappings[keyCodeString].Run();
                return true;
            }

            return false;
        }

        bool RunKeyUpAction(string keyCodeString) {
            if (KeyboardMappings.ContainsKey(keyCodeString)) {
                KeyboardMappings[keyCodeString].Run(true);
                return true;
            }

            return false;
        }

        void KeyboardHook_MouseDown(object sender, MouseEventExtArgs e) {
            e.Handled = HandleKeyOrMouseDown(GetKeyNameFromMouseButton(e.Button.ToString()));
        }

        void KeyboardHook_MouseUp(object sender, MouseEventExtArgs e) {
            e.Handled = HandleKeyOrMouseUp(GetKeyNameFromMouseButton(e.Button.ToString()));
        }

        string GetKeyNameFromMouseButton(string button) {
            switch (button) {
                case "Left":
                    return "LButton";
                case "Right":
                    return "RButton";
                case "Middle":
                    return "MButton";
            }

            return button;
        }

        void KeyboardHook_KeyDown(object sender, System.Windows.Forms.KeyEventArgs e) {
            e.Handled = HandleKeyOrMouseDown(e.KeyCode.ToString());
        }

        bool HandleKeyOrMouseDown (string keyCodeString) {
            if (keyCodeString == "None") {
                return false;
            }

            if (!keysDown.Contains(keyCodeString)) {
                keysDown.Add(keyCodeString);
            }

            var wasHandledByCombo = false;
            var isCurrentKeyOutsideOfCombo = false;
            var wasHandled = false;

            foreach (var combo in ComboMappings) {
                if (combo.IsValidWith(keysDown)) {
                    wasHandledByCombo = true;

                    if (!runningCombos.ContainsKey(combo.Name)) {
                        runningCombos.Add(combo.Name, combo);

                        // Simulate key up for anything that may have been down.
                        foreach (var keyCodeStringToRemove in combo.Keys) {
                            RunKeyUpAction(keyCodeStringToRemove);
                        }

                        // Run combo after any keyups.
                        combo.ProgramAction.Run();
                    }

                    isCurrentKeyOutsideOfCombo = !combo.Keys.Contains(keyCodeString);
                    wasHandled = true;
                }
            }

            if (!wasHandledByCombo || isCurrentKeyOutsideOfCombo) {
                wasHandled = RunKeyDownAction(keyCodeString);
            }

            if (Program.IsDebug) {
                var message = string.Join(" + ", keysDown);
                System.Console.WriteLine($"Keyboard: {message}");
            }

            return wasHandled;
        }

        void KeyboardHook_KeyUp(object sender, System.Windows.Forms.KeyEventArgs e) {
            e.Handled = HandleKeyOrMouseUp(e.KeyCode.ToString());
        }

        bool HandleKeyOrMouseUp(string keyCodeString) {
            if (keyCodeString == "None") {
                return false;
            }

            if (keysDown.Contains(keyCodeString)) {
                keysDown.Remove(keyCodeString);
            }

            bool wasHandled = RunKeyUpAction(keyCodeString);

            // Invalidate previuos combos.
            var toRemove = new List<string>();
            foreach (var pair in runningCombos) {
                if (!pair.Value.IsValidWith(keysDown)) {
                    pair.Value.ProgramAction.Run(true);
                    toRemove.Add(pair.Key);
                    wasHandled = true;
                    // Simulate key down for other keys in the combo that may still be down.
                    //foreach (var keyCodeStringToAdd in pair.Value.Keys) {
                    //    if (keysDown.Contains(keyCodeStringToAdd)) {
                    //        RunKeyDownAction(keyCodeStringToAdd);
                    //    }
                    //}
                    //runningCombos.Remove(p);
                }
            }
            foreach (var name in toRemove) {
                runningCombos.Remove(name);
            }

            if (Program.IsDebug) {
                var message = string.Join(" + ", keysDown);
                if (string.IsNullOrEmpty(message)) {
                    message = "All keys released";
                }
                System.Console.WriteLine($"Keyboard: {message}");
            }

            return wasHandled;
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
                var programAction = GetActionFromSpec(shorthand);

                if (programAction != null) {
                    if (pair.Key.Contains("+")) {
                        ComboMappings.Add(new Combo(pair.Key, programAction));
                    } else {
                        KeyboardMappings[pair.Key] = programAction;
                    }

                    if (!MappedControllerIndexes.Contains(controllerIndex)) {
                        MappedControllerIndexes.Add(controllerIndex);
                    }
                }
            }

            OnParse?.Invoke(this, new System.EventArgs());
        }

        IProgramAction GetActionFromSpec(object[] spec) {
            var controllerIndex = (int)spec[0];
            var controllerKey = (string)spec[1];

            switch (controllerKey) {
                case "Restart":
                case "Disable":
                case "Enable":
                case "NextMapping":
                case "PreviousMapping":
                    return new SpecialAction { Name = controllerKey };

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
                    var multipliers = ParseAxisMultipliers(spec);
                    var downMultiplier = multipliers[0];
                    var upMultiplier = multipliers[1];
                    var downValue = (int)System.Math.Round(maxValue * downMultiplier);
                    var upValue = (int)System.Math.Round(0 * upMultiplier);

                    return new KeyboardDownToAxis { DownValue = downValue, UpValue = upValue, Index = controllerIndex, Axis = axis };
                }
                default: {
                    var button = (X360Buttons)System.Enum.Parse(typeof(X360Buttons), controllerKey);

                    return new KeyboardDownToButton { Index = controllerIndex, Button = button };
                }
            }
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

    class IProgramAction {
        public virtual void Run(bool IsRelease = false) { }
    }

    class SpecialAction : IProgramAction {
        public string Name;

        public override void Run(bool IsRelease = false) {
            System.Console.WriteLine($"Todo: Implement {Name} in KeyboardMapper (IsRelease: {IsRelease})");
        }
    }

    class IKeyboardActionToGamepad : IProgramAction {
        public int Index;
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

    class Combo {
        public string[] Keys { get; }
        public string Name;
        public int Priority { get; }
        public IProgramAction ProgramAction;

        public Combo(string name, IProgramAction programAction) {
            Name = name;
            ProgramAction = programAction;

            Keys = Name.Split('+');
            Priority = Keys.Length;
        }

        public bool IsValidWith(List<string> keys) {
            return Keys.All((keyCodeString) => keys.Contains(keyCodeString));
        }
    }
}
