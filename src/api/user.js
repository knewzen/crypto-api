import User from '../models/user';

export const create = (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  return newUser.save((err) => {
    if (err) {
      return res.status(400).send({ success: false, message: 'Cannot create new user - probably exists' });
    }
    return res.json({ success: true, message: 'Successfully created a new user' });
  });
};

export const update = (req, res, user) => {
  return user.save()
    .then(saved => res.json(saved))
    .catch(e => res.json({ error: true }));
};

export const updateUserKeys = (req, res, newExchangeObj) => {
  return User.get(req.body.userId).then((usr) => {
    let updatedExchanges = [];
    usr.keys.map((k, i) => {
      const isLastItem = i === usr.keys.length - 1;
      const exchangeExists = k.exchange !== newExchangeObj.exchange;
      if (exchangeExists) {
        updatedExchanges = [
          ...updatedExchanges,
          k
        ];
        return updatedExchanges;
      }
      if (!exchangeExists && isLastItem) {
        updatedExchanges.push(newExchangeObj);
        return k;
      }
      return k;
    });
    usr.keys = updatedExchanges;
    update(req, res, usr);
  });
}
