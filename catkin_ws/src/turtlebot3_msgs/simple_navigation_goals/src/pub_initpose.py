#!/usr/bin/env python

import rospy
from geometry_msgs.msg import PoseWithCovarianceStamped

def talker():
	pub = rospy.Pub('/initialpose', PoseWithCovarianceStamped, queue_size=10)
	rospy.init_node('pub_initpose', anonymous=True)
	rate = rospy.Rate(10) # 10Hz

	pose = geometry_msgs.msg.PoseWithCovarianceStamped()
	pose.header.frame_id = "map"
	pose.pose.pose.position.x=5.0
	pose.pose.pose.position.y=5.0
	pose.pose.pose.position.z=0
	pose.pose.covariance=[0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06853891945200942]
	pose.pose.pose.orientation.w=1.0

	while not rospy.is_shutdown():
		rospy.loginfo(pose)
		pub.publish(initpose_msg)
    	rate.sleep()
