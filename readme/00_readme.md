# signalk-switch-monitor

Monitor Signal K switch states in real time.

This project implements a webapp for the
[Signal K Node server](https://github.com/SignalK/signalk-server-node).

__signalk-switch-monitor__ displays a graphical representation of the host
Signal K server's ```electrical/switches/*``` tree.

![Switchbank display on the sevelopment system](/readme/screenshot.png)

Displayed data is organised in a way which to a limited extent reflects
the structural principles of the Signal K data tree (see Section 3, belkow).
This ensures, for example, that switches which comprise an NMEA switchbank
are displayed together.

Active switch channels are displayed in colour: if it is possible to determine
the type of a switch channel from system meta data then alternate color will
be used to explicitly differentiate switches from relays.  Channels with status
data which is over 5 seconds old are considered inactive and coloured grey.

The display is updated in real time to reflect actual switch states with the
OFF condition shown dark and the ON condition shown light.

