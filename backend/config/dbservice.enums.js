class DbOption {
  // Enumerator concept
  static DELETE_ALL_REFRESH_TOKENS = new DbOption(
    "DELETE_ALL_REFRESH_TOKENS",
    1
  );

  static DELETE_ONE_REFRESH_TOKEN = new DbOption("DELETE_ONE_REFRESH_TOKEN", 2);

  static FIND_ONE_REFRESH_TOKEN_USING_USERID_AND_REFRESH_TOKEN = new DbOption(
    "FIND_ONE_REFRESH_TOKEN_USING_USERID_AND_REFRESH_TOKEN",
    3
  );

  static FIND_ONE_USER_USING_REFRESH_TOKEN = new DbOption(
    "FIND_ONE_USER_USING_REFRESH_TOKEN",
    4
  );

  static FIND_ONE_USER_USING_EMAIL = new DbOption(
    "FIND_ONE_USER_USING_EMAIL",
    5
  );

  static FIND_ONE_GROUP_USING_MEMBER = new DbOption(
    "FIND_ALL_TIED_TO_ONE_USER_ID",
    6
  );

  static FIND_ONE_GROUP_USING_ADMIN = new DbOption(
    "FIND_ALL_TIED_TO_ONE_USER_ID",
    7
  );

  constructor(key, value) {
    this.key = key;
    this.value = value;
    Object.freeze(this);
  }
}
module.exports = {
  DbOption,
};
