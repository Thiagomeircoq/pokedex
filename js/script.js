const container = document.querySelector('.pokemons');
const loadingScreen = document.getElementById('loading-screen');
document.getElementById('loading-screen').style.display = 'none';

function pokemonEstruture(pokemon, index) {
    const pokemonInfo = document.createElement('div');
    pokemonInfo.classList.add('pokemon-info');
    pokemonInfo.id = index;

    pokemonInfo.addEventListener('click', () => {
        moreInfosPokemon(pokemon, index);
    })

    const pokeball = document.createElement('div');
    pokeball.classList.add('pokeball');

    const pokeballButton = document.createElement('div');
    pokeballButton.classList.add('pokeball__button');

    pokeball.appendChild(pokeballButton);
    pokemonInfo.appendChild(pokeball);  

    const pokemonId = document.createElement('div');
    pokemonId.classList.add('pokemon-id');
    pokemonId.innerHTML = `<span>#${String(index).padStart(3, '0')}</span>`;

    pokemonInfo.appendChild(pokemonId);

    const pokemonContainer = document.createElement('div');
    pokemonContainer.classList.add('pokemon-container');

    const pokemonImage = document.createElement('div');
    pokemonImage.classList.add('pokemon-image');
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
    img.alt = '';

    pokemonImage.appendChild(img);
    pokemonContainer.appendChild(pokemonImage);

    const pokemonName = document.createElement('div');
    pokemonName.classList.add('pokemon-name');
    pokemonName.innerHTML = `<span>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>`;

    pokemonContainer.appendChild(pokemonName);
    
    const typesPokemon = document.createElement('div');
    typesPokemon.classList.add('pokemon-types');

    fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    .then(response => response.json())
    .then(data => {
        data.types.forEach(type => {
            fetch(type.type.url)
            .then(response => response.json())
            .then(typeData => {
                const typeIcon = document.createElement('img');
                typeIcon.src += `${getTypeImg(typeData.name)}`;
                typesPokemon.appendChild(typeIcon);
            })
            .catch(error => console.error(error));
        })
    })
    .catch(error => console.error(error));

    pokemonContainer.appendChild(typesPokemon);
    pokemonInfo.appendChild(pokemonContainer);
    container.appendChild(pokemonInfo);
}

function moreInfosPokemon(pokemon, index) {
    document.body.style.overflow = 'hidden'

    const container = document.querySelector('.container');
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    
    const pokemonsInfos = document.createElement('div');
    pokemonsInfos.classList.add('pokemons-infos');
    overlay.appendChild(pokemonsInfos);

    const topoDetail = document.createElement('div');
    topoDetail.classList.add('topo-detail');
    pokemonsInfos.appendChild(topoDetail);

    const pokemonContainer = document.createElement('div');
    pokemonContainer.classList.add('pokemons-container');
    pokemonsInfos.appendChild(pokemonContainer);

    const pokeball = document.createElement('div');
    pokeball.classList.add('pokeball');

    const pokeballButton = document.createElement('div');
    pokeballButton.classList.add('pokeball__button');

    pokeball.appendChild(pokeballButton);
    pokemonContainer.appendChild(pokeball);

    const pokemonTopo = document.createElement('div');
    pokemonTopo.classList.add('pokemon-topo');
    pokemonContainer.appendChild(pokemonTopo);

    const exitDetail = document.createElement('div')
    exitDetail.classList.add('exit-detail');
    pokemonTopo.appendChild(exitDetail);

    const iconExit = document.createElement('i');
    iconExit.classList.add('fa-solid');
    iconExit.classList.add('fa-xmark');
    exitDetail.appendChild(iconExit);

    exitDetail.addEventListener('click', () => {
        overlay.remove();
        document.body.style.overflow = 'auto'
    })

    const pokemonImagem = document.createElement('div');
    pokemonImagem.classList.add('pokemon-image');
    pokemonTopo.appendChild(pokemonImagem);

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`;
    img.alt = '';
    pokemonImagem.appendChild(img);

    const pokemonIntroduction = document.createElement('div');
    pokemonIntroduction.classList.add('pokemon-introduction');
    pokemonTopo.appendChild(pokemonIntroduction);
    
    const pokemonId = document.createElement('span');
    pokemonId.innerHTML = `#${String(index).padStart(3, '0')}`;
    pokemonIntroduction.appendChild(pokemonId);

    const pokemonName = document.createElement('h2');
    pokemonName.innerHTML = `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
    pokemonIntroduction.appendChild(pokemonName);

    const pokemonsTypes = document.createElement('div');
    pokemonsTypes.classList.add('pokemons-types');
    pokemonIntroduction.appendChild(pokemonsTypes);

    fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    .then(response => response.json())
    .then(data => {
        data.types.forEach(type => {
        const typeItem = document.createElement('li');
        typeItem.id = type.type.name;
        typeItem.innerText = type.type.name;
        pokemonsTypes.appendChild(typeItem);
        });
        return fetch(data.species.url);
    })
    .then(response => response.json())
    .then(speciesData => {
        const summary = speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;
        const pokemonResumo = document.createElement('div');
        pokemonResumo.classList.add('pokemon-resumo');
        pokemonResumo.innerHTML = `<p>${summary}</p>`;
        pokemonContainer.appendChild(pokemonResumo);

        fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
        .then(response => response.json())
        .then(data => {
            const stats = [
                { name: 'Attack', value: data.stats.find(stat => stat.stat.name === "attack").base_stat },
                { name: 'Defense', value: data.stats.find(stat => stat.stat.name === "defense").base_stat },
                { name: 'HP', value: data.stats.find(stat => stat.stat.name === "hp").base_stat },
                { name: 'Spc. Attack', value: data.stats.find(stat => stat.stat.name === "special-attack").base_stat },
                { name: 'Spc. Defense', value: data.stats.find(stat => stat.stat.name === "special-defense").base_stat },
                { name: 'Speed', value: data.stats.find(stat => stat.stat.name === "speed").base_stat }
            ];
        
            const pokemonStatus = document.createElement('div');
            pokemonStatus.classList.add('pokemon-status');
            pokemonContainer.appendChild(pokemonStatus);

            const titlePokemonStatus = document.createElement('h2');
            titlePokemonStatus.innerText = 'Statistics';
            pokemonStatus.appendChild(titlePokemonStatus);

            const status = document.createElement('div');
            status.classList.add('status');
            pokemonStatus.appendChild(status);

            const statisticName = document.createElement('div');
            statisticName.classList.add('statistic-name');
            status.appendChild(statisticName);

            const statBar = document.createElement('div');
            statBar.classList.add('statistic-bars');
            status.appendChild(statBar);

            stats.forEach(stat => {
          
                const statName = document.createElement('li');
                statName.innerText = `${stat.name}:`;
                statisticName.appendChild(statName);

                const barsValue = document.createElement('li');
                statBar.appendChild(barsValue);

                const bars = document.createElement('div');
                bars.classList.add('statistic-bar')
                bars.id = stat.name.toLowerCase();
                bars.style.width = `${stat.value}px`;
                barsValue.appendChild(bars);

                const statValue = document.createElement('span');
                statValue.innerText = stat.value;
                barsValue.appendChild(statValue);
            });
            const evolutionChainUrl = speciesData.evolution_chain.url;
            
            fetch(evolutionChainUrl)
                .then(response => response.json())
                .then(evolutionChainData => {
                    const evolutionChain = getEvolutionChain(evolutionChainData.chain, []);
                    const pokemonEvolutions = document.createElement('div');
                    pokemonEvolutions.classList.add('pokemon-evolutions');
                    pokemonContainer.appendChild(pokemonEvolutions);

                    const titlePokemonEvolutions = document.createElement('h2');
                    titlePokemonEvolutions.innerText = 'Evolutions';
                    pokemonEvolutions.appendChild(titlePokemonEvolutions);

                    const evolutionList = document.createElement('ul');
                    pokemonEvolutions.appendChild(evolutionList);
             
                    evolutionChain.forEach((pokemon, index) => {
                        const evolutionItem = document.createElement('li');
                        const imagemEvolution = document.createElement('img');
                        imagemEvolution.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`; // constrói a URL do sprite
                        imagemEvolution.alt = pokemon.name;
                        const pokemonEvolution = document.createElement('span');
                        pokemonEvolution.innerText = pokemon.name;

                        evolutionItem.appendChild(imagemEvolution);
                        evolutionItem.appendChild(pokemonEvolution);
                        evolutionList.appendChild(evolutionItem);
                    });
                });

            function getEvolutionChain(chain, chainArray) {
                const pokemonName = chain.species.name;
                const pokemonId = chain.species.url.split('/')[6];
                chainArray.push({ name: pokemonName, id: pokemonId });
                if (chain.evolves_to.length > 0) {
                    chain.evolves_to.forEach(pokemon => {
                        console.log(pokemon);
                        getEvolutionChain(pokemon, chainArray);
                    });
                }
                return chainArray;
            }

            return fetch(data.types[0].type.url);
        })
        .then(response => response.json())
        .then(typeData => {
            const weaknesses = typeData.damage_relations.double_damage_from;
            const pokemonWeaknesses = document.createElement('div');
            pokemonWeaknesses.classList.add('pokemon-weaknesses');
            pokemonWeaknesses.classList.add('pokemons-types');
            pokemonContainer.appendChild(pokemonWeaknesses);

            const titlePokemonWeaknesses = document.createElement('h2');
            titlePokemonWeaknesses.innerText = 'Weaknesses';
            pokemonWeaknesses.appendChild(titlePokemonWeaknesses);

            const weaknessList = document.createElement('ul');
            pokemonWeaknesses.appendChild(weaknessList);

            weaknesses.forEach(weakness => {
                const weaknessItem = document.createElement('li');
                weaknessItem.innerText = weakness.name;
                weaknessItem.id = weakness.name;
                weaknessList.appendChild(weaknessItem);
            });
        })
    })
    
    container.appendChild(overlay);
}


function pokemonsLoader(qtdPokemons) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtdPokemons}`)
    .then(response => response.json())
    .then(data => {
        container.innerHTML = "";

        data.results.forEach((pokemon, index) => {
        pokemonEstruture(pokemon, index + 1);
      });
    })
    .catch(error => console.error(error));
}
pokemonsLoader(24);

let maisPokemons = document.querySelector('.mais-pokemons');
maisPokemons.addEventListener('click', function() {
    const qtdPokemonsAtual = document.querySelectorAll('.pokemon-info');
    let pokemonTotal = qtdPokemonsAtual.length + 24;
    pokemonsLoader(pokemonTotal);
})

const pokemonRandom = document.querySelector('.random');
pokemonRandom.addEventListener('click', randomPokemon)

function randomPokemon () {
    loadingScreen.style.display = 'flex';
    fetch(`https://pokeapi.co/api/v2/pokemon-species/`)
        .then(response => response.json())
        .then(data => {
        const totalPokemons = data.count;
        const randomPokemonId = Math.floor(Math.random() * totalPokemons + 1);

        fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
            .then(response => response.json())
            .then(data => {

            moreInfosPokemon(data, data.id);
            loadingScreen.style.display = 'none';
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}


const buttonPesquisa = document.querySelector('.barra-pesquisa button');

buttonPesquisa.addEventListener('click', function() {
    const pesquisaPokemon = document.querySelector('.barra-pesquisa input');
    if (pesquisaPokemon.value != "") {
        pesquisarPokemon(pesquisaPokemon.value);
    } else {
        pokemonsLoader(24);
    }
})

let pokemonList = [];

async function getPokemonList() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200');
        const data = await response.json();
        pokemonList = data.results;
    } catch (error) {
        console.error(error);
    }
}

async function pesquisarPokemon(pesquisa) {
    pesquisa = pesquisa.toLowerCase();

    if (pokemonList.length === 0) {
        await getPokemonList();
    }

    const filteredPokemon = pokemonList.filter(pokemon => {
        return pokemon.name.includes(pesquisa);
    });

    filteredPokemon.sort((a, b) => {
        return a.url.split("/")[6] - b.url.split("/")[6];
    });

    container.innerHTML = '';
    const pokemonPromises = filteredPokemon.map(pokemon => {
        return fetch(pokemon.url)
            .then(response => response.json());
    });

    const pokemonData = await Promise.all(pokemonPromises);
    console.log(pokemonData);

    pokemonData.forEach(pokemon => {
        pokemonEstruture(pokemon, pokemon.id);
    });
}

const typesPokemon = document.querySelectorAll('.types-pokemon-filter li');

typesPokemon.forEach(element => {
    element.addEventListener('click', (event) => {
    if (element.id == 'nenhum') {
        pokemonsLoader(24);
        return;
    }
    const type = event.target.id;
    const url = `https://pokeapi.co/api/v2/type/${type}`;
    loadingScreen.style.display = 'flex';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";
            const pokemonList = data.pokemon;
            const promises = pokemonList.map(pokemon => fetch(pokemon.pokemon.url));
            Promise.all(promises)
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(dataList => {
                    dataList.forEach(pokemonData => {
                        pokemonEstruture(pokemonData, pokemonData.id);
                    });
                    loadingScreen.style.display = 'none';
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    });
});

const getTypeImg = (type) => {
switch (type) {
    case "bug":
    return "img/bug.svg";
    case "dark":
    return "img/dark.svg";
    case "ghost":
    return "img/ghost.svg";
    case "grass":
    return "img/grass.svg";
    case "dragon":
    return "img/dragon.svg";
    case "electric":
    return "img/electric.svg";
    case "fairy":
    return "img/fairy.svg";
    case "fighting":
    return "img/fighting.svg";
    case "fire":
    return "img/fire.svg";
    case "flying":
    return "img/flying.svg";
    case "ground":
    return "img/ground.svg";
    case "ice":
    return "img/ice.svg";
    case "normal":
    return "img/normal.svg";
    case "poison":
    return "img/poison.svg";
    case "psychic":
    return "img/psychic.svg";
    case "rock":
    return "img/rock.svg";
    case "steel":
    return "img/steel.svg";
    case "water":
    return "img/water.svg";
    default:
    return "#";
}
};
