
drop procedure addTipMsg;
delimiter ;; 
create procedure addTipMsg(in in_from varchar(128), in in_to varchar(128))
BEGIN  
    insert into msgTips(fromUser, toUser)  select in_from,in_to from dual where NOT EXISTS (SELECT 1 FROM msgTips WHERE  fromUser=in_from and toUser=in_to);
 
END
;;
delimiter ;


drop procedure getMsgTips;
delimiter ;; 
create procedure getMsgTips(in in_to varchar(128))
BEGIN   
    select  A.fromUser, count(0) as len from singleMsg as B, (select fromUser, toUser from msgTips where toUser = in_to) as A 
     where (B.fromUser = A.fromUser and B.toUser = A.toUser ) or (B.fromUser = A.toUser and B.toUser = A.fromUser)
     group by A.fromUser having count(A.fromUser) > 0;
END
;;
delimiter ;



drop procedure delMsgTips;
delimiter ;; 
create procedure delMsgTips(in in_to varchar(128))
BEGIN 
    delete from msgTips where toUser = in_to;
END
;;
delimiter ;
-- muc ----tips
drop procedure addTipMucMsg;
delimiter ;; 
create procedure addTipMucMsg(in in_group varchar(128),  in in_to varchar(128))
BEGIN  
    insert into mucMsgTips(`group`, toUser)  select in_group, in_to from dual where NOT EXISTS (SELECT 1 FROM mucMsgTips WHERE   `group`=in_group and toUser=in_to);
 
END
;;
delimiter ;  


drop procedure getMucMsgTips;
delimiter ;; 
create procedure getMucMsgTips(in in_to varchar(128))
BEGIN   
    select  A.`group`, count(0) as len from groupMsg as B, (select `group`, toUser from mucMsgTips where toUser = in_to) as A where B.toGroup = A.`group` group by A.`group` having count(A.`group`) > 0;
END
;;
delimiter ;


drop procedure delMucMsgTips;
delimiter ;; 
create procedure delMucMsgTips(in in_to varchar(128))
BEGIN 
    delete from mucMsgTips where toUser = in_to;
END
;;
delimiter ;