import { login } from "./controllers/login";
import { isAuthenticated } from "./auth";
const routes = {
    "/": "./src/views/home.html",
    "/login": "./src/views/login.html",
    "/users": "./src/views/users.html",
    "/task": "./src/views/managementTask.html",
    "/404": "./src/views/404.html",
    "/register": "./src/views/register.html",
    "/users": "./src/views/crudUsers.html"
}
export async function renderRoute() {
    const user = JSON.parse(localStorage.getItem("user"));
    const path = location.hash.replace("#", "") || "/";
    const app = document.getElementById("app");
    const file = routes[path]
    const isAuth = isAuthenticated();

    if (!file) {
        location.hash = "/404"
        return;
    }

    if (isAuth && path === "/login") {
        location.hash = "/"
        return
    }

    if (!isAuth && path !== "/login") {
        if (path !== "/register") {
            location.hash = "/login"
            return
        }
    }
    try {

        const res = await fetch(file)
        const html = await res.text()

        app.innerHTML = html

        if (path === "/login") {
            document.getElementById("navbar").hidden = true
            const loginError = document.getElementById("loginError")
            document.getElementById("loginForm").addEventListener("submit", async (e) => {
                e.preventDefault();

                const username = document.getElementById("username").value.trim();
                const password = document.getElementById("password").value.trim();
                if (username === "" || password === ""){
                    loginError.style.display = "block";
                    return
                }
                const userLogged = await login(username,password)
                console.log(path);

                if (userLogged) {
                    loginError.style.display = "none";
                    document.getElementById("navbar").hidden = false
                    location.hash = "/"
                } else {
                    loginError.style.display = "block";
                }

            });
            document.getElementById("sign-up").addEventListener("click", () => {
                location.hash = "/register"
            })
        }
        if (path === "/register") {
            document.getElementById("navbar").hidden = true
            debugger
            const form = document.getElementById("registerForm")
            form?.addEventListener("submit", async (e) => {
                e.preventDefault();

                const username = form.username.value.trim();
                const password = form.password.value.trim()
                try {
                    const params = new URLSearchParams({
                        username: username,
                        role: "gestor"
                    })
                    const userUrl = `http://localhost:3000/users?${params.toString}`
                    const res = await fetch(userUrl)
                    const data = await res.json()
                    console.log(data);

                    if (data.length === 0) {
                        alert(`${username} ya existe, intenta con otro`)
                        return
                    }
                
                    const newUser = {
                        username: username,
                        password: password,
                        role: "gestor",
                        is_active : true
                    }
                    const post = await fetch('http://localhost:3000/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'aplication/json'
                        },
                        body: JSON.stringify(newUser)
                    })
                    debugger
                    if (!post.ok) {
                        throw new Error('Error al crear el usuario')

                    }
                    alert(`${username} se creo exitosamente`)
                    form.reset()
                    location.hash = "/login"
                } catch (error) {
                    console.error(error)
                    alert('error al registrar al usuario')
                }
                // const userExist = user.find(username => user.username === username)
                // if (userExist){
                //     alert(`${username} ya existe, intenta con otro.`)
                //     user.push({
                //         "username": username,
                //         "password": password,
                //         "role": "gestor"
                //     })

                // }
            })
        }
        const logoutBtn = document.getElementById("logoutBtn")
        if (logoutBtn) {
            if (isAuth) {
                logoutBtn.style.display = "block"
            } else {
                logoutBtn.style.display = "none"
            }

            logoutBtn.addEventListener("click", () => {
                localStorage.removeItem("user")
                localStorage.removeItem("isAuth")
                location.hash = "/login"
            })
        }
        if (path === "/") {
            if (user.role === "admin") {
                
                app.innerHTML = `
                <h2>hola desde el home</h2>
                <div>
                    <a href="/users" id="">
                    <div>users</div>
                </a>
                    <a href="/task">
                    Tasks
                    </a>
                </div>
                `
            }else{
                app.innerHTML = `
                <h2>hola desde el home</h2>
                <div>
                    <span>Hola ${user.username}, te saludo desde tasks</span>
                    <div>
                        <a href="/task">
                            <div>task</div>
                        </a>
                    </div>
                </div>
                `
            }
        }
    } catch (error) {
        console.log(error);
        app.innerHTML = "Couldn't load view catch"
    }
}