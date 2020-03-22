
drop procedure addBigGroupLog;
delimiter ;; 
create procedure addBigGroupLog(in in_from varchar(128), in in_group varchar(128), in_msg varchar(4096))
BEGIN  
    insert bigGroupLog(fromUser, toGroup, msg) values(in_from, in_group, in_msg);
END
;;
delimiter ;