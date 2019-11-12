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

describe("Adding Days in a week Test", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  working_days");
    await pool.query("DELETE FROM  user_names");
  });

  it("admin should be able to add working days for the waiters to choose from ", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.build("monday");
    await waiter_shift.build("tuesday");
    await waiter_shift.build("Wednesday");
    await waiter_shift.build("Thursday");
    await waiter_shift.build("Friday");
    await waiter_shift.build("saturday");
    await waiter_shift.build("sunday");

    let waiters = await waiter_shift.week();
    assert.equal(waiters.length, 7);
  });

  after(function() {
    pool.end();
  });
});
