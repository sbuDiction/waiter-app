const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

const PORT = process.env.PORT || 5000;
const exphbs = require("express-handlebars");
const pg = require("pg");

const { Pool } = pg;

let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://diction:19970823@localhost:5432/waiters";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});
// view engine setup
const bodyParser = require("body-parser");

app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true
  })
);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const Routes = require("./routes/index");
const Function = require("./waiter-manager/waiter-manager");
const instance_for_waiter = Function(pool);
const instance_for_routes = Routes(instance_for_waiter);

const helpers = {
  orange: async function() {
    if ((await instance_for_waiter.color()) === "orange") {
      return true;
    } else {
      return false;
    }
  },

  green: async function() {
    if ((await instance_for_waiter.color()) === "green") {
      return true;
    } else {
      return false;
    }
  }
};

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
  helpers
});

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

app.use(flash());

app.get("/", instance_for_routes.display_sigup);
app.post("/add", instance_for_routes.add_user);
app.get("/login", instance_for_routes.display_login);
app.post("/welcome", instance_for_routes.log_in);
app.get("/waiter/:username", instance_for_routes.index);
app.post("/add_shift", instance_for_routes.add_shift);
// app.post('/filter', instance_for_routes.display_names)

app.listen(PORT, () => {
  console.log("App started at port:", PORT);
});
