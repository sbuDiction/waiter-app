module.exports = function services(pool) {


    const get_by_day = async (day) => {
        let get_by_day = await pool.query('SELECT * FROM working_days WHERE days_in_a_week = $1', [day])
        return get_by_day
    }

    const get_all_names = async () => {
        let names = await pool.query('SELECT * FROM user_names')
        return names.rows
    }

    const get_all_days = async () => {
        let days = await pool.query('SELECT * FROM working_days');
        return days.rows
    }

    const select_name = async (name) => {
        let names = await pool.query('SELECT working_days.days_in_a_week, working_days.days_count, working_days.status, user_names.waiter_name FROM working_days INNER JOIN join_tables ON working_days.id = join_tables.days_ref INNER JOIN user_names ON user_names.id = join_tables.user_ref WHERE waiter_name = $1', [name])
        return names
    }


    const get_by_name = async (name) => {
        let names = await pool.query('SELECT * FROM user_names WHERE waiter_name = $1', [name])
        return names
    }


    return {
        get_by_day,
        get_all_names,
        get_all_days,
        select_name,
        get_by_name
    }
}