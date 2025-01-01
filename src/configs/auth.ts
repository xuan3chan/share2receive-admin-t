export default {
  meEndpoint: '/api/admin/view-profile',
  loginEndpoint: '/api/auth/login',
  registerEndpoint: '/api/auth/register',
  logoutEndpoint: '/api/auth/logout',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
