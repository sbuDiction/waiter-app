    module.exports = function Waiter_manage_system(pool) {
        let error_message = '';
        let current_user;
        let is_id;
        let counter

    const add_shift = async (name,day) => {
        // console.log(name);
      let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1;', [day]);
      let get_by_name = await pool.query("SELECT * FROM user_names WHERE waiter_name = $1", [name])
    //   console.log(get_by_name.rows);
      
      let waiter_name = get_by_name.rows[0].id;
      let day_selected = get_by_day.rows[0].id
    //   console.log(day_selected, 'id of the day');
      
      let check_duplicate = await pool.query('SELECT * FROM join_tables WHERE user_ref = $1 AND days_ref = $2', [waiter_name,day_selected])
      if(check_duplicate.rows.length !== 0){
          return true;
      }else{

          await pool.query('INSERT INTO join_tables (user_ref,days_ref) VALUES ($1,$2)', [waiter_name, day_selected])
      }
    };

    const check_day = async (day) =>{
        let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1', [day]);
            if(get_by_day.rowCount === 1){
            counter = get_by_day.rows[0].days_count;
            // console.log(counter, 'counter');
            
            is_id = get_by_day.rows[0].id;
            await pool.query('UPDATE working_days SET days_in_a_week = $1, days_count = $2 +1 WHERE id = $3;', [day, counter++, is_id])
            }else {
            await pool.query('INSERT INTO working_days (days_count) values ($1)', [1]);
        }
    };

    const display_counter = async (days_id) => {
        // console.log(days_id);
        let days = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1', [days_id])
        let id = days.rows[0].id
        let count = await pool.query('SELECT COUNT(*) FROM join_tables WHERE days_ref = $1', [id])
        // console.log(count.rows);
        return count.rows[0].count;
    };

    const display_waiters = async () => {
        let waiters = await pool.query('SELECT * FROM join_tables');
        return waiters.rows;
    };

    const display_days = async () => {
        let days = await pool.query('SELECT * FROM working_days')
        // console.log(days.rows);
        
        return days.rows
    }

    const build_days = async (days) => {
        let week =  days.charAt(0).toUpperCase() + days.slice(1).toLowerCase();
        // console.log(week);
        let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1;', [week]);
        if(get_by_day.rows.length !== 0) {
            return true;
          } 
          await pool.query('INSERT INTO working_days (days_in_a_week) VALUES ($1);', [week]);
  };

    const signup = async (name,password) => {
        let waiter_name =  name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        let passcode = password.toUpperCase();
        let signup = await pool.query('SELECT * FROM user_names WHERE waiter_name = $1 AND passcode = $2', [waiter_name, passcode])
        if(signup.rows.length !== 0) {
            return true
        }
        await pool.query('INSERT INTO user_names (waiter_name,passcode) VALUES ($1,$2);', [waiter_name, passcode]);
    };

    const display_current = async (name,passcode) => {
        let name_list = await pool.query('SELECT * FROM user_names WHERE waiter_name = $1 AND passcode = $2', [name,passcode]);
        // console.log(name_list.rows, 'correct');
        if(name === name_list.rows[0].waiter_name && passcode === name_list.rows[0].passcode) {
            current_user = name_list.rows[0].waiter_name;
        }
        // console.log((name === name_list.rows[0].waiter_name && passcode === name_list.rows[0].passcode));
        // console.log(current_user, 'user');
        return name_list.rows[0].waiter_name;
    }

    const show_user = async () => current_user;

    const display_workers = async (name) => {
        let get_by_id = await pool.query('SELECT working_days.days_in_a_week, working_days.days_count, user_names.waiter_name FROM working_days INNER JOIN join_tables ON working_days.id = join_tables.days_ref INNER JOIN user_names ON user_names.id = join_tables.user_ref WHERE waiter_name = $1;',[name]);

    return get_by_id.rows

    };
    

    const change_color = async () =>{
        let get_by_count = await pool.query('SELECT * FROM working_days')
        // console.log(get_by_count.rows, 'days we have');
        for (let x = 0; x < get_by_count.rows.length; x++) {
            // console.log(get_by_count.rows, 'inside for loop');
            const element = get_by_count.rows[x].days_count;
            // console.log(element, 'for loop');
            if(element >= 1 && element < 3){
                console.log(element >= 1 && element < 3, 'is it');
                
                return 'orange'
            }else if(element >= 3){
                return 'green'
            }
            
        }        
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
        color: change_color
    };
};
