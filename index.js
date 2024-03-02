let input = document.querySelector(".search__input");
let select = document.querySelector(".select__list");
let elemsOptions = select.children;
let selectOptions = document.querySelector(".select__list-item");
let result = document.querySelector(".search__results-list");
let selectContainer = document.querySelector(".search__select");

function getData() {
	fetch(`https://api.github.com/search/repositories?q=${input.value}`)
	.then((response) => {
		return response.json();
	})
	.then((data) => {
		let array = [];
	for (let key of data.items) {
		let obj = {};
		obj.name = key.name;
		obj.owner = key.owner.login;
		obj.stars = key.stargazers_count;
		array.push(obj);
	}
	newOptions(array);
	select.style.display = "block";
	// console.log(array);
	});
}

const debounce = (fn, debounceTime) => {
	let timer;
	return function (...args) {
		const fnCall = () => fn.apply(this, args);
		clearTimeout(timer);
		timer = setTimeout(fnCall, debounceTime);
	};
};

const debouncedRequest = debounce(getData, 600);

input.addEventListener("keyup", function () {
	if (input.value) {
		debouncedRequest();
	} else {
		select.style.display = "none";
	}
});

function options(elem) {
	let option = document.createElement("option");
	option.className = "select__list-item";
	option.dataset.name = elem.name;
	option.dataset.owner = elem.owner;
	option.dataset.stars = elem.stars;
	option.textContent = elem.name;
	return option;
}

function newOptions(array) {
	if (elemsOptions.length === 0) {
		for (let i = 0; i < 5; i++) {
			select.appendChild(options(array[i]));
		}
	} else {
		for (let i = 0; i < 5; i++) {
			select.replaceChild(options(array[i]), select.childNodes[i]);
		}
	}
}

selectContainer.addEventListener("click", function (e) {
	let target = e.target;
	let arrRepositories = Array.from(result.children);
	arrRepositories.push(newResults(target));
	arrRepositories.forEach((elem) => {
		result.appendChild(elem);
	});
	select.style.display = "none";
	input.value = "";
});

function newResults(el) {
const fragment = document.createDocumentFragment();

let resultElement = document.createElement("div");
resultElement.className = "search__results";

let repositoryName = document.createElement("p");
repositoryName.textContent = `Name: ${el.dataset.name}`;

let repositoryOwner = document.createElement("p");
repositoryOwner.textContent = `Owner: ${el.dataset.owner}`;

let repositoryStars = document.createElement("p");
repositoryStars.textContent = `Stars: ${el.dataset.stars}`;

let btnDelete = document.createElement("button");
btnDelete.className = "results__delete-btn";
btnDelete.addEventListener("click", () => {
	resultElement.remove();
});

resultElement.appendChild(btnDelete);
resultElement.appendChild(repositoryName);
resultElement.appendChild(repositoryOwner);
resultElement.appendChild(repositoryStars);
fragment.appendChild(resultElement);

return fragment;
}