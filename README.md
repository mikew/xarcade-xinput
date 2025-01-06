# X-Arcade XInput

[![][ci badge]][ci link]

Turns an X-Arcade joystick into 360 Controllers.

Technically, turns any keyboard input into 360 Controllers, but the default is to support X-Arcade joysticks in Mode 1.

## Installation

1. [Download the latest release](https://github.com/mikew/xarcade-xinput/releases/latest)
1. Double-click `Install Driver.exe`.
1. Run `XArcade XInput.exe`
1. [Test in the HTML5 Gamepad Tester](https://greggman.github.io/html5-gamepad-test/)

## Manual Installation

1. [Download the latest release](https://github.com/mikew/xarcade-xinput/releases/latest)
1. Run `Scp Driver Installer\ScpDriverInstaller.exe` and press `Install`
1. Run in Admin Command Prompt:
   ```dos
   netsh advfirewall firewall add rule name="XArcade XInput" dir=in action=allow protocol=TCP localport=32123
   netsh http add urlacl url=http://+:32123/ user=Everyone
   ```
1. Run `XArcade XInput.exe`
1. [Test in the HTML5 Gamepad Tester](https://greggman.github.io/html5-gamepad-test/)

## Usage

The default mapping will work with [X-Arcade joysticks using recent PCBs](https://shop.xgaming.com/pages/new-x-arcade-pcb) in Mode 1.

Open [http://localhost:32123/](http://localhost:32123/) in a browser to to access the Web UI. From here you can turn it on or off, and change the mappings. The Web UI can also be accessed on any phone, tablet, or other computer.

## Mappings

You can change any keyboard key to output any single 360 Controller Button or Axis:

```json
{
  "W": [0, "LeftStickY", 0.5, 0],
  "S": [0, "LeftStickY", -1],
  "E": [0, "X"]
}
```

The syntax is JSON, where the key on the left is one of [System.Windows.Forms.Keys](<https://msdn.microsoft.com/en-us/library/system.windows.forms.keys(v=vs.110).aspx#Anchor_1>), and the value is an array of `[controllerIndex, controllerButtonOrAxis, ...parameters]`

If given an axis, like `LeftStickX` or `RightTrigger`, you can supply up to two more parameters: The first being the percentage when the key is down, and the second being the percentage when the key is released.

So, in the example above, `W` would push the left stick forward to 50%, and `S` would pull it all the way back to 100%.

Note that no matter what you have mapped, pressing the equivalent of `RB + Start` will press the `Guide / Home / Logo` button.

## Command Line Arguments

You can pass arguments when running XArcade XInput:

| Argument           | Purpose                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `--debug`          | Prints some debug information.                                                                                                              |
| `--default`        | Force using the default mapping. This can help if you get stuck when writing your own mappings. This takes precedence over other arguments. |
| `--skip-ui`        | Will prevent your browser from opening.                                                                                                     |
| `--start-disabled` | Won't listen for keyboard events when starting.                                                                                             |
| `--mapping`        | Name of mapping, as seen in app, to load instead of the previous. Helps when different games require different configurations.              |

## Why

[X-Arcade used to suggest](https://support.xgaming.com/support/solutions/articles/12000003227-use-x-arcade-as-a-windows-joystick-gamepad-controller-xinput-) a number of different methods of getting your joystick to appear as a DirectInput or XInput controller in Windows. What you end up with is:

1. Keyboard -> DirectInput (Headsoft VJoy)
2. DirectInput -> XInput (XOutput)

Steam's Generic Controller Support should let you skip the second part, but it's not.

Or you can search the internet, and find any combinations like:

- Keyboard -> UCR -> A Different vJoy -> vXboxInterface
- Keyboard -> Headsoft VJoy -> x360ce -> ViGEm

That's a lot of indirection. There's none of that here. Just Keyboard to XInput.

[ci link]: https://github.com/mikew/xarcade-xinput/actions
[ci badge]: https://github.com/mikew/xarcade-xinput/actions/workflows/ci.yml/badge.svg?branch=master
