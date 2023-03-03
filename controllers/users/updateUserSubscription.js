const User = require("../../models/user");

const updateUserSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  if (!['starter', 'pro', 'business'].includes(subscription)) {
    return res.status(400).send();
  }

  const result = await User.findByIdAndUpdate(_id, { subscription }, { new: true });

  if (!result) {
    return res.status(404).send();
  }

  res.json(result);
};

module.exports = updateUserSubscription;