module.exports = function(instance_for_waiter) {
  const index = async (req, res) => {
    let waiter_name = await instance_for_waiter.show();
    res.render("index", {
      name: waiter_name,
      days: await instance_for_waiter.work(waiter_name),
      check_box: await instance_for_waiter.week()
    });
  };

  const display_sigup = async (req, res) => {
    res.render("signup");
  };

  const add_user = async (req, res) => {
    let name = req.body.waiter;
    console.log(name);
    let passcode = req.body.passcode;
    console.log(passcode);
    await instance_for_waiter.register(name, passcode);
    res.redirect("/login");
  };

  const display_login = async (req, res) => {
    res.render("login");
  };

  const log_in = async (req, res) => {
    let name = req.body.username;
    let code = req.body.passcode;
    console.log(name);
    console.log(code);

    await instance_for_waiter.user(name, code);
    res.redirect("/waiter/" + (await instance_for_waiter.user(name, code)));
  };

  const add_shift = async (req, res) => {
    let days = req.body.day;
    let name = req.body.waiter;
    console.log(req.body);
    for (let x = 0; x < days.length; x++) {
      var element = days[x];
      await instance_for_waiter.add(name, element);
      await instance_for_waiter.which_day(element);
    }
    console.log(element);
    res.redirect("/waiter/" + name);
  };

  return {
    index,
    add_shift,
    display_sigup,
    // display_names,
    display_login,
    add_user,
    log_in
  };
};
