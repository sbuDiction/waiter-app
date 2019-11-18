module.exports = function Waiter_manage_system(pool) {
  let current_user;
  let error = ''
  let success = ''

  const add_shift = async (name, day) => {
    const days_array = Array.isArray(day) ? day : [day];
    let get_by_name = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1", [name]);
    let waiter_id = get_by_name.rows[0].id
      await pool.query('DELETE FROM join_tables WHERE user_ref = $1;',[waiter_id]);
    
    for (var x = 0; x < days_array.length; x++) {
      var get_by_day = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1", [days_array[x]]);
      if(get_by_day.rows.length !== 0){
        await pool.query("INSERT INTO join_tables (user_ref, days_ref) VALUES ($1, $2);", [waiter_id, get_by_day.rows[0].id]);
      }
    }
  };

  const display_counter = async days_id => {
    let days = await pool.query("SELECT * FROM working_days WHERE days_in_a_week = $1", [days_id]);
    let id = days.rows[0].id;
    let count = await pool.query("SELECT COUNT(*) FROM join_tables WHERE days_ref = $1", [id]);
    return count.rows[0].count;
  };


  const display_waiters = async () => {
    let waiters = await pool.query("SELECT * FROM user_names");
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
    error = ''
    success = ''
    let waiter_name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let passcode = password.toUpperCase();
    let signup = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1 AND passcode = $2", [waiter_name, passcode]);
    if (signup.rows.length !== 0) {
      error = 'You already have an account try logging in please'
      return true;
    }
    await pool.query("INSERT INTO user_names (waiter_name,passcode) VALUES ($1,$2);", [waiter_name, passcode]);
    success = 'Account successfully created now you can log in'
  };


  const display_current = async (name) => {
    error = ''
    let name_list = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1",[name]);
    if(name_list.rowCount === 1) {

      if (name === name_list.rows[0].waiter_name) {
      return current_user = name_list.rows[0].waiter_name;
      } 
    }
    return name_list.rows[0].waiter_name;
  };


  const show_user = async () => {
    error = ''
    return current_user;
  } 


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
    let only_one_waiter = await pool.query('DELETE FROM user_names WHERE waiter_name = $1', [name])
    return only_one_waiter.rows;
  }
  
  const remove_all_waiters = async () => {
    let only_one_waiter = await pool.query('DELETE FROM user_names')
    return only_one_waiter.rows;
  }

  const return_checked = async (name) =>{
    let days_object_list = [
      {days_in_a_week: "Monday",element_id: "#defaultInline1",state: 'null'},
      {days_in_a_week: "Tuesday",element_id: "#defaultInline2",state: 'null'},
      {days_in_a_week: "Wednesday",element_id: "#defaultInline3",state: 'null'},
      {days_in_a_week: "Thursday",element_id: "#defaultInline4",state: 'null'},
      {days_in_a_week: "Friday",element_id: "#defaultInline5",state: 'null'},
      {days_in_a_week: "Saturday",element_id: "#defaultInline6",state: 'null'},
      {days_in_a_week: "Sunday",element_id: "#defaultInline7",state: 'null'},
    ];

    let which_box = await pool.query('SELECT working_days.days_in_a_week, working_days.days_count, working_days.status, user_names.waiter_name FROM working_days INNER JOIN join_tables ON working_days.id = join_tables.days_ref INNER JOIN user_names ON user_names.id = join_tables.user_ref WHERE waiter_name = $1;', [name])
    for (let x = 0; x < which_box.rows.length; x++) {
      for (let i = 0; i < days_object_list.length; i++) {
        if(which_box.rows[x].days_in_a_week === days_object_list[i].days_in_a_week){
          days_object_list[i].state = 'checked';
        }
      }
    }
    return days_object_list
}

  const display_message = () => error

  const display_success =() => success 

  return {
    add: add_shift,
    counter: display_counter,
    waiters: display_waiters,
    week: display_days,
    build: build_days,
    register: signup,
    user: display_current,
    show: show_user,
    work: display_workers,
    display_registered_waiters,
    admin: admin_access,
    remove: remove_waiter,
    return_checked,
    msg: display_message,
    yes: display_success,
    DELETE: remove_all_waiters,
  };
};
