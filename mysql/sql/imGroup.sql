
drop procedure addGroup;
delimiter ;; 
create procedure addGroup(in in_group varchar(128))
BEGIN 
    insert into groups(`group`)  select in_group from dual where NOT EXISTS (SELECT 1 FROM groups WHERE  `group`= in_group);

    select id from groups where `group` = in_group;
END
;;
delimiter ;

drop procedure delGroup;
delimiter ;; 
create procedure delGroup(in in_group varchar(128))
BEGIN 
    delete from groups where `group`= in_group; 
END
;;
delimiter ;

drop procedure addGroupMember;
delimiter ;; 
create procedure addGroupMember(in in_group varchar(128), in in_user varchar(128))
BEGIN  
    declare userid int;
    declare groupid int;
    select   id into userid from users where user=in_user;
    select id into groupid from groups where `group`=in_group; 
    insert into groupMembers(groupid, userid) values(groupid, userid);
     -- select @groupid, @userid from dual where NOT EXISTS (SELECT 1 FROM groupMembers WHERE groupid=@groupid and userid=@userid);
END
;;
delimiter ;
drop procedure delGroupMember;
delimiter ;; 
create procedure delGroupMember(in in_group varchar(128), in in_user varchar(128))
BEGIN 
    select @userid:= id from users where user=in_user;
    select @groupid:=id from groups where `group`=in_group;
    delete from groupMembers where groupid = @groupid and userid = @userid;
END
;;
delimiter ;

drop procedure addGroupMsg;
delimiter ;; 
create procedure addGroupMsg(in in_from varchar(128), in in_group varchar(128), in_msg varchar(4096))
BEGIN  
    insert groupMsg(fromUser, toGroup, msg) values(in_from, in_group, in_msg);
END
;;
delimiter ;


drop procedure getGroupMsgLength;
delimiter ;; 
create procedure getGroupMsgLength(in in_group varchar(128))
BEGIN 
    select cout(id) as len from groupMsg where toGroup = in_group;
END
;;
delimiter ;


drop procedure getGroupMsgDetail;
delimiter ;; 
create procedure getGroupMsgDetail(in in_group varchar(128),in in_index int)
BEGIN 
    select fromUser, toGroup, msg from groupMsg where  toGroup = in_group order by id limit in_index, 1;
END
;;
delimiter ;
