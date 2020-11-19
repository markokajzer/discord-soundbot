import connection from '../connection';
import { add, exists, remove } from '../IgnoreList';

jest.mock('../connection');

describe('IgnoreList', () => {
  const userId = '123';

  beforeEach(() => {
    connection.set('ignoreList', []).write();
  });

  it('adds users', () => {
    add(userId);

    expect(exists(userId)).toEqual(true);
  });

  it('does nothing when user already added', () => {
    jest.spyOn(connection, 'get');
    add(userId);
    add(userId);

    // NOTE: Once for checking+adding, one more for checking if exists
    expect(connection.get).toHaveBeenCalledTimes(3);
  });

  it('removes users', () => {
    remove(userId);

    expect(exists(userId)).toEqual(false);
  });
});
