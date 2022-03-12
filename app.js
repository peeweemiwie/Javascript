const form = document.querySelector('#dino-compare');
const btnSubmit = document.querySelector('#btn-submit');
const LOCAL_STORAGE_KEY = 'human';
let inputData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

(function render() {
	const name = document.querySelector('#form-name');
	const feet = document.querySelector('#form-feet');
	const inches = document.querySelector('#form-inches');
	const weight = document.querySelector('#form-weight');
	const text = document.querySelector('#form-text');
	const diet = document.querySelector('input[name="form-diet"]');
	name.value = inputData.species;
	feet.value = 5;
	inches.value = 0;
	weight.value = 120;
	text.value = 'A baking champion';
})();
// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
	this.species = species;
	this.weight = weight;
	this.height = height;
	this.diet = diet;
	this.where = where;
	this.when = when;
	this.fact = fact;
}

// Create Dino Objects
const dinoArray = [];
fetch('dino.json')
	.then(response => response.json())
	.then(
		json =>
			(dinos = json.Dinos.map(dino => {
				dinoArray.push(
					new Dino(
						dino.species,
						dino.weight,
						dino.height,
						dino.diet,
						dino.where,
						dino.when,
						dino.fact,
					),
				);
			})),
	);

// Create Human Object
function Human(name, feet, inches, weight, diet, fact) {
	return {
		species: name,
		weight: +weight,
		diet: diet,
		height: +(feet * 12 + +inches),
		fact: fact,
	};
}

// Use IIFE to get human data from form
const handleSubmit = e =>
	(() => {
		e.preventDefault();
		const name = document.querySelector('#form-name').value;
		const feet = document.querySelector('#form-feet').value;
		const inches = document.querySelector('#form-inches').value;
		const weight = document.querySelector('#form-weight').value;
		const diet = document.querySelector(
			'input[name="form-diet"]:checked',
		).value;
		const fact = document.querySelector('#form-text').value;
		const newHuman = Human(name, feet, inches, weight, diet, fact);
		console.log(newHuman);
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHuman));
		compareWeight(newHuman.weight, newHuman.species);
		compareHeight(newHuman.height, newHuman.species);
		compareDiet(newHuman.diet, newHuman.species);
		generateTiles(newHuman);
	})();
btnSubmit.addEventListener('click', e => handleSubmit(e));

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareWeight = (weight, name) => {
	dinoArray.forEach(dino => {
		// weight
		const weightDifference = (function () {
			let state = '';
			let difference = 0;
			let _message = '';

			if (dino.weight > weight) {
				state = 'heavier';
				difference = dino.weight - weight;
			} else if (dino.weight < weight) {
				state = 'lighter';
				difference = weight - dino.weight;
			} else if (dino.weight === weight) {
				_message = `${dino.species} and ${name} weight the same!`;
			}

			function createMessage() {
				if (!_message.length)
					_message = `${dino.species} is ${difference}lb ${state} than ${name}`;
				return _message;
			}

			return {
				message: createMessage,
			};
		})();
		Object.assign(dino, { factWeight: weightDifference.message() });
	});
};
// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareHeight = (height, name) => {
	dinoArray.forEach(dino => {
		const heightDifference = (function () {
			let state = '';
			let difference = 0;
			let _message = '';

			if (dino.height > height) {
				state = 'taller';
				difference = dino.height - height;
			} else if (dino.height < height) {
				state = 'shorter';
				difference = height - dino.height;
			} else if (dino.height === height) {
				_message = `${dino.species} and ${name} are same height!`;
			}

			function createMessage() {
				if (!_message.length)
					_message = `${dino.species} is ${difference}inches ${state} than ${name}`;
				return _message;
			}

			return {
				message: createMessage,
			};
		})();
		Object.assign(dino, { factHeight: heightDifference.message() });
	});
};
// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareDiet = (diet, name) => {
	dinoArray.forEach(dino => {
		const dietDifference = (function () {
			let _message = '';

			if (dino.diet === diet) {
				_message = `Both ${dino.species} and ${name} are ${diet}!`;
			} else {
				_message = `${dino.species} is ${dino.diet} whereas ${name} is ${diet}`;
			}

			function createMessage() {
				return _message;
			}

			return {
				message: createMessage,
			};
		})();
		Object.assign(dino, { factDiet: dietDifference.message() });
		console.log(dinoArray);
	});
};
// Generate Tiles for each Dino in Array
const generateTiles = newHuman => {
	dinoArray.forEach((dino, i) => {
		const grid = document.querySelector('#grid');
		const template = document.querySelector('#template');
		const copied = document.importNode(template.content, true);
		const avatar = copied.querySelector('[data-avatar]');
		const specie = copied.querySelector('[data-species]');
		const fact = copied.querySelector('[data-fact]');
		const imgName = dino.species.toLowerCase().replace(/ /g, '');
		avatar.style.backgroundImage = `url(images/${imgName}.png)`;
		specie.innerText = dino.species;
		fact.innerText = dino.fact;
		grid.append(copied);
	});
};
// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic
