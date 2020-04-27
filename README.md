# signalk-switch-monitor

Monitor Signal K switch states in real time.

This project implements a webapp for the
[Signal K Node server](https://github.com/SignalK/signalk-server-node).

__signalk-switch-monitor__ displays a graphical representation of the host
Signal K server's ```electrical/switches/*``` tree.  Each detected switch is
displayed as part of a switchbank with switches not implemented under the NMEA
switchvank model aggregated into a "MISC" group.

Active switch channels (i.e. ones for which current state information is
available) are displayed in orange, inactive switches in grey.
If meta information is available for a switch channel then the value of the
```name``` attribute is used as the switch channel label and the value of the
```type``` attribute is used to modify the switch channel background color,
with the color green used to identify switches which have type equal to switch.

The display is updated in real time to reflect actual switch states with the
OFF condition shown dark and the ON condition shown light.

![Switchbank display on the sevelopment system](/readme/screenshot.png)
## System requirements

__signalk-switch-monitor__ has no special installation requirements.
## Installation

Download and install __signalk-switch-monitor__ using the _Appstore_ link in your
Signal K Node server console.

The plugin can also be obtained from the 
[project homepage](https://github.com/preeve9534/signalk-switch-monitor)
and installed using
[these instructions](https://github.com/SignalK/signalk-server-node/blob/master/SERVERPLUGINS.md).
## Configuration

__signalk-switch-monitor__ requires no configuration.
## Usage

__signalk-switch-monitor__ simply displays the state of all switch channels
registsered with the host Signal K server.

Future versions of the app may allow control of relay output switch channels
through the web interface.
