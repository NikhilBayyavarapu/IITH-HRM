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
)





















