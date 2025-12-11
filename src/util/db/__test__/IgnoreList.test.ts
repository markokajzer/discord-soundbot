import connection from "../connection";
import { add, exists, remove } from "../IgnoreList";

jest.mock("../connection");

describe("IgnoreList", () => {
  const userId = "123";

  beforeEach(() => {
    connection.data.ignoreList = [];
  });

  it("adds users", () => {
    add(userId);

    expect(exists(userId)).toBe(true);
  });

  it("does nothing when user already added", () => {
    const spy = jest.spyOn(connection, "write");
    add(userId);
    add(userId);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("removes users", () => {
    remove(userId);

    expect(exists(userId)).toBe(false);
  });
});
