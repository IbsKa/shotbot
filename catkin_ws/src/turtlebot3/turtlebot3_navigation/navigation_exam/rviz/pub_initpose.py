#!/usr/bin/env python

import rospy
from geometry_msgs.msg import PoseWithCovarianceStamped

	rospy.init_node('pub_initpose' anonymous=True)
	pub = rospy.Pub('/initialpose', PoseWithCovarianceStamped, queue_size=10)

		initpose_msg = PoseWithCovarianceStamped()
		initpose_msg.header.frame_id = "map"
		initpose_msg.pose.pose.position.x=5.0
		initpose_msg.pose.pose.position.y=5.0
		initpose_msg.pose.pose.position.z=0
		initpose_msg.pose.covariance=[0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06853891945200942]
		initpose_msg.pose.pose.orientation.w=1.0

		rate = rospy.Rate(10) # 10Hz

		while not rospy.is_shutdown():
			pub.publish(initpose_msg)
    		rate.sleep()
