## System requirements

__signalk-switchbank__ has no special installation requirements.

Target relay switchbanks must respond to PGN127502 Switchbank Update messages.

Be aware that the Signal K specification for switch handling is subject to
developmental change.

In the context of NMEA2000 switchbank integration, Signal K currently presents
two paths for each identified switchbank channel:

- electrical.switches._instance_._channel_.index reports just the channel
address of the associated switch (i.e. bus and instance addresses are not
reported);

- electrical.switches._instance_._channel_.state reports the binary state
of the associcated switch.

It is, therefore, not currently possible to fully qualify an NMEA 2000 switch
address from data reported in Signal K, other than by interpreting the Signal
K path and __signalk-switchbank__ uses the path components _instance_ and
_channel_ to derive switchbank address and channel address.

