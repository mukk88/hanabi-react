import { 
    WebAuth,
    // Auth0Error
} from 'auth0-js';

const envAuthSettings = {
  production: {
    domain: 'hanabi.auth0.com',
    clientID: 'WL1xFl2EfXR5gcAKBDdIQQLMYp0EFt7C',
    redirectUri: 'http://hanabi.markwooym.com/callback',
    audience: 'https://hanabi.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  },
  development: {
    domain: 'hanabi.auth0.com',
    clientID: 'WL1xFl2EfXR5gcAKBDdIQQLMYp0EFt7C',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://hanabi.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile'
  }
};

export class Auth {
  // tslint:disable-next-line
  authSettings = envAuthSettings[(process as any).env.NODE_ENV];
  auth0 = new WebAuth(this.authSettings);

  login = () => {
    this.auth0.authorize(this.authSettings);
  }

  logout() {
    localStorage.removeItem('profile');
    window.location.assign('/home'); 
  }

  setSession = (accessToken: string) => {
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      console.log(err);
      if (profile && profile.name) {
        localStorage.setItem('profile', profile.name);
      }
      window.location.assign('/home'); 
    });
  }

  handleAuthentication = () => {
    const re = /access_token=[^&]*/;
    const matches = window.location.hash.match(re);
    
    if (matches) {
      this.setSession(matches[0].split('=')[1]);
    } else {
      window.location.assign('/home');
    }
  }

  isAuthenticated = () => {
    return localStorage.getItem('profile') !== null;
  }

  getProfile = () => {
    return (localStorage.getItem('profile') || 'Unknown').substring(0, 15);
  }

}
