export function isAuthenticated() {
    const user = localStorage.getItem("user");
    const isAuth = localStorage.getItem("isAuth");
    return user && isAuth
}
