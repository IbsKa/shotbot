# ROS

## Setup

1. alias Befehle für IP-Adressen

``` shell
echo alias IP_ADRESSE_PC='IP_ADRESSE_PC' >> ~/.bahsrc
echo alias IP_ADRESSE_shotbot='IP_ADRESSE_shotbot' >> ~/.bahsrc
(Heim_Netzwerk Shotbot_IP: 172.16.11.125) >> ~/.bahsrc
echo alias YOUR_PC_='NAME_OF_YOUR_PC' >> ~/.bahsrc
```

2. ros installieren

``` shell
sudo apt-get update
sudo apt-get upgrade
wget https://raw.githubusercontent.com/ROBOTIS-GIT/robotis_tools/master/install_ros_melodic.sh
chmod 755 ./install_ros_melodic.sh
bash ./install_ros_melodic.sh
```

3. IP-Adressen in den /etc/hosts hinterlegen 

``` shell
echo $IP_ADRESSE_PC $YOUR_PC >> /etc/hosts 
echo $IP_ADRESSE_shotbot shotbot >> /etc/hosts
```

4. siehe 2. über ssh beim shotbot

5. rosdep installieren

``` shell
sudo apt-get install python-rosdep
sudo rosdep init
rosdep update
rosdep install --from-paths src --ignore-src -r -y (installiert alle relevanten packages)
```

6. Kompilieren

``` shell
cd ~/shotbot/catkin_ws
catkin_make
```
Falls beim Kompilieren einzelne packages fehlen sollten, über folgenden Befehl nachinstallieren oder aus github holen:
`sudo apt install ros-melodic-$package`

6. Entwicklungsumgebung setzen für PC

``` shell
echo source /home/$USER_NAME/shotbot/catkin_ws/devel/setup.bash >> ~/.bashrc
echo export ROS_MASTER_URI=http://$YOUR_PC:11311 >> ~/.bashrc
echo export ROS_HOSTNAME=§YOUR_PC >> ~/.bashrc
```

7. alias für gängige Befehle hinzufügen

	7.1 remotePC
``` shell
echo alias cw='cd ~/shotbot/catkin_ws' >> ~/.bashrc
echo alias cs='cd ~/shotbot/catkin_ws/src' >> ~/.bashrc
echo alias cm='cd ~/shotbot/catkin_ws && catkin_make' >> ~/.bashrc
echo alias slam='roslaunch turtlebot3_slam turtlebot3_slam.launch' >> ~/.bashrc
echo alias navigation='roslaunch turtlebot3_navigation turtlebot3_navigation.launch' >> ~/.bashrc
echo alias rviz='rosrun rviz rviz' >> ~/.bashrc
```
	7.2 shotbot
``` shell
echo alias cw='cd ~/shotbot_raspi/catkin_ws' >> ~/.bashrc
echo alias cs='cd ~/shotbot_raspi/catkin_ws/src' >> ~/.bashrc
echo alias cm='cd ~/shotbot_raspi/catkin_ws && catkin_make' >> ~/.bashrc
echo alias slam='roslaunch turtlebot3_slam turtlebot3_slam.launch' >> ~/.bashrc
echo alias navigation='roslaunch turtlebot3_navigation turtlebot3_navigation.launch' >> ~/.bashrc
echo alias bringup='roslaunch turtlebot3_bringup turtlebot3_robot.launch' >> ~/.bashrc
```

## Navigation

Anleitung SLAM und Navigation allgemein

Beachten auf welchem Rechner die Befehle erfolgen -> Bei Shotbot über ssh 

1. (remotePC) Master muss IMMER laufen, ansonsten kann keine Kommunikation der einzelnen Nodes erfolgen
``` shell
$ roscore
```
2. (shotbot) Roboterinterne Prozesse launchen 
- (Lidar + alle über das OpenCR gesteurten Prozesse, z.B. Ultraschall, Temperatur, Motoren,...)
``` shell
bringup
```
3. (remotePC) SLAM oder Navigation starten  

  3.1 SLAM
``` shell
slam
```

  3.2 Navigation
``` shell
navigation
```

#### SLAM Parameter (gmapping) anpassen

``` shell
~/shotbot/catkin_ws/src/turtlebot3/turtlebot3_slam/config/gmapping_params.yaml
```
[Übersicht der Parameter](http://wiki.ros.org/gmapping)

Auswirkung ausgewählter Parameter in der Bachelor-Arbeit von Laura Slabon dargestellt.

#### Navigation Parameter anpassen 
Gschwindigkeit und Beschleuinigung kann hier angepasst werden

``` shell
~/shotbot/catkin_ws/src/turtlebot3/turtlebot3_navigation/param/costmap_common_param_waffle_pi.yaml
~/shotbot/catkin_ws/src/turtlebot3/turtlebot3_navigation/param/dwa_local_planner_params_waffle_pi.yaml
```
[Informationen zu Costmaps in ROS](http://wiki.ros.org/costmap_2d#Inflation)

Allgemeine Erläuterungen zu den Parametern der Navigation unter:
- [Navigation Tuning Guid](http://wiki.ros.org/navigation/Tutorials/Navigation%20Tuning%20Guide)
- [Navigation Guide](http://kaiyuzheng.me/documents/navguide.pdf)


## Sonstiges

Definition Roboter in Description file:
``` shell
~/shotbot/catkin_ws/src/turtlebot3/turtlebot3_description/urdf/turtlebot3_waffle_pi.urdf.xacro
```

Frames für neue Komponenten müssen zusätzlich in den files des OpenCR boards hinzugefügt werden!

Änderung aller OpenCr gesteuerten Prozesse (Ultraschall, Temperatur, Motoren, Radabstand, etc.) über Arduino IDE am remotePC. 
Dafür das OpenCr über USB mit dem Computer verbinden. 

## Problembehandlung

1. bringup hängt beim OpenCr board
   - Master neu starten (roscore killen)

2. Keine Lidar-Daten in rviz zu sehen
   - Prüfen, ob Nachrichten über das Topic gesendet werden (anderes als 0) mit rostopic echo scan_filtered
   - Wenn nein: Firewall-Einstellungen ändern (shotbot und remotePC) 
   - Wenn nein: Prüfen ob USB-Port der richtige ist oder geändert wurde mit ls /dev/ttyUSB*
   - Wenn es der falsche ist, ist in der Regel der Strombedarf des Lidars zu hoch

3. Allgemeine Probleme
   - Schauen, ob alle Frames vorhanden und miteinander verbunden sind mit rosrun tf view_frames
   - Im aktuellen Ordner wurde eine pdf angelegt (evince frames.pdf)
   - [ROS Debugging](http://wiki.ros.org/tf/Debugging%20tools)
   - Überprüfen, ob alle Nodes publishen/ subscriben (rostopic list)
   - Und ob (sinnvolle) Nachrichten gesendet werden (rostopic echo $topic)
   - Befehl 'roswtf' gibt alle errors oder warnings aus, die aktuell vorhanden sind

# Backend/Frontend für Bestellung
### Setup

Bei Neuinstallation sollte sichergestellt sein, dass sowohl die docker engine als auch docker-compose installiert wurden.

Die Container für backend und frontend werden mit docker-compose gestartet. `--build` kann als Argument hinzugefügt werden wenn es Änderungen im Code gab
``` shell
docker-compose up -d
```

Jegliche Bestelldaten existieren ausschließlich im Speicher, weswegen sie bei einem Neustart verloren gehen würden.

### Configuration

Jegliche Konfiguration wird über die .env-Datei im Root-Verzeichnis vorgenommen:

- VUE_APP_SHOTBOT_IP: The IP or hostname where the backend is running
- VUE_APP_BACKEND_PORT: The port on which the backend listens for requests
- VUE_APP_MAX_SHOTS: The number of shots after all flasks have been refilled
