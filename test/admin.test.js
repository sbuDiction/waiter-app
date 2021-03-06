const assert = require("assert");
const Waiter_manager = require("../waiter-manager/waiter-manager");
const pg = require("pg");
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://diction:19970823@localhost:5432/waiters_tests";

const pool = new Pool({
  connectionString
});

describe("Admin Test", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  working_days");
    await pool.query("DELETE FROM  user_names");
  });

  it("the admin should be able to see or have access to all the waiters that will be working on each day", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("admin", "admin");
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("sam", "123");

    //add days method
    await waiter_shift.build("monday");




    await waiter_shift.build("tuesday");
    await waiter_shift.build("Wednesday");
    await waiter_shift.build("Thursday");
    await waiter_shift.build("Friday");
    await waiter_shift.build("saturday");
    await waiter_shift.build("sunday");

    //get days and waiter method
    await waiter_shift.add("Diction", "Monday");
    await waiter_shift.add("Diction", "Tuesday");
    await waiter_shift.add("Diction", "Friday");
    await waiter_shift.add("Sam", "Friday");

    //incrementing days counter method


    let waiters = await waiter_shift.admin();
    assert.equal(waiters.length, 7);
  });

  after(function() {
    pool.end();
  });
});
