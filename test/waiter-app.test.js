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

describe("Waiter app Testing", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  working_days");
    await pool.query("DELETE FROM  user_names");
  });

  it("should be able to check which day was selected by the waiter in a week and increment the counter", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("axola", "12345");

    await waiter_shift.build("monday");
    await waiter_shift.build("tuesday");
    await waiter_shift.build("Wednesday");
    await waiter_shift.build("Thursday");
    await waiter_shift.build("Friday");
    await waiter_shift.build("saturday");
    await waiter_shift.build("sunday");

    await waiter_shift.add("Diction", "Monday");
    await waiter_shift.add("Diction", "Tuesday");
    await waiter_shift.add("Diction", "Friday");
    await waiter_shift.add("Axola", "Monday");
    await waiter_shift.which_day('Monday');
    await waiter_shift.which_day('Monday');
    await waiter_shift.which_day('Monday');
    await waiter_shift.color();
    
    let waiters = await waiter_shift.waiters();
    assert.equal(waiters.length, 4);
  });

  it("should be able to check which day was selected by the waiter in a week and increment the counter", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("axola", "12345");

    await waiter_shift.user("Diction", "SBU1997");
    let who = await waiter_shift.show();
    assert.equal(who, "Diction");
  });

  it("should be able to check which day was selected by the waiter in a week and increment the counter", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("axola", "12345");

    await waiter_shift.user("Diction", "SBU1997");
    let who = await waiter_shift.show();
    assert.equal(who, "Diction");
  });
  after(function() {
    pool.end();
  });
});
