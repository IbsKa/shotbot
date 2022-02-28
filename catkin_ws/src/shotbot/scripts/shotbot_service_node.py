#!/usr/bin/env python
import rospy
from PositionMessage.srv import PositionMessage, PositionMessageResponse

def serviceHandler(request):
    # request is of type PositionMessage
    rospy.loginfo('ShotBot Service: request to move to target %s', request.target)
    return PositionMessageResponse(true) # true when position reached


def shotbotService():
    rospy.loginfo("ShotBot Service: starting")
    # init the node to communicate with other nodes
    rospy.init_node('shotbot_service')
    # register a service with name, parameter going in, the method to call when a request is fired
    service = rospy.Service("shotbot", PositionMessage, serviceHandler)


if __name__ == '__main__':
    shotbotService()
