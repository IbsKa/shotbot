#!/usr/bin/env python
import rospy
from std_msgs.msg import String
from PositionMessage.srv import PositionMessage, PositionMessageResponse


def receiveHandle(data):
    rospy.loginfo("ShotBot Receiver: new target set: %s", data.data)
    try:
        serviceHandler = rospy.ServiceProxy('shotbot', PositionMessage)
        response = serviceHandler(data.data)

    except rospy.ServiceException as ex:
        rospy.loginfo('ShotBot Receiver: error with service: %s', ex)


def shotbotReceiver():
    rospy.loginfo("ShotBot Receiver: starting")
    # init the node to communicate with other nodes
    rospy.init_node('shotbot_receiver')
    # wait for service to be constructed
    rospy.wait_for_service('shotbot')
    # subscribe to topic to listen for incoming commands
    rospy.Subscribeer('shotbot_gotoTarget', String, receiveHandle)
    # keep "thread" running
    rospy.spin()

if __name__ == '__main__':
    try:
        shotbotReceiver()
    except rospy.ROSInterruptException:
        rospy.loginfo("ShotBot Receiver: Node terminated")
