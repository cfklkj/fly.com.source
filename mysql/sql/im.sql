drop database im_tzjV2;
create database im_tzjV2;
use im_tzjV2; 

drop table users;
create table users (
    id int primary key auto_increment,
    user varchar(256)
);
alter table users add index users_u(user);

drop table groups;
create table groups (
    id int primary key auto_increment,
    `group` varchar(256)
);
alter table groups add index goups_g(`group`);


drop table groupMembers;
create table groupMembers ( 
    groupid int not null,
    userid int not null,
    primary key (groupid, userid),
    foreign key (userid) references users(id) on delete cascade,
    foreign key (groupid) references groups(id) on delete cascade
); 



-- messages 
drop table singleMsg;
create table singleMsg (
    id int primary key auto_increment, 
    fromUser varchar(128),
    toUser varchar(128),
    msg varchar(4096)
);
alter table singleMsg add index singleMsg_ft(fromUser, toUser);


drop table groupMsg;
create table groupMsg (
    id int primary key auto_increment, 
    fromUser varchar(128),
    toGroup varchar(128),
    msg varchar(4096)
);
alter table groupMsg add index groupMsg_g(toGroup);


--big group log
drop table bigGroupLog;
create table bigGroupLog (
    id int primary key auto_increment, 
    fromUser varchar(128),
    toGroup varchar(128),
    msg varchar(4096)
);  


--tips 
drop table msgTips;
create table msgTips (
    id int primary key auto_increment, 
    fromUser varchar(128),
    toUser varchar(128)
);
alter table msgTips add index msgTips_t(toUser);


drop table mucMsgTips;
create table mucMsgTips (
    id int primary key auto_increment, 
    `group` varchar(128),
    toUser varchar(128)
);
alter table mucMsgTips add index mucMsgTips_g(toUser);

 
