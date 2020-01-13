import {
  add,
  remove,
  exists,
} from '../IgnoreList';

describe('IgnoreList', () => {
  const user = '123'

  it('adds users', () => {
    add(user)
    expect(exists(user)).toEqual(true)
  })

  it('removes users', () => {
    remove(user)
    expect(exists(user)).toEqual(false)
  })
});
