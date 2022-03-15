#!/usr/bin/env python
import rospy
from std_msgs.msg import String, Bool
from shotbot.srv import PositionMessage, PositionMessageResponse


def receiveHandle(data):
    rospy.loginfo("ShotBot Receiver: new target set: %s", data.data)
    try:
        serviceHandler = rospy.ServiceProxy('shotbot', PositionMessage)
        response = serviceHandler(data.data)
        rospy.loginfo("ShotBot Receiver: got response from service: %s", response.destinationReached)
        pub = rospy.Publisher('shotbot_targetReached', Bool, queue_size=10)
        pub.publish(response.destinationReached)

    except rospy.ServiceException as ex:
        rospy.loginfo('ShotBot Receiver: error with service: %s', ex)


def shotbotReceiver():
    rospy.loginfo("ShotBot Receiver: starting (waiting for service)")
    # wait for service to be constructed
    rospy.wait_for_service('shotbot')
    # subscribe to topic to listen for incoming commands
    rospy.Subscriber('shotbot_gotoTarget', String, receiveHandle)
    # keep "thread" running
    rospy.loginfo("ShotBot Receiver: started and subscribed")
    rospy.spin()

if __name__ == '__main__':
    # init the node to communicate with other nodes
    rospy.init_node('shotbot_receiver')
    rospy.loginfo('ShotBot Receiver: node created')
    try:
        shotbotReceiver()
    except rospy.ROSInterruptException:
        rospy.loginfo("ShotBot Receiver: Node terminated")
