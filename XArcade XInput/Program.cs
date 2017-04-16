using ScpDriverInterface;

namespace XArcade_XInput {
    class Program {
        static Gma.System.MouseKeyHook.IKeyboardMouseEvents KeyboardHook;
        static ControllerManager Manager;
        static ScpBus Bus;
        static bool IsRunning = false;

        static void Main (string[] args) {
            KeyboardHook = Gma.System.MouseKeyHook.Hook.GlobalEvents();
            Manager = new ControllerManager();
            Bus = new ScpBus();

            Start();

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

        private static void Manager_OnChange (object sender, ControllerManagerEventArgs e) {
            Bus.Report(e.Index + 1, e.Controller.GetReport());
        }

        private static void KeyboardHook_KeyDown (object sender, System.Windows.Forms.KeyEventArgs e) {
            var isHandled = false;

            switch (e.KeyCode) {
                case System.Windows.Forms.Keys.Escape:
                    isHandled = true;
                    if (IsRunning) {
                        Stop();
                    }
                    break;

                case System.Windows.Forms.Keys.LShiftKey:
                    Manager.ButtonDown(0, X360Buttons.A);
                    isHandled = true;
                    break;
                case System.Windows.Forms.Keys.Z:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.B);
                    break;
                case System.Windows.Forms.Keys.LControlKey:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.X);
                    break;
                case System.Windows.Forms.Keys.Alt:
                case System.Windows.Forms.Keys.LMenu:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.Y);
                    break;
                case System.Windows.Forms.Keys.D1:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.Start);
                    break;
                case System.Windows.Forms.Keys.D3:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.Back);
                    break;
                case System.Windows.Forms.Keys.C:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.LeftBumper);
                    break;
                case System.Windows.Forms.Keys.Space:
                    isHandled = true;
                    Manager.ButtonDown(0, X360Buttons.RightBumper);
                    break;

                case System.Windows.Forms.Keys.Up:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickY, short.MaxValue);
                    break;
                case System.Windows.Forms.Keys.Down:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickY, short.MinValue);
                    break;
                case System.Windows.Forms.Keys.Left:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickX, short.MinValue);
                    break;
                case System.Windows.Forms.Keys.Right:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickX, short.MaxValue);
                    break;

                case System.Windows.Forms.Keys.D5:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftTrigger, byte.MaxValue);
                    break;
                case System.Windows.Forms.Keys.X:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.RightTrigger, byte.MaxValue);
                    break;
            }

            if (isHandled) {
                e.Handled = true;
            }
        }

        private static void KeyboardHook_KeyUp (object sender, System.Windows.Forms.KeyEventArgs e) {
            var isHandled = false;

            switch (e.KeyCode) {
                case System.Windows.Forms.Keys.LShiftKey:
                    Manager.ButtonUp(0, X360Buttons.A);
                    isHandled = true;
                    break;
                case System.Windows.Forms.Keys.Z:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.B);
                    break;
                case System.Windows.Forms.Keys.LControlKey:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.X);
                    break;
                case System.Windows.Forms.Keys.Alt:
                case System.Windows.Forms.Keys.LMenu:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.Y);
                    break;
                case System.Windows.Forms.Keys.D1:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.Start);
                    break;
                case System.Windows.Forms.Keys.D3:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.Back);
                    break;
                case System.Windows.Forms.Keys.C:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.LeftBumper);
                    break;
                case System.Windows.Forms.Keys.Space:
                    isHandled = true;
                    Manager.ButtonUp(0, X360Buttons.RightBumper);
                    break;

                case System.Windows.Forms.Keys.Up:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickY, 0);
                    break;
                case System.Windows.Forms.Keys.Down:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickY, 0);
                    break;
                case System.Windows.Forms.Keys.Left:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickX, 0);
                    break;
                case System.Windows.Forms.Keys.Right:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftStickX, 0);
                    break;

                case System.Windows.Forms.Keys.D5:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.LeftTrigger, byte.MinValue);
                    break;
                case System.Windows.Forms.Keys.X:
                    isHandled = true;
                    Manager.SetAxis(0, X360Axis.RightTrigger, byte.MinValue);
                    break;
            }

            if (isHandled) {
                e.Handled = true;
            }
        }
    }
}
