M569 S1 X Z
G28 X
G1 X1 F4000
G28 Z ;STart
M211 S0 ;disable endstops
G1 Z-9.5 F4000
M42 P203 S255 I; Pumpe an
G4 P100
M42 P204 S255 I;Ventil coldbrew auf
G4 P1000 ; ms pro cl
M42 P204 S0 I ;Ventil zu
M42 P203 S0 I ;Pumpe aus
G4 S5 ;warten 5 Seunden
G1 X40 F2500 ;einfahren in BEcher
G1 X38.5
G1 Z42 F3000 ;Heber wegfahren
M569 S0 X Z
G1 X240 F6000 ; vorfahren bis Abholpos
G4 P200 ;warten 200 msek
M226 P126 -1 ;warten auf Sensor
G4 P1000 ;warten 1 sek
G1 X1 F6000 ; zurueckfahren und Ende
M18
M42 P207 S0 I
M42 P204 S0 I
M42 P205 S0 I
