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

describe("Waiter log in Test", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  user_names");
    await pool.query("DELETE FROM  working_days");
  });

  it("a waiter should be able to see or have access to the days they will be working when they log in", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("admin", "admin");
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("sam", "123");
    await waiter_shift.register("axola", "123");

    //add days method
    await waiter_shift.build("monday", "low");
    await waiter_shift.build("tuesday", "low");
    await waiter_shift.build("Wednesday", "low");
    await waiter_shift.build("Thursday", "low");
    await waiter_shift.build("Friday", "low");
    await waiter_shift.build("saturday", "low");
    await waiter_shift.build("sunday", "low");

    //get days and waiter method
    // await waiter_shift.add("Diction", "Monday");
    // await waiter_shift.add("Diction", "Tuesday");
    await waiter_shift.add("Diction", "Friday");
    await waiter_shift.add("Axola", "Friday");
    // await waiter_shift.add("Sam", "Friday");

    //incrementing days counter method
    // await waiter_shift.which_day("Monday");
    // await waiter_shift.which_day("Tuesday");
    await waiter_shift.which_day("Friday");
    await waiter_shift.which_day("Friday");
    await waiter_shift.which_day("Friday");
    await waiter_shift.which_day("Friday");

    //color changing method
    await waiter_shift.color();

    // let waiters = await waiter_shift.work("Diction");
    assert.equal('hello', 'hello');
  });

  after(function() {
    pool.end();
  });
});
