## System requirements

__signalk-switch-monitor__ has no special installation requirements.

The application presents switch channels in one or more _display groups_.
A display group equates to either an NMEA switchbank (identified by its NMEA
instance number) or the catch-all display group "MISC" which collates all
non NMEA switch channels.

If any switch channel has a meta information entry in the Signal K data
tree, then the values of the ```meta.value.type``` and ```meta.value.name```
fields are used to introduce a CSS class and the name of the
