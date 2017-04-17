# X-Arcade XInput

Turns an X-Arcade joystick into 360 Controllers.

Technically, turns any keyboard input into 360 Controllers, but the default is to support X-Arcade joysticks in Mode 1.

## Installation

1. Download
2. Instal ScpDriver
3. Run in Admin Command Prompt:
    ```dos
    netsh advfirewall firewall add rule name="XArcade XInput" dir=in action=allow protocol=TCP localport=32123
    netsh http add urlacl "url=http://*:32123/" user=Everyone
    ```
3. Run `XArcade XInput.exe`

## Why

[X-Arcade suggest](https://support.xgaming.com/support/solutions/articles/12000003227-use-x-arcade-as-a-windows-joystick-gamepad-controller-xinput-) a number of different methods of getting your joystick to appear as a DirectInput or XInput controller in Windows. What you end up with is:

1. Keyboard -> DirectInput (Headsoft VJoy)
2. DirectInput -> XInput (XOutput)

Steam's Generic Controller Support should let you skip the second part, but it's not.

Or you can search the internet, and find any combinations like:

- Keyboard -> UCR -> A Different vJoy -> vXboxInterface
- Keyboard -> Headsoft VJoy -> x360ce -> ViGEm

That's a lot of indirection. There's none of that here. Just Keyboard to XInput.

## Usage

The default mapping will work with [X-Arcade joysticks using recent PCBs](https://shop.xgaming.com/pages/new-x-arcade-pcb) in Mode 1.

Open [http://localhost:32123/](http://localhost:32123/) in a browser to to access the Web UI. From here you can turn it on or off, and change the mappings.

## Mappings

You can change any keyboard key to output any single 360 Controller Button or Axis:

```json
{
    "W": [0, "LeftStickY", 0.5, 0],
    "S": [0, "LeftStickY", -1],
    "E": [0, "X"]
}
```

The syntax is JSON, where the key on the left is one of [System.Windows.Forms.Keys](https://msdn.microsoft.com/en-us/library/system.windows.forms.keys(v=vs.110).aspx#Anchor_1), and the value is an array of `[controllerIndex, controllerButtonOrAxis, ...parameters]`

If given an axis, like `LeftStickX` or `RightTrigger`, you can supply up to two more parameters: The first being the percentage when the key is down, and the second being the percentage when the key is released.

So, in the example above, `W` would push the left stick forward to 50%, and `S` would pull it all the way back to 100%.

Note that no matter what you have mapped, pressing the equivalent of `RB + Start` will press the `Guide / Home / Logo` button.