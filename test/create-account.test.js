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

describe("Adding Account Test", function() {
  beforeEach(async function() {
    await pool.query("DELETE FROM join_tables");
    await pool.query("DELETE FROM  working_days");
    await pool.query("DELETE FROM  user_names");
  });

  it("a waiter should be able to rigister on the waiter app or create an account ", async function() {
    let waiter_shift = Waiter_manager(pool);
    await waiter_shift.register("diction", "sbu1997");
    await waiter_shift.register("axola", "12345");

    let waiters = await waiter_shift.display_registered_waiters();
    assert.equal(waiters.length, 2);
  });

  after(function() {
    pool.end();
  });
});
