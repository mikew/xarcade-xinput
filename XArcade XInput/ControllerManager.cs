using ScpDriverInterface;

namespace XArcade_XInput {
    class ControllerManagerEventArgs : System.EventArgs {
        public int Index;
        public X360Controller Controller;
    }

    public enum X360Axis {
        LeftTrigger,
        RightTrigger,
        LeftStickX,
        LeftStickY,
        RightStickX,
        RightStickY,
    }

    class ControllerManager {
        public event System.EventHandler<ControllerManagerEventArgs> OnChange;

        X360Controller[] controllers = new X360Controller[] {
            new X360Controller(),
            new X360Controller(),
            new X360Controller(),
            new X360Controller(),
        };

        public void ButtonDown (int Index, X360Buttons Button) {
            var current = controllers[Index];
            var next = new X360Controller(current);
            next.Buttons |= Button;

            if (current.Buttons == next.Buttons) {
                return;
            }

            controllers[Index] = next;
            InvokeChange(Index);
        }

        public void ButtonUp (int Index, X360Buttons Button) {
            var current = controllers[Index];
            var next = new X360Controller(current);
            next.Buttons &= ~Button;

            if (current.Buttons == next.Buttons) {
                return;
            }

            controllers[Index] = next;
            InvokeChange(Index);
        }

        public void SetAxis (int Index, X360Axis Axis, int Value) {
            int current = int.MinValue;
            var controller = controllers[Index];

            switch (Axis) {
                case X360Axis.LeftTrigger:
                    current = controller.LeftTrigger;
                    break;
                case X360Axis.RightTrigger:
                    current = controller.RightTrigger;
                    break;
                case X360Axis.LeftStickX:
                    current = controller.LeftStickX;
                    break;
                case X360Axis.LeftStickY:
                    current = controller.LeftStickY;
                    break;
                case X360Axis.RightStickX:
                    current = controller.RightStickX;
                    break;
                case X360Axis.RightStickY:
                    current = controller.RightStickY;
                    break;
            }

            if (current == int.MinValue) {
                return;
            }

            if (current == Value) {
                return;
            }

            switch (Axis) {
                case X360Axis.LeftTrigger:
                    controller.LeftTrigger = (byte)Value;
                    break;
                case X360Axis.RightTrigger:
                    controller.RightTrigger = (byte)Value;
                    break;
                case X360Axis.LeftStickX:
                    controller.LeftStickX = (short)Value;
                    break;
                case X360Axis.LeftStickY:
                    controller.LeftStickY = (short)Value;
                    break;
                case X360Axis.RightStickX:
                    controller.RightStickX = (short)Value;
                    break;
                case X360Axis.RightStickY:
                    controller.RightStickY = (short)Value;
                    break;
            }

            InvokeChange(Index);
        }

        void InvokeChange (int Index) {
            OnChange?.Invoke(null, new ControllerManagerEventArgs {
                Index = Index,
                Controller = controllers[Index],
            });
        }
    }
}
