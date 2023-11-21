# Xbox Cloud Keyboard/Mouse => Emulated Gamepad

Chrome extension to play on Xbox Cloud with a mouse/keyboard instead of a joystick.

Based on the [TouchStadia](https://chromewebstore.google.com/detail/touchstadia/kdkboloommjpbahkdlhengbghlhcejaj) extension.

## Supported Sites

- https://www.xbox.com
- https://hardwaretester.com/gamepad

## Key Map

Toggle activation and mouse lock with `]` key.

It's hard configured for Starfield- update the button map in `emulatedGamepad` to modify:

| Key                 | Button Equivalent | Function                           |
|---------------------|-------------------|-----------------------------------|
| W, A, S, D          | Left Stick        | Directional movement               |
| E                   | A                 | Activate                           |
| C, Escape, B        | B                 | Sneak, Back                        |
| R, X                | X                 | Reload                             |
| Space, Y            | Y                 | Jump                               |
| 1                   | L1                | Flashlight/Scanner                 |
| P, 0                | R1                | Grenade                            |
| Right Mouse Button  | L2                | Aim                                |
| Left Mouse Button   | R2                | Fire                               |
| Shift               | L3                | Run                                |
| Middle Mouse Button | R3                | Bash                               |
| \                   | Select            | Select button                      |
| Enter               | Start             | Start button                       |
| I, J, K, L          | D-pad Up, Left, Down, Right | D-pad functions   |
| H                   | Home              | Home button                        |

## Installation

[Loading an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)

## TODOs

- Arrow key dpad
- Customize buttons from extensions
- Configurable mouse sensitivity
- Single Key -> Multi Button support
