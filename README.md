# signalk-switch-monitor

Monitor Signal K switch states in real time.

This project implements a webapp for the
[Signal K Node server](https://github.com/SignalK/signalk-server-node).

__signalk-switch-monitor__ displays a graphical representation of the host
Signal K server's ```electrical/switches/*``` tree.  The display is updated
in real time to reflect actual switch states.
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
