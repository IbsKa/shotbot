#! /usr/bin/env python

import rospy
from navigation_exam.srv import SendPosition, SendPositionResponse
from geometry_msgs.msg import Pose
from geometry_msgs.msg import PoseWithCovarianceStamped
from send_goals import SendCoordinates
import actionlib
import time
import os
import rosparam


class GetCoordinates(object):
    def __init__(self, srv_name='/send_pose_service'):
        self._srv_name = srv_name
        self._my_service = rospy.Service(self._srv_name, SendPosition , self.srv_callback)

    
    def srv_callback(self, request):
        
        label = request.label
        response = SendPositionResponse()
        """
        ---                                                                                                 
        bool navigation_successfull
        string message # Direction
        """
        
        os.chdir("/home/user/catkin_ws/src/navigation_exam/spots")
        paramlist=rosparam.load_file("spots.yaml",default_namespace=None)
        
        for params,ns in paramlist: #ns,param
        
            for key, value in params.iteritems():
                if key == request.label:
                    rosparam.upload_params(ns,params) #ns,param
                    response.message = "Correctly uploaded parameters"
                    
        send_coordinates = SendCoordinates(request.label)
        
        response.navigation_successfull = True
        
        return response


if __name__ == "__main__":
    rospy.init_node('get_coordinates_node', log_level=rospy.INFO) 
    get_coordinates_object = GetCoordinates()
    rospy.spin() # mantain the service open.