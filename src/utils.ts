const kebabCase = (string) =>
  string &&
  string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

const cookieExtractor = function (req) {
  console.log('extract cookies');
  let token = null;
  if (req && req.cookies) {
    console.log('there is cookies');
    token = req.cookies['token'];
    console.log(token);
  }
  return token;
};

export { kebabCase, cookieExtractor };
