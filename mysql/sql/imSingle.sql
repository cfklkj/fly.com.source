
drop procedure addUser;
delimiter ;; 
create procedure addUser(in in_userid varchar(256))
BEGIN 
    insert into users(user)  select in_userid from dual where NOT EXISTS (SELECT 1 FROM users WHERE  user= in_userid);

    select id from users where user = in_userid;
END
;;
delimiter ;


drop procedure addSingleMsg;
delimiter ;; 
create procedure addSingleMsg(in in_from varchar(128), in in_to varchar(128), in_msg varchar(4096))
BEGIN   
    insert singleMsg(fromUser, toUser, msg) values(in_from, in_to, in_msg);
END
;;
delimiter ;


drop procedure getSingleMsgLength;
delimiter ;; 
create procedure getSingleMsgLength(in in_from varchar(128), in in_to varchar(128))
BEGIN 
    select cout(id) as len from singleMsg where (fromId = in_from and toId = in_to ) or (fromId = in_to and toId = in_from );
END
;;
delimiter ;


drop procedure getSingleMsgDetail;
delimiter ;; 
create procedure getSingleMsgDetail(in in_from varchar(128), in in_to varchar(128), in in_index int)
BEGIN 
    select fromUser, toUser, msg from singleMsg where (fromUser = in_from and toUser = in_to ) or (fromUser = in_to and toUser = in_from ) order by id limit in_index, 1;
END
;;
delimiter ;


 

