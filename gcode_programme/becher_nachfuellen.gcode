G28 X ;home X
M120 ; aktivere Endstops
G1 Z550 F3000; fahre bis Endstop
G92 Z510
G1 Z0 
M226 P126 -1 ;warten auf Sensor
G1 Z510 F3000
G28 Z
M121; deaktiviere Endstops