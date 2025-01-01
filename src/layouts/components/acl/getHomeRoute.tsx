/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = (role: any) => {
  if (role === 'client') return '/acl'
  else return '/homepage'
}

export default getHomeRoute
