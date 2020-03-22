
call addUser("A");
call addUser("B");
call addUser("C");
call addUser("D");
call addSingleMsg('A','B','a-b');
call addSingleMsg('A','B','a-b2');
call addSingleMsg('A','B','a-b3');
call addSingleMsg('A','B','a-b4');
call addSingleMsg('C','B','c-b');
call addSingleMsg('B','C','b-c');
call addSingleMsg('B','C','b-c1');
call addSingleMsg('B','C','b-c2');
call addSingleMsg('C','A','c-a');
call addSingleMsg('B','A','b-a');
call addTipMsg("A", "B");
call addTipMsg("C", "B");
call addTipMsg("B", "A");
call addTipMsg("B", "C");
call addTipMsg("C", "A");
call addGroup('a');
call addGroup('b');
call addGroup('c');
call addGroup('d');
call addGroupMsg('A', 'a','a-a');
call addGroupMsg('A', 'a','a-a');
call addGroupMsg('B', 'a','b-a');
call addGroupMsg('C', 'a','c-a');
call addGroupMsg('C', 'b','c-b');
call addGroupMsg('C', 'c','c-c');
call addGroupMsg('B', 'c','b-c');
call addGroupMsg('D', 'c','d-c');
call addTipMucMsg('a', 'A');
call addTipMucMsg('a', 'B');
call addTipMucMsg('b', 'A');
call addTipMucMsg('c', 'B');

call getMsgTips('B');
call getMucMsgTips('a');

 set @in_from := "test13@test.com";
 set @in_to := "test3@test.com";
 set @in_index :=9;
 select fromUser, toUser, msg from singleMsg where (fromUser = @in_from and toUser = @in_to ) 
  or (fromUser = @in_to and toUser = @in_from ) order by id limit 9, 1;

  call getGroupMsgDetail("test@test.com.muc", 1)