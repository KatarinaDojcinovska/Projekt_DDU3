const weatherApiKey = '59a2034ae4aa4ce49c6215358251305'
const gifApiKey = 'AIzaSyB0rByOPuVe1syMsx5CntyK69GUbPecxN8'

const weatherBaseUrl = 'https://api.weatherapi.com/v1'
const gifBaseUrl = 'https://tenor.googleapis.com/v2'

const serverBaseUrl = 'http://localhost:8000'

const getForecast = async function (lat, lon) {
  try {
    const res = await fetch(
      `${weatherBaseUrl}/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&days=3`
    )
    if (!res.ok) {
      throw new Error('Error fetch weather')
    }
    return res.json()
  } catch (error) {
    console.error(error)
  }
}

const getGif = async function (condition) {
  try {
    const res = await fetch(
      `${gifBaseUrl}/search?q=${condition}&key=${gifApiKey}&limit=1&random=true`
    )
    if (!res.ok) {
      throw new Error('Error fetch gif')
    }
    console.log(res)
    return res.json()
  } catch (error) {
    console.error('Error fetch gif')
  }
}

const getUserGifs = async function (user) {
  try {
    const res = await fetch(`${serverBaseUrl}/get-gifs?username=${user}`)
    if (!res.ok) {
      throw new Error('Cannot bring GIFs')
    }
    console.log(res)
    return res.json()
  } catch (error) {
    console.error('Something went wrong!')
  }
}

const saveGifToUser = async function (username, gifUrl) {
  try {
    const res = await fetch(`${serverBaseUrl}/save-gif`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, gifUrl: gifUrl }),
    })

    console.log(res)
    if (!res.ok) {
      throw new Error('Failed to save GIF!')
    }
  } catch (error) {
    console.error(error)
  }
}

const deleteGifOfUser = async function (username, gifUrl) {
  try {
    const res = await fetch(`${serverBaseUrl}/delete-gif`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, gifUrl: gifUrl }),
    })
    console.log(res)

    if (!res.ok) {
      throw new Error('Failed to delete GIF')
    }
    return res
  } catch (error) {
    console.error(error)
  }
}

const login = async function (username, password) {
  try {
    const res = await fetch(`${serverBaseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.status === 200) {
      localStorage.setItem('username', username)
      alert('Inloggning lyckades!')
      return res
    } else if (res.status === 401) {
      alert('Fel lösenord.')
    } else if (res.status === 404) {
      alert('Användaren finns inte.')
    } else {
      alert('Inloggningen misslyckades.')
    }
  } catch (error) {
    console.error('Error login', error)
  }
}

const register = async function (username, password) {
  try {
    const res = await fetch(`${serverBaseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (res.status === 200) {
      alert('Registrering lyckades!')
      return res
    } else if (res.status === 409) {
      alert('Användarnamnet finns redan.')
    } else {
      alert('Registreringen misslyckades.')
    }
  } catch (error) {
    console.error('Error login', error)
  }
}

export default {
  getForecast,
  getGif,
  login,
  register,
  saveGifToUser,
  deleteGifOfUser,
  getUserGifs,
}