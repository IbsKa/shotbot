#!/usr/bin/env python
import rospy
import os
import rosparam
from shotbot.srv import PositionMessage, PositionMessageResponse
from shotbot_motion import SendCoordinates


def serviceHandler(request):
    # request is of type PositionMessage
    rospy.loginfo('ShotBot Service: request to move to target %s', request.target)
    response = SendCoordiantes(request.target)
    return response.navigation_successfull

def shotbotService():
    rospy.loginfo("ShotBot Service: setting up service")
    # register a service with name, parameter going in, the method to call when a request is fired
    service = rospy.Service("shotbot", PositionMessage, serviceHandler)
    # keep service running
    rospy.spin()

def shotbotUploadLocations():
    rospy.loginfo("ShotBot Service: uploading locations to parameter service")    
    os.chdir("/home/pcnote73/shotbot/catkin_ws/src/shotbot/locations/")
    paramlist=rosparam.load_file("locations.yaml",default_namespace=None)
        
    for params,ns in paramlist: #ns,param
        for key, value in params.iteritems():
            rosparam.upload_params(ns,params) #ns,param


if __name__ == '__main__':
    # init the node to communicate with other nodes
    rospy.init_node('shotbot_service')
    rospy.loginfo("ShotBot Service: node created")
    shotbotUploadLocations()
    shotbotService()
