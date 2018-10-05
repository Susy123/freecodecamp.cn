var successRedirect = '/';
var failureRedirect = '/login';
var linkFailureRedirect = '/account';
module.exports = {
  local: {
    provider: 'local',
    module: 'passport-local',
    usernameField: 'email',
    passwordField: 'password',
    authPath: '/auth/local',
    successRedirect: successRedirect,
    failureRedirect: '/email-signin',
    session: true,
    failureFlash: true
  },
  /* 'juhe-login': {
     provider: 'juhe',
     authScheme: 'oauth2',
     module: 'passport-juhe',
     authPath: '/auth/juhe',
     callbackURL: '/auth/juhe/callback',
     callbackPath: '/auth/juhe/callback',
     successRedirect: successRedirect,
     failureRedirect: failureRedirect,
     clientID: process.env.JUHE_ID,
     clientSecret: process.env.JUHE_SECRET,
     failureFlash: true
   },*/
   'qq-login': {
    provider: 'qq',
    authScheme: 'oauth2',
    module: 'passport-qq',
    authPath: '/auth/qq',
    callbackURL: 'http://qzonestyle.gtimg.cn/qzone/openapi/redirect-1.0.1.html', // '/auth/qq/callback',
    callbackPath: 'http://qzonestyle.gtimg.cn/qzone/openapi/redirect-1.0.1.html', // '/auth/qq/callback',
    successRedirect: successRedirect,
    failureRedirect: failureRedirect,
    clientID: process.env.QQ_ID,
    clientSecret: process.env.QQ_SECRET,
    scope: ['all'],
    failureFlash: true
  },
  'github-login': {
    provider: 'github',
    authScheme: 'oauth2',
    module: 'passport-github',
    authPath: '/auth/github',
    callbackURL: '/auth/github/callback',
    callbackPath: '/auth/github/callback',
    successRedirect: successRedirect,
    failureRedirect: failureRedirect,
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    scope: ['email'],
    failureFlash: true
  }/*,
  'github-link': {
    provider: 'github',
    authScheme: 'oauth2',
    module: 'passport-github',
    authPath: '/link/github',
    callbackURL: '/auth/github/callback/link',
    callbackPath: '/auth/github/callback/link',
    successRedirect: successRedirect,
    failureRedirect: linkFailureRedirect,
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    scope: ['email'],
    link: true,
    failureFlash: true
  }*/
};
