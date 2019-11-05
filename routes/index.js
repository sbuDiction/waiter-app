module.exports = function(instance_for_waiter) {
  const index = async (req, res) => {
    res.render("index");
  };

  const display_shift = async (req, res) => {
    res.render("shifts", { days: await instance_for_waiter.display_days() });
  };

  const add_shift = async (req, res) => {
    let days = req.body.day;
    let name = req.body.waiter;
    await instance_for_waiter.check_day(days);
    await instance_for_waiter.add(name, days);
    res.redirect("/");
  };

  const display_names = async (req, res) => {
    
  };
  return {
    index,
    add_shift,
    display_shift,
    display_names
  };
};
