const assert = require('assert');
const Waiter_manager = require('../waiter-manager/waiter-manager');
const pg = require("pg");
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://diction:19970823@localhost:5432/waiters_tests';

const pool = new Pool({
    connectionString
});

describe('Waiter app Testing', function(){

    beforeEach(async function(){
        // await pool.query('DELETE FROM join_tables');
        await pool.query('DELETE FROM  working_days');
        await pool.query('DELETE FROM  user_names');
    });

    it('should be able to check which day was selected by the waiter in a week and increment the counter', async function(){
        let waiter_shift = Waiter_manager(pool);
        await waiter_shift.build_days('monday');
        await waiter_shift.check_day('Monday');
        await waiter_shift.check_day('Monday');
        await waiter_shift.check_day('Monday');
        let days = await waiter_shift.display_days();
        assert.equal(days, 3);
    });


    it('should be able to add a waiter name and the day which they choose to week in the week', async function(){
        let waiter_shift = Waiter_manager(pool);
        await waiter_shift.build_days('monday');
        await waiter_shift.add('sbu','Monday');
        await waiter_shift.add('john','Monday');
        await waiter_shift.check_day('Monday');
        await waiter_shift.check_day('Monday');
        let users = await waiter_shift.display_users();
        assert.equal(users.length, 3);
    });
    after(function(){
        pool.end();
    })
});