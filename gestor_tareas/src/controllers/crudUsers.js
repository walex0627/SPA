const userURL = `http://localhost:3000/users`


export async function getData() {
    try {
        const resp = await fetch(userURL)
        if (!resp.ok){
            throw new Error("Error en la respuesta")
        }

        const data = await resp.json()

        return data.sort()

    }catch (error){

    };
    
}