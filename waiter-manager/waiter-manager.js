module.exports = function Waiter_manage_system(pool) {
  let error_message = "";
  let current_user;
  let is_id;
  // let counter;




  const add_shift = async (name, day) => {
    let get_by_day = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1;", [day]);
    let get_by_name = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1", [name]);

    let waiter_name = get_by_name.rows[0].id;
    let day_selected = get_by_day.rows[0].id;

    let check_duplicate = await pool.query("SELECT * FROM join_tables WHERE user_ref = $1 AND days_ref = $2", [waiter_name, day_selected]);
    if (check_duplicate.rows.length !== 0) {
      return true;
    } else {
      await pool.query("INSERT INTO join_tables (user_ref,days_ref) VALUES ($1,$2)", [waiter_name, day_selected]);
    }
  };

  const check_day = async day => {
    let get_by_day = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1", [day]);
    if (get_by_day.rowCount === 1) {
    var  counter = get_by_day.rows[0].days_count;

      is_id = get_by_day.rows[0].id;
      await pool.query("UPDATE working_days SET days_in_a_week = $1, days_count = $2 +1 WHERE id = $3;", [day, counter++, is_id]);
    } else {
      await pool.query("INSERT INTO working_days (days_count) values ($1)", [1]);
    }
  };

  const display_counter = async days_id => {
    let days = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1", [days_id]);
    let id = days.rows[0].id;
    let count = await pool.query("SELECT COUNT(*) FROM join_tables WHERE days_ref = $1", [id]);
    return count.rows[0].count;
  };

  const display_waiters = async () => {
    let waiters = await pool.query("SELECT * FROM join_tables");
    return waiters.rows;
  };

  const display_days = async () => {
    let days = await pool.query("SELECT * FROM working_days");
    return days.rows;
  };

  const build_days = async (days, element, status) => {
    let week = days.charAt(0).toUpperCase() + days.slice(1).toLowerCase();
    let get_by_day = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1;",[week]);
    if (get_by_day.rows.length !== 0) {
      return true;
    }
    await pool.query("INSERT INTO working_days (days_in_a_week,status,element_id) VALUES ($1,$2,$3);", [week, element, status]);
  };

  const signup = async (name, password) => {
    let waiter_name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let passcode = password.toUpperCase();
    let signup = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1 AND passcode = $2", [waiter_name, passcode]);
    if (signup.rows.length !== 0) {
      return true;
    }
    await pool.query("INSERT INTO user_names (waiter_name,passcode) VALUES ($1,$2);", [waiter_name, passcode]);
  };

  const display_current = async (name, passcode) => {
    let name_list = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1 AND passcode = $2",[name, passcode]);
    if (name === name_list.rows[0].waiter_name && passcode === name_list.rows[0].passcode) {
      current_user = name_list.rows[0].waiter_name;
    }
    return name_list.rows[0].waiter_name;
  };

  const show_user = async () => current_user;

  const display_workers = async name => {
    let days_object_list = [
      {days_in_a_week: "Monday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Tuesday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Wednesday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Thursday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Friday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Saturday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Sunday",days_count: 0,status: "#ffff00",waiters: []},
    ];
    let get_by_id = await pool.query("SELECT working_days.days_in_a_week, working_days.days_count, working_days.status, user_names.waiter_name FROM working_days INNER JOIN join_tables ON working_days.id = join_tables.days_ref INNER JOIN user_names ON user_names.id = join_tables.user_ref WHERE waiter_name = $1;", [name]);
    for (let x = 0; x < get_by_id.rows.length; x++) {
      for (var i = 0; i < days_object_list.length; i++) {
        if(get_by_id.rows[x].days_in_a_week === days_object_list[i].days_in_a_week){
          days_object_list[i].waiters.push(get_by_id.rows[x].waiter_name);
          days_object_list[i].days_count = await display_counter(get_by_id.rows[x].days_in_a_week);
          if(days_object_list[i].days_count == 3) {
            days_object_list[i].status = '#008000';
          }if(days_object_list[i].days_count > 3) {
            days_object_list[i].status = '#ff0000';
          }else if(days_object_list[i].days_count < 3) {
            days_object_list[i].status = '#ffff00';
          }
      }
    }
  }
    
    return days_object_list;
  };

  const change_color = async () => {
    let get_by_count = await pool.query("SELECT * FROM working_days");
    for (const iterator of get_by_count.rows) {
      if (iterator.days_count) {
        await pool.query("UPDATE working_days SET status = $1 WHERE days_count = $2", ["#008000", 3]);
      }if(iterator.days_count){
        await pool.query('UPDATE working_days SET status = $1 WHERE days_count > $2', ["#ff0000", 3])
      }if(iterator.days_count){
        await pool.query('UPDATE working_days SET status = $1 WHERE days_count < $2', ["#ffff00", 3])
      }
    }
  };

  const display_registered_waiters = async () => {
    let waiters = await pool.query("SELECT * FROM user_names");
    return waiters.rows;
  };

  const admin_access = async () => {
    let days_object_list = [
      {days_in_a_week: "Monday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Tuesday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Wednesday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Thursday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Friday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Saturday",days_count: 0,status: "#ffff00",waiters: []},
      {days_in_a_week: "Sunday",days_count: 0,status: "#ffff00",waiters: []},
    ];

    let show_all = await pool.query("SELECT working_days.days_in_a_week, working_days.days_count, working_days.status, user_names.waiter_name FROM working_days INNER JOIN join_tables ON working_days.id = join_tables.days_ref INNER JOIN user_names ON user_names.id = join_tables.user_ref");
    for (let x = 0; x < show_all.rows.length; x++) {
        for (var i = 0; i < days_object_list.length; i++) {
          if(show_all.rows[x].days_in_a_week === days_object_list[i].days_in_a_week){
            days_object_list[i].waiters.push(show_all.rows[x].waiter_name);
            days_object_list[i].days_count = await display_counter(show_all.rows[x].days_in_a_week);
            if(days_object_list[i].days_count == 3){
              days_object_list[i].status = '#008000'
            }if(days_object_list[i].days_count > 3){
              days_object_list[i].status = '#ff0000'
            }else if(days_object_list[i].days_count < 3) {
              days_object_list[i].status = '#ffff00'
            }
        }
      }
    }
    return days_object_list;
  };

  const remove_waiter = async (name) => {
    console.log(name);
    
    let only_one_waiter = await pool.query('DELETE FROM user_names WHERE waiter_name = $1', [name])
    
    return only_one_waiter.rows
  }

  return {
    add: add_shift,
    counter: display_counter,
    waiters: display_waiters,
    week: display_days,
    build: build_days,
    register: signup,
    user: display_current,
    show: show_user,
    which_day: check_day,
    work: display_workers,
    color: change_color,
    display_registered_waiters,
    admin: admin_access,
    remove: remove_waiter
  };
};
