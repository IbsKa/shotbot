; senkt becherstapel vollständig ab und verbleibt dort
; mit becher_nachfuelle_2.gcode wird der stapel wieder angehoben
G28 X ;home X (spendearm aus dem weg)
M120 ; aktivere Endstops
G1 Z550 F3000; fahre bis Endstop
G92 Z510 ; (setze definierte hoehe)
G4 S5 ; warte 5 sekunden

;G1 Z0 
;M226 P126 -1 ;warten auf Sensor
;G1 Z510 F3000
;G28 Z
;M121; deaktiviere Endstops
