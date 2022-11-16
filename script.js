const container = document.querySelector("main");

/*
	{
		id, name, rate, age, 
		img_link, description, 
		favourite
	}
*/

const createCard = function(cat, parent) {
	const card = document.createElement("div");
	card.className = "card";

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

	card.append(img, name);
	parent.append(card);
}


// createCard({name: "Вася", img_link: "https://www.friendforpet.ru/api/sites/default/files/2022-01/%D0%BB%D0%B5%D0%B2%D0%B83_%D0%B0%D0%BB%D0%B5%D0%BA%D1%81.jpg"}, container);

// запрос на сервер
fetch("https://sb-cats.herokuapp.com/api/2/fe8/show") 
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

















