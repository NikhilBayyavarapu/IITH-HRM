create database hostel_room_management;
use hostel_room_management;

create table student_details(
	name varchar(50) NOT NULL,
	roll_no varchar(20)  NOT NULL primary key unique,
    room_no INT,
    block varchar(1),
    contact_no INT,
    address text,
    guardian_name varchar(30),
    guardian_contact INT
);

create table fees(
	roll_no varchar(20) not null primary key unique,
    foreign key (roll_no) references student_details(roll_no),
    fee_status boolean
);

create table staff_details(
	name varchar(50) NOT NULL,
	id bigint  NOT NULL primary key auto_increment,
    contact_no int,
    staff_type varchar(20)
);

create table hostel_office(
	email varchar(30) not null primary key unique
);

create table inventory(
	id bigint not null primary key auto_increment,
	item_name varchar(30),
    item_status varchar (15)
);

create table inventory_history(
	id bigint not null primary key auto_increment,
	roll_no varchar(20) not null,
    foreign key (roll_no) references student_details(roll_no),
	item_id bigint NOT NULL,
    foreign key (item_id) references inventory(id),
    time timestamp,
    issued boolean
);

create table empty_room_allocataion_requests(
	id bigint not null primary key auto_increment,
    roll_no varchar(20) not null,
    foreign key (roll_no) references student_details(roll_no),
    requested_block varchar(1),
    requested_room int
);

create table room_swap_requests(
	id bigint not null primary key auto_increment,
    roll_no varchar(20) not null,
    foreign key (roll_no) references student_details(roll_no),
	requested_block varchar(1),
    requested_room int,
    consent_from_both boolean
);

create table room_vacataion_requests(
	id bigint not null primary key auto_increment,
    roll_no varchar(20) not null,
    foreign key (roll_no) references student_details(roll_no),
	vacating_time timestamp
);

create table service_requests(
	id bigint not null primary key auto_increment,
    roll_no varchar(20) not null ,
    foreign key (roll_no) references student_details(roll_no),
    staff_type varchar(20),
    requested_timestamp timestamp,
    description text,
    assigned_staff  bigint,
    foreign key (assigned_staff) references staff_details(id),
    assigned_timestamp timestamp,
    completed_timestamp timestamp,
    rating int
);

create table attendance(
	id bigint not null primary key auto_increment,
	roll_no varchar(20) not null ,
    foreign key (roll_no) references student_details(roll_no),
    entry boolean,
    in_out_time timestamp
);

drop function if exists apply_for_room;
delimiter //
create function apply_for_room(roll_num varchar(20), room_num int,block varchar(1))
returns int
begin
	DECLARE check_roll_no varchar(20);
    DECLARE if_exists bool;
	DECLARE if_exists_2 bool;
    select roll_no into check_roll_no from student_details where room_no = room_num limit 1;
    select exists ( select roll_num from empty_room_allocataion_requests where roll_no = roll_num) into if_exists;
    select exists ( select roll_num from room_swap_requests where roll_no = roll_num)into if_exists_2;
    if(if_exists is true OR if_exists_2 is true) then
		return 0;
	end if;
    if(check_roll_no is NULL) then
		insert into empty_room_allocataion_requests(roll_no,requested_block,requested_room) values(roll_num,block,room_num);
        return 1;
	else
		insert into room_swap_requests(roll_no,requested_block,requested_room) values(roll_num,block,room_num);
        return 1;
	end if;
end//
delimiter ;

drop function if exists respond_to_swap;
delimiter //
create function respond_to_swap(roll_num_1 varchar(20), roll_num_2 varchar(20),consent tinyint)
returns int
begin
	DECLARE if_exists bool;
    select exists ( select roll_no from room_swap_requests where roll_no = roll_num_1 and requested_block in (select block from student_details where roll_no = roll_num_2) and  requested_room in (select room_no from student_details where roll_no = roll_num_2))into if_exists;
	if (if_exists is true) then
		update room_swap_requests set consent_from_both = consent where roll_no = roll_num_1 and requested_block in (select block from student_details where roll_no = roll_num_2) and  requested_room in (select room_no from student_details where roll_no = roll_num_2);
		return 1;
	else 
		return 0;
    end if;
end//
delimiter ;

drop function if exists vacation_request;
delimiter //
create function vacation_request(roll_num varchar(20),time timestamp)
returns int
begin
	DECLARE if_exists bool;
    DECLARE if_exists_2 bool;
    select exists ( select room_no from student_details where roll_no = roll_num)into if_exists;
    select exists ( select roll_no from room_vacataion_requests where roll_no = roll_num)into if_exists_2;
	if (if_exists is true AND if_exists_2 is false) then
		insert into room_vacataion_requests(roll_no,vacating_time) values (roll_num,time);
		return 1;
	else 
		return 0;
    end if;
end//
delimiter ;

drop function if exists empty_room_update;
delimiter //
create function empty_room_update(swapid bigint)
returns int
begin
	declare roll_num varchar(20);
    declare room_num int;
    declare block_1 varchar(1);
   
   select roll_no into roll_num from  empty_room_allocataion_requests where id = swapid;
   select requested_block into block_1 from  empty_room_allocataion_requests where id = swapid;
   select requested_room into room_num from  empty_room_allocataion_requests where id = swapid;
    
	update student_details set
    room_no = room_num,
    block = block_1
    where roll_no = roll_num;
    
   
    
    delete from empty_room_allocataion_requests where requested_block = block_1 AND requested_room = room_num;
    
    return 1;
end//
delimiter ;


drop function if exists room_update;
delimiter //
create function room_update(swapid bigint)
returns int
begin
	declare roll_no_1 varchar(20);
    declare room_no_1 int;
    declare block_1 varchar(1);
    declare roll_no_2 varchar(20);
    declare room_no_2 int;
    declare block_2 varchar(1);
    
    select roll_no into roll_no_1 from student_details where roll_no in(select roll_no from room_swap_requests where id = swapid);
    select room_no into room_no_1 from student_details where roll_no in(select roll_no from room_swap_requests where id = swapid);
    select block into block_1 from student_details where roll_no in(select roll_no from room_swap_requests where id = swapid);
	select roll_no into roll_no_2 from student_details where block in(select requested_block from room_swap_requests where id = swapid) and room_no in (select requested_room from room_swap_requests where id = swapid) limit 1;
    select room_no into room_no_2 from student_details where block in(select requested_block from room_swap_requests where id = swapid) and room_no in (select requested_room from room_swap_requests where id = swapid) limit 1;
    select block into block_2 from student_details where block in(select requested_block from room_swap_requests where id = swapid) and room_no in (select requested_room from room_swap_requests where id = swapid) limit 1;
    
	update student_details set
    room_no = room_no_2,
    block = block_2
    where roll_no = roll_no_1;
    
    update student_details set
    room_no = room_no_1,
    block = block_1
    where roll_no = roll_no_2;
    
    delete from room_swap_requests where requested_block = block_1 AND requested_room = room_no_1;
    delete from room_swap_requests where requested_block = block_2 AND requested_room = room_no_2;
    
    return 1;
end//
delimiter ;
