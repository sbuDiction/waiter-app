    module.exports = function Waiter_manage_system(pool) {
        let new_list;
        let is_id;

    const add_shift = async (user_name, day) => {
        let waiter_name = user_name.charAt(0).toUpperCase() + user_name.slice(1).toLowerCase();
        let get_by_name = await pool.query('SELECT * FROM user_names WHERE waiter_name = $1;', [waiter_name]);
        let get_by_id = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1', [day]);
        if (get_by_name.rows.length !== 0) {
            return true;
        }
        let is_id = get_by_id.rows[0].id;
        await pool.query('INSERT INTO user_names (waiter_name,days_ref) VALUES ($1, $2)', [waiter_name, is_id]);
    };

        const check_day = async (day) =>{
            let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1', [day]);
                if(get_by_day.rowCount === 1){
                let counter = get_by_day.rows[0].days_count;
                is_id = get_by_day.rows[0].id;
                await pool.query('UPDATE working_days SET days_in_a_week = $1, days_count = $2 +1 WHERE id = $3;', [day, counter++, is_id])
                }else {
                await pool.query('INSERT INTO working_days (days_count) values ($1)', [1]);
            }
        };

        const build_days = async (days) => {
              let week =  days.charAt(0).toUpperCase() + days.slice(1).toLowerCase();
              let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1;', [week]);
              if(get_by_day.rows.length !== 0){
                  return true;
                } await pool.query('INSERT INTO working_days (days_in_a_week) VALUES ($1);', [week]);
        };

        const which_day = async (day) => {
              let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1;', [day]);
              if(get_by_day.rows.length !== 0){
              new_list = get_by_day.rows;
              return new_list;
          }
        };

        const display_days = async () => {
            let get_days = await pool.query('SELECT * FROM working_days');
            console.log(get_days.rows, 'hello');
            return get_days.rows;
        };

        const display_users = async () =>{
            let get_name = await pool.query('SELECT * FROM user_names;');
            console.log(get_name.rows, 'names');
            return get_name.rows
        };

        const display_shift = async (waiter_shift) => {
            let waiter_name = await pool.query('SELECT * FROM user_names WHERE days_ref = $1;', [waiter_shift]);
            console.log(waiter_name, 'select id');
            
            return waiter_name.rows
        };

        const display_which_day = async () => new_list;

    return {
        add: add_shift,
        check_day,
        display_days,
        build_days,
        which_day,
        display_which_day,
        display_users,
        display_shift
    };
};
