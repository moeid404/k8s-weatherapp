const { signup, signin, _users } = require('../../src/lib/auth');

describe('auth unit', () => {
  test('signup + signin', async () => {
    _users.clear();
    await signup('a@b.com', 'pw');
    const { token } = await signin('a@b.com', 'pw');
    expect(token).toBeTruthy();
  });

  test('duplicate signup fails', async () => {
    _users.clear();
    await signup('a@b.com', 'pw');
    await expect(signup('a@b.com', 'pw')).rejects.toThrow('exists');
  });
});
