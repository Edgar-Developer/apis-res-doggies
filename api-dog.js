const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=5' // al concatenar la api key ya la pagina nos empieza a contar las solicitudes q hagamos
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites' // al concatenar la api key ya la pagina nos empieza a contar las solicitudes q hagamos
const API_URL_FAVORITES_DELETE = (id) => `https://api.thedogapi.com/v1/favourites/${id}` // se utiliza una arrow function para pasarle al endpoint el id usanado templey literal 
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload'
const API_KEY = 'live_gr2UQc1F3w5q6g7iWG5Pomub6XTz4iio4fxuoAaQypMqZrSewUyMadlYso7mkZZB'


const spanError = document.getElementById('error');

async function loadRandomDoggies() {
  try {
    const res = await fetch(API_URL_RANDOM)

  if (res.status !== 200) {
    throw new Error(`Hubo un Error: ${res.status}`); 
  } 
  const data = await res.json()
  
    console.log('Ramdom: ', data);  
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    const img5 = document.getElementById('img5');
    const btn1 = document.getElementById('saveFavorites1');
    const btn2 = document.getElementById('saveFavorites2');
    const btn3 = document.getElementById('saveFavorites3');
    const btn4 = document.getElementById('saveFavorites4');
    const btn5 = document.getElementById('saveFavorites5');

    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;
    img4.src = data[3].url;
    img5.src = data[4].url;  

    btn1.onclick = () => saveFavoritesDoggies(data[0].id)
    btn2.onclick = () => saveFavoritesDoggies(data[1].id)
    btn3.onclick = () => saveFavoritesDoggies(data[2].id)
    btn4.onclick = () => saveFavoritesDoggies(data[3].id)
    btn5.onclick = () => saveFavoritesDoggies(data[4].id)


  } catch (error) {
    spanError.innerHTML = error.message
    console.log(error);
    
  }     
}

async function loadfavoritesDoggies() {
  try {
  const res = await fetch(API_URL_FAVORITES, {
    method: 'GET',
    headers: {
      'x-api-key': API_KEY
    }
  });
  if (res.status !== 200) {
    throw new Error(`Hubo un error: ${res.status}`); 
  }  
  const data = await res.json();
    console.log('Favorites: ', data);

    const section = document.getElementById('doggiesFavorites');
    section.innerHTML = '';

    data.forEach(dog => {
      const article = document.createElement('article');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('❌');

      img.src = dog.image.url;
      btn.appendChild(btnText);
      btn.classList.add('deletePosition')
      btn.onclick = () => deleteFavoritesDoggies(dog.id)
      article.classList.add('deleteDoggies')
      article.appendChild(btn);
      article.appendChild(img);
      section.appendChild(article);
    })
    
  } catch (error) {
    spanError.innerHTML = error.message
    console.log(error);
  }
}

async function saveFavoritesDoggies(id) {
  const respuesta = await fetch(API_URL_FAVORITES, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      image_id: id
    }),
  });

  const data = await respuesta.json();

  console.log('savaFavorites: ', data);  
  
  if (respuesta.status !== 200) {
  throw new Error(`Hubo un error: ${respuesta.status} - ${data.message}`); 
  }  else {
    console.log('Save Exitosamente');    
    loadfavoritesDoggies() 
  }
}

async function deleteFavoritesDoggies(id) {
  const respuesta = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY
    }
  });

  const data = await respuesta.json();

  console.log('savaFavorites: ', data);  
  
  if (respuesta.status !== 200) {
  throw new Error(`Hubo un error: ${respuesta.status} - ${data.message}`); 
  } else {
    console.log('Delete Exitosamente'); 
    loadfavoritesDoggies()   
  }  
}

async function upLoadDogPhoto() {
  const form = document.getElementById('udLoadForm');
  const formD = new FormData(form);

  console.log(formD.get('file'));  

  const res = await fetch(API_URL_UPLOAD, {
    method: 'POST',
    headers: {
      // No debes incluir el encabezado Content-Type cuando usas FormData, ya que fetch lo establece automáticamente.
      'x-api-key': API_KEY,
    },
    body: formD
  })

  const data = await res.json();

  if (res.status !== 201) {
    throw new Error(`Hubo un error: ${res.status} - ${data.message}`); 
    } else {
      console.log('UpLoad Exitosamente'); 
      console.log({data}); 
      console.log(data.url); 
      saveFavoritesDoggies(data.id)   
    } 
}

loadRandomDoggies();
loadfavoritesDoggies();

