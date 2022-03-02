#! /usr/bin/env python

import rospy
from geometry_msgs.msg import Pose
from geometry_msgs.msg import PoseWithCovarianceStamped
from actionlib_msgs.msg import GoalStatus
from move_base_msgs.msg import MoveBaseActionGoal, MoveBaseAction, MoveBaseResult, MoveBaseGoal
import actionlib
import time
import rosparam


class SendCoordinates(object):
    def __init__(self, label):
        self._success = False

        client = actionlib.SimpleActionClient('/move_base', MoveBaseAction)
        rate = rospy.Rate(1)

        bla = 10
        while bla > 0:
            bla -= 1
            rate.sleep()

        self._success = True
        print('FAKE: successfuly reached point')
        self.shutdownhook()
        return

        goal=MoveBaseGoal()
        goal_tmp = Pose()
        
        self._ctrl_c = False
        rospy.on_shutdown(self.shutdownhook)
        
        
        tag = label
        
        while not self._ctrl_c:
    
            goal_tmp.position.x=rosparam.get_param(tag+'/position/x')
            goal_tmp.position.y=rosparam.get_param(tag+'/position/y')
            goal_tmp.position.z=rosparam.get_param(tag+'/position/z')
            goal_tmp.orientation.x=rosparam.get_param(tag+'/orientation/x')
            goal_tmp.orientation.y=rosparam.get_param(tag+'/orientation/y')
            goal_tmp.orientation.z=rosparam.get_param(tag+'/orientation/z')
            goal_tmp.orientation.w=rosparam.get_param(tag+'/orientation/w')
            goal.target_pose.pose=goal_tmp
            goal.target_pose.header.frame_id='map'
            
            client.wait_for_server()
            client.send_goal(goal, feedback_cb=self.callback)
            client.wait_for_result()
            result=client.get_state()
                
            #print result
            if result==3:
                print('successfuly reached point')
                self._success = True
                self.shutdownhook()
                
            
    def shutdownhook(self):
            
        rospy.loginfo("shutdown time!")
        self._ctrl_c = True
        
    def callback(self, data):
        return 

    @property
    def success(self):
        return(self._success)

if __name__ == "__main__":
    rospy.init_node('shotbot_motion_node') 
    rospy.loginfo('ShotBot Motion: node created')
    rospy.spin()