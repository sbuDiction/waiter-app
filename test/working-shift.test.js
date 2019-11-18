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

describe("Add shift Test", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  working_days");
    await pool.query("DELETE FROM  user_names");
  });

  it("a waiter should be able to select the days they will work in a week ", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("diction", "sbu1997");

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

    //incrementing days counter method
    // await waiter_shift.which_day("Monday");
    // await waiter_shift.which_day("Tuesday");
    // await waiter_shift.which_day("Friday");

    let waiters = await waiter_shift.waiters();
    assert.equal(waiters.length, 1);
  });
  it("a waiter should be able to see the count of how many waiters will be working on that a specific day", async function() {
    let waiter_shift = Waiter_manager(pool);
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
    await waiter_shift.add("Sam", "Friday");

    //incrementing days counter method
    // await waiter_shift.which_day("Monday");
    // await waiter_shift.which_day("Tuesday");
    // await waiter_shift.which_day("Friday");

    let counter = await waiter_shift.counter("Friday");
    assert.equal(counter, 2);
  });

  after(function() {
    pool.end();
  });
});
