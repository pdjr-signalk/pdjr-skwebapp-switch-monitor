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
