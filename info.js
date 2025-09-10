import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const title = document.querySelector('h1');
const desc = document.querySelector('.desc');
const contact = document.querySelector('.call');
const address = document.querySelector('.add');
const hours = document.querySelector('.time');

async function getRestaurantById(id) {
  const docRef = doc(db, "restaurants", id); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector('.loading').style.display = 'flex';
    const param = new URLSearchParams(window.location.search);
    const id = param.get("id");
    const data = await getRestaurantById(id);
    if (!data) {
        alert('잘못된 id입니다.');
        window.location.href = '/';
    }
    title.textContent = data.name;
    desc.textContent = data.features;
    contact.textContent = data.contact;
    address.textContent = data.address;
    for (const menu of data.menu) {
        const grid = document.querySelector('.menu-grid');
        grid.innerHTML +=`<div class="menu-item">
        <p>${menu.name}</p>
        <span>${menu.price}</span>
      </div>`
    }
    document.querySelector('.loading').style.display = 'none';
})