## Configuration

__signalk-switchbank__ is configured through the Signal K Node server plugin
configuration panel.
Navigate to _Server->Plugin config_ and select the _Switchbank_ tab.

![Plugin configuration panel](readme/screenshot.png)

The configuration panel consist of a Signal K Node server widget containing
_Active_ and _Debug log_ options, a collection of expandable tabs which conceal
specific configuration options, and finally a _Submit_ button which saves the
plugin configuration, commits any changes, and starts or stops the plugin
dependent upon the state of the _Active_ option.

### Initial configuration

You are advised to initially configure the plugin in the following way. 

1. Check the _Active_ option.

2. Follow the guidance in the 'Switchbanks' section below to tell the plugin
about connected NMEA 2000 switchbanks, then click _Submit_ and use the
__signalk-switchbank__ webapp to confirm that the displayed switchbank state
accurately represents the system you are working on.

3. Follow the guidance in the 'Rules' section below to tell the plugin how to
generate outputs.  If your outputs are NMEA 2000 switchbank relays and you
defined these in (2) then you can check rule behaviour ta any time by clicking
_Submit_ and referring to the webapp.

### Switchbanks

The _Switchbanks_ tab opens (and closes) a list which defines the NMEA 2000
switchbanks that the plugin will monitor and operate.

Each switchbank is defined by the following properties.

__Instance__  
Required integer property which identifies a switchbank of interest by
specifying its NMEA 2000 instance number in decimal.

__Description__  
An optional text property describing the switchbank. Including the device
location, type and/or serial number here can be a helpful _aide-memoire_. 

__Channels__  
Required list property defining switchbank channels.  Note that the NMEA
2000 specification restricts this list to a maximum of 28 channels per
switchbank, but physical devices usually implement fewer channels.  You can
add and remove channels from the switchbank definition using the '+' and '-'
list controls.

Each channel is defined by two properties:

__Index__
Required integer property specifying the number of the channel being defined
in decimal.  Note that the this value should conform to NMEA 2000 conventions
not Signal K (i.e. switchbank channel numbering starts at zero not one). 

__Description__
An text property describing the channel.

### Rules

Clicking on the _Rules_ tab opens a list of rules which entirely define the
function of __signalk-switchbank__.  You can add and delete rules using the
'+' and '-' rule controls.

For any particular physical output there must be exactly one corresponding
rules.  Each rule s defined by the following three properties.

__Description__  
Optional (but recommended) text describing the rule.  This text is used in
some log messages of the form "Switching _description_ ON" so it is sensible
to make this value identify the associated output.

__Input__  
A required list property which defines the Signal K paths which trigger the
rule.

This field actually specifies a logical proposition in disjunctive normal form
(DNF) where each list entry contains a clause which, if true, will cause the
input to be true (i.e. the clause states are OR'd together).

Each clause contains a space-delimited list of terms which must all be true
for the clause to be true (i.e. the term stated are AND'd together).

A term must specify the key of either a Signal K switch input or a Signal K
notification.  Signal K switch inputs are taken to be true when their
state value is 1, otherwise false.  Signal K notifications are taken to be
true when their state value is "alert", or when their state value is equal
to that specified in the term definition (see below).

A terms logical state can be inverted by prefixing the term with a '!'.

_Specifying a Signal K switch input_

Signal K switch inputs can be specified by Signal K path:
```
electrical.switches.10.1.state
```
or by an NMEA 2000 coded short form:
```
(10,0)
```
Note that because of differences in index base mentioned above, both of
these terms refer to the same Signal K path.

_Specifying a Signal K notification input_

Signal K notifications inputs are specified by a term of the form ```path[:state]```
where _path_ is the full path to the notification key and _state_ is the
notification state that will be deemed true.  If _state_ is not specified, then
the value 'normal' will be assumed and the whole term will be negated.

Some exampls of input field values might help.

```[ "(10,0)" ]``` - input is true when NMEA 2000 switchbank instance 10
channel 0 is ON.

```[ "!(10,0)" ]``` - input is true when NMEA 2000 switchbank instance 10
channel 0 is OFF.

```[ "(10,0)", "!(10,1)" ]``` - input is true when NMEA 2000 switchbank
instance 10 channel 0 is ON and switchbank instance 10 channel 1 is OFF.

```[ "(10,0)", "notification.switchmeon:alert" ]``` - input is true when NMEA
2000 switchbank instance 10 channel 0 is ON and ```notification.switchmeon```
has the state value 'alert'.

__Output__

A required text property which specifies the Signal K path which should be
updated when the rule's input changes state.

_Specifying an NMEA 2000 relay output_
Signal K relay can be specified by Signal K path:
```
electrical.switches.10.1.state
```
or by an NMEA 2000 coded short form:
```
(10,0)
```
Note that because of differences in index base mentioned above, both of
these terms refer to the same Signal K path.

_Specifying a Signal K notification output_

In this case, a value of the form ```path[:description[:state[:method]]]```
must be used where _state_ is a valid notification state (e.g. 'normal'
or 'alert'); _method_ is a space delimited list of notification methods
(e.g. 'sound visual'); and _description_ is some arbitrary text for the
notification.

Some examples of output field values might be:

"electrical.switches.3.6.state"

"(3,1)"

"notification.deckwash:Switching deckwash pump on"

"notification.deckwash:Switching deckwash pump on:normal:visual sound"

