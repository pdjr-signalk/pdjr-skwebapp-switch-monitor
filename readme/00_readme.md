# signalk-switchbank

Operate NMEA 2000 compliant switchbank relays from Signal K switch inputs or
from Signal K notifications.

This project implements a plugin for the
[Signal K Node server](https://github.com/SignalK/signalk-server-node).

Reading the [Alarm, alert and notification handling](http://signalk.org/specification/1.0.0/doc/notifications.html)
section of the Signal K documentation may provide helpful orientation.

The primary purpose of __signalk-switchbank__ is to operate NMEA 2000 compliant
switchbank relays in response to changes in NMEA 2000 switchbank channels.  The
sole operating principle is the mapping of one or more input channel states
onto an output channel state through the application of a user defined rule.

Rules are defined in the plugin configuration file and are must be expressed
as propositions in disjunctive normal form (DNF).

In fact, input channels can be any key under ```electrical.switches...```
which has a binary state (i.e. not just NMEA 2000 switchbanks) and any
key under ```notifications...``` with one or more alarm states that
correspond to an "ON" condition.

Similarly, output can take the form of a PGN127502 Switchbank Control message
(to change the state of a remote relay), or the insertion of an arbitrary key
value into the server ```notifications...``` tree.

The plugin can be configured through a conventional Signal K configuration
screen.  For the purpose of exposition, the following examples illustrate some
variations for a single rule in the raw JSON configuration file.

Example 1 - operate the N2K relay on switchbank 10 channel 4 from the
N2K switch on switchbank 0 channel 5.
```
{
  "description": "DISCHARGE PUMP",
  "output": "(10,4)",
  "input": [ "(0,5)" ]
}
```

Example 2 - extends Example 1 to include a disjunction: the relay is
now operated either by the switch OR by the presence of an 'alert'
notification on the specified path.
```
{
  "description": "Discharge pump",
  "output": "(10,4)",
  "input": "[ "(0,5)", "notifications.tanks.0.wasteWater.currentLevel:alert" ]
}
```
This example illustrates that alternative inputs are simply listed as
separate items in the "input" array, with each item being a clause
in the resulting logic.  There is no arbitrary limit imposed on the
number of clausal expressions.
 
Example 3 - extends Example 2 to include a conjunction: the relay is still
operated by the presence of the notification, but only if the switch on
switchbank 1 channel 0 is also ON.
```
{
  "description": "Discharge pump",
  "output": "(10,4)",
  "input": "[ "(0,5)", "(1,0) notifications.tanks.0.wasteWater.currentLevel:alert" ]
}
```
This example illustrates that inputs which must be simultaneously present
are expressed as separate space-delimited terms within a clause.

Example 4 - illustrates negation be re-writing Example 2 so that the relay
is operated either by the switch connected to switchbank 0 channel 5 or
when the notification state is not 'normal'.
```
{
  "description": "Discharge pump",
  "output": "(10,4)",
  "input": "[ "(0,5)", "!notifications.tanks.0.wasteWater.currentLevel:normal" ]
}
```

Example 5 - illustrates the output of a notification rather than a switchbank
control.  In this case, a simple warning that two relay outputs are being operated
simultaneously (remember here that NMEA relay outputs report their state in
exactly the same way as switches and can thus be terms in the rule "input").
```
{
  "description": "Pumping and flushing simultaneously",
  "output": "notification.flushingandpumping:warning:The discharge pump and flush pump are both operating",
  "input": [ "(10,4) (10,5)" ]
}
```
