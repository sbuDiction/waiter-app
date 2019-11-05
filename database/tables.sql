create table working_days (
id serial primary key,
days_in_a_week text not null,
days_count integer
);

create table user_names (
id serial primary key,
waiter_name text not null,
days_ref int references working_days (id) on delete cascade on update cascade
);

create table user_join (
id serial primary key,
user_ref int references user_names (id) on delete cascade on update cascade
);