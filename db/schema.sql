create table users (
   id mediumint not null auto_increment,
   email char(50) not null,
   password char(50) not null,
   name char(50) not null,
   lastname char(50),
   address char(50),
   city char(50),
   phone char(50),
   gender char(1),
   primary key (id)
);