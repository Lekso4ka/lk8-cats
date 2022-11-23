const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupAdd = popupBlock.querySelector(".popup-add");
const popupUpd = popupBlock.querySelector(".popup-upd");
const addForm = document.forms.addForm;
const updForm = document.forms.updForm;
const cards = document.getElementsByClassName("card");

document.getElementById("user").addEventListener("click", function() {
	localStorage.removeItem("catUser");
});

let user = localStorage.getItem("catUser");
if (!user) {
	user = prompt("Представьтесь, пожалуйста")
	localStorage.setItem("catUser", user);
}

popupBlock.querySelectorAll(".popup__close").forEach(function(btn) {
	btn.addEventListener("click", function() {
		popupBlock.classList.remove("active");
		btn.parentElement.classList.remove("active");
		if (btn.parentElement.classList.contains("popup-upd")) {
			updForm.dataset.id = ""; // updForm.setAttribute("data-id", "");
		}
	});
});

document.querySelector("#add").addEventListener("click", function(e) {
	e.preventDefault();
	popupBlock.classList.add("active");
	popupAdd.classList.add("active");
});

const createCard = function(cat, parent) {
	const card = document.createElement("div");
	card.className = "card";
	card.dataset.id = cat.id; // <dic class="card" data-id="2">...</div>

	const img = document.createElement("div");
	img.className = "card-pic";
	if (cat.img_link) {
		img.style.backgroundImage = `url(${cat.img_link})`;
	} else {
		img.style.backgroundImage = "url(img/cat.png)";
		img.style.backgroundSize = "contain";
		img.style.backgroundColor = "transparent";
	}

	const name = document.createElement("h3");
	name.innerText = cat.name;

	let like = "";
	like.onclick = () => {
		//....
		// cat.id
	}

	const del = document.createElement("button");
	del.innerText = "delete";
	del.id = cat.id;
	del.addEventListener("click", function(e) {
		let id = e.target.id;
		deleteCat(id, card);
	});

	const upd = document.createElement("button");
	upd.innerText = "update";
	upd.addEventListener("click", function(e) {
		popupUpd.classList.add("active");
		popupBlock.classList.add("active");
		showForm(cat);
		updForm.setAttribute("data-id", cat.id);
	})

	card.append(img, name, del, upd);
	parent.append(card);
}

const showForm = function(data) {
	console.log(data);
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
		if (el.name) {
			if (el.type !== "checkbox") {
				el.value = data[el.name] ? data[el.name] : "";
			} else {
				el.checked = data[el.name];
			}
		}
	}
}


createCard({name: "Вася", img_link: ""}, container);
createCard({name: "Вася", img_link: "https://www.friendforpet.ru/api/sites/default/files/2022-01/%D0%BB%D0%B5%D0%B2%D0%B83_%D0%B0%D0%BB%D0%B5%D0%BA%D1%81.jpg"}, container);

// запрос на сервер
fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`) 
	// ответ от сервера что такой запрос существует
	.then(res => res.json()) 
	// получение результата
	.then(result => { 
		// console.log(result);
		if (result.message === "ok") {
			console.log(result.data);
			result.data.forEach(function(el) {
				createCard(el, container);
			})
		}
	})


// const cat = {
// 	id: 6,
// 	name: "Василий",
// 	img_link: "https://documents.infourok.ru/b15649ae-78ff-40d2-810f-49e07e465ac8/0/image001.png"
// }

// JSON.stringify(obj) - сделает из объекта строку
// JSON.parse(str) - сделает из строки объект (если внутри строки объек)

const addCat = function(cat) {
	fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
		method: "POST",
		headers: { // обязательно для POST/PUT/PATCH
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat) // обязательно для POST/PUT/PATCH
	})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				createCard(cat, container);
				addForm.reset();
				popupBlock.classList.remove("active");
			}
		})
}

const deleteCat = async function(id, tag) {
	/*
		fetch(`https://sb-cats.herokuapp.com/api/2/fe8/delete/${id}`, {
			method: "DELETE"
		})
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (data.message === "ok") {
				tag.remove();
			}
		})
	*/
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
		method: "DELETE"
	});

	let data = await res.json();
	
	if (data.message === "ok") {
		tag.remove();
	}


}


addForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}

	console.log(body);
	addCat(body);
});

updForm.addEventListener("submit", function(e) {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < this.elements.length; i++) {
		let el = this.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	delete body.id;
	console.log(body);
	updCat(body, updForm.dataset.id);
});

const updCat = async function(obj, id) {
	let res = await fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(obj)
	})
	let answer = await res.json();
	console.log(answer);
	if (answer.message === "ok") {
		updCard(obj, id);
		updForm.reset();
		updForm.dataset.id = "";
		popupUpd.classList.remove("active");
		popupBlock.classList.remove("active");
	}
}

const updCard = function(data, id) {
	for (let i = 0; i < cards.length; i++) {
		let card = cards[i];
		if (card.dataset.id === id) {
			card.firstElementChild.style.backgroundImage = data.img_link ? `url(${data.img_link})` : `url(img/cat.png)`;
			card.querySelector("h3").innerText = data.name || "noname";
		}
	}
}





