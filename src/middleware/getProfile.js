const getProfile = async (req, res, next) => {
  const profile_id = req.get('profile_id');
  const { Profile } = req.app.get('models');
  const profile = await Profile.findOne({
    where: { id: profile_id },
  });
  if (!profile)
    return res
      .status(401)
      .send({
        message: `No profile found for id: ${profile_id}`,
      })
      .end();
  req.profile = profile;
  next();
};
module.exports = { getProfile };
