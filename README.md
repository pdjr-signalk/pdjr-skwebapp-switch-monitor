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

## System requirements

__signalk-switch-monitor__ has no special installation requirements.

The application presents switch channels in one or more _display groups_.
A display group equates to either an NMEA switchbank (identified by its NMEA
instance number) or the catch-all display group "MISC" which collates all
non NMEA switch channels.

If any switch channel has a meta information entry in the Signal K data
tree, then the values of the ```meta.value.type``` and ```meta.value.name```
fields are used to introduce a CSS class and the name of the
## Installation

Download and install __signalk-switch-monitor__ using the _Appstore_ link in your
Signal K Node server console.

The plugin can also be obtained from the 
[project homepage](https://github.com/preeve9534/signalk-switch-monitor)
and installed using
[these instructions](https://github.com/SignalK/signalk-server-node/blob/master/SERVERPLUGINS.md).
## Principle of operation

__signalk-switch-monitor__ displays information for all switch channels which
have state information registered on the host Signal K server under the paths
selected by
```
electrical/switches/*/state
```

The wildcard component of each selected path will usually be either a simple
_channel_ identifier, or a value of the form ''''_group_/_channel_''' which
captures some logical or physical grouping of related switch channels.
The second form is used in Signal K to cluster NMEA switch channels into their
containing switch banks with the _group_ identifier representing an NMEA switch
bank instance address.
More extended structuring principles with multiple groups are rarely
encountered and are resolved by __signalk-switch-monitor__ consolidating
multiple groups into the second form. 
 
Signal K switch channels which derive from NMEA switchbank data deserve special
mention since in this domain (and possibly others) a switch channel represents
the state of either a switch or a relay.
The default Signal K NMEA provider does not capture this difference in switch
channel _type_, but it can be made available as meta information by a
supporting process; indeed such a process could also assign meaningful names
to switch channels in lieu of the channel number assigned by Signal K.

If any switch channel has a meta information entry in the Signal K data
tree, then the values of the ```meta.value.type``` and ```meta.value.name```
fields are used to introduce a CSS class _type_ and to replace the switch
channel label with _name_.
## Configuration

__signalk-switch-monitor__ requires no configuration.
## Usage

__signalk-switch-monitor__ simply displays the state of all switch channels
registsered with the host Signal K server.

Future versions of the app may allow control of relay output switch channels
through the web interface.
