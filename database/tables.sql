create table working_days (
id serial primary key,
days_in_a_week text,
element_id text,
days_count integer
);

create table user_names (
id serial primary key,
waiter_name text not null,
passcode text not null
);

create table join_tables (
id serial primary key,
user_ref int references user_names (id) on delete cascade on update cascade,
days_ref int references working_days (id) on delete cascade on update cascade
);
