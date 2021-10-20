import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  const jwt = Cookies.get('jwt');  
  let session;
  try {
    if (jwt) {
      const base64Url = jwt.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      // what is window.atob ?
      // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
      session = JSON.parse(window.atob(base64));
    }
  } catch (error) {
    console.log(error)
  }
  return session
}

export const logOut = async() => {
  
  const res = await fetch('/api/logout');
  const data = await res.json();
  if (data.data === "signed out") {

    return "signed out"
  }
  
  // Cookies.remove('jwt')
}