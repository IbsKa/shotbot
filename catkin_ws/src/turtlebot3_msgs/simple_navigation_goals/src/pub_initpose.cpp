#include <ros/ros.h>
#include <geometry_msgs/PoseWithCovarianceStamped.h>

int main (int argc, char** argv) 
{
    ros::init(argc, argv, "pub_initpose");
    ros::NodeHandle nh_;
    ros::Publisher initPosePub_ = nh_.advertise<geometry_msgs::PoseWithCovarianceStamped>("initialpose", 2, true);
ros::Rate rate(1.0);
while(nh_.ok()) 
{
    //get time
    ros::Time scanTime_ = ros::Time::now();     
    //create msg
    geometry_msgs::PoseWithCovarianceStamped initPose_;
    //create the time & frame
    initPose_.header.stamp = scanTime_;
    initPose_.header.frame_id = "map";
    //position
    initPose_.pose.pose.position.x = 0.f;
    initPose_.pose.pose.position.y = 0.f;
    //angle
    initPose_.pose.pose.orientation.z = 0.f;
    //publish msg
    initPosePub_.publish(initPose_);
    //sleep
    rate.sleep();
}
return 0;
}
