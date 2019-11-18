module.exports = function(instance_for_waiter) {
  const index = async (req, res) => {
    let waiter_name = await instance_for_waiter.show();

    res.render("index", {
      name: waiter_name,
      Waiter: await instance_for_waiter.work(waiter_name),
      check_box: await instance_for_waiter.return_checked(waiter_name)
    });
  };

  const display_sigup = async (req, res) => {
    res.render("signup");
  };

  const add_user = async (req, res) => {
    let name = req.body.waiter;
    let passcode = req.body.passcode;
    await instance_for_waiter.register(name, passcode);
    res.redirect("/login");
    req.flash("yes", instance_for_waiter.yes());
  };

  const display_login = async (req, res) => {
    req.flash("info", instance_for_waiter.msg());
    req.flash("yes", instance_for_waiter.yes());
    res.render("login");
  };

  const log_in = async (req, res) => {
    let name = req.body.username;
    let code = req.body.passcode;
    let names_array = await instance_for_waiter.waiters();

    if (name === "Admin") {
      res.redirect("/admin/");
    }
    for (let x = 0; x < names_array.length; x++) {
      var waiter = names_array[x].waiter_name;
      var passcode = names_array[x].passcode;
      if (name === waiter && code === passcode) {
        res.redirect("/waiter/" + (await instance_for_waiter.user(name, code)));
      }
    }
    req.flash("yes", await instance_for_waiter.msg());
    return res.redirect("login");
  };

  const admin = async (req, res) => {
    res.render("admin", { days: await instance_for_waiter.admin() });
  };

  const add_shift = async (req, res) => {
    let days = req.body.day;
    let name = req.body.waiter;
    
    await instance_for_waiter.add(name, days);

    res.redirect("/waiter/" + name);
  };

  const build = async (req, res) => {
    let day = req.body.day;
    let element = req.body.element;
    let status = req.body.status;

    await instance_for_waiter.build(day, element, status);
    res.redirect("/building");
  };

  const render_build = async (req, res) => {
    res.render("build_days");
  };

  const remove = async (req, res) => {
    const name = req.params.name;
  
    await instance_for_waiter.work(name);
    res.redirect("/waiter/" + name);
  };

  const remove_all = async (req, res) => {
    await instance_for_waiter.DELETE();
    res.redirect("/admin");
  };

  return {
    index,
    add_shift,
    display_sigup,
    display_login,
    add_user,
    log_in,
    build,
    render_build,
    admin,
    remove,
    remove_all
  };
};
