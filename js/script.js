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

    async function typePokemon() {
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
    
            if (!pokemonResponse.ok) {
                throw new Error('Erro ao buscar dados da API');
            }
    
            const pokemonsData = await pokemonResponse.json();
            const typePromises = pokemonsData.types.map(type => fetch(type.type.url));
            const typeResponses = await Promise.all(typePromises);
            const typeDatas = await Promise.all(typeResponses.map(response => response.json()));
    
            typeDatas.forEach(typeData => {
                const typeIcon = document.createElement('img');
                typeIcon.src = `${getTypeImg(typeData.name)}`;
                typesPokemon.appendChild(typeIcon);
            });
        } catch (error) {
            console.error(error);
        }
    }
    
    typePokemon();
    
    pokemonContainer.appendChild(typesPokemon);
    pokemonInfo.appendChild(pokemonContainer);
    container.appendChild(pokemonInfo);
}

let overlayCriado = false;

async function moreInfosPokemon(pokemon, index) {
 
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

    const iconPrev = document.createElement('i');
    iconPrev.classList.add('fa-solid');
    iconPrev.classList.add('fa-chevron-left');
    pokemonsInfos.appendChild(iconPrev);

    const iconLater = document.createElement('i');
    iconLater.classList.add('fa-solid');
    iconLater.classList.add('fa-chevron-right');
    pokemonsInfos.appendChild(iconLater);

    iconLater.addEventListener('click', () => {
        overlay.remove();
        setTimeout(() => {
            nextPokemon(index, 'later');
        }, 300);
    })

    iconPrev.addEventListener('click', () => {
        if (index > 1) {
            overlay.remove();
            setTimeout(() => {
                nextPokemon(index, 'prev');
            }, 300);
        }
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

    async function exibirTypesPokemon() {
        const data = await dadosPokemon(index);
        data.types.forEach(type => {
            const typeItem = document.createElement('li');
            typeItem.id = type.type.name;
            typeItem.innerText = type.type.name;
            pokemonsTypes.appendChild(typeItem);
        })
    }
    exibirTypesPokemon();


    async function getSpecies(data) {
        const response = await fetch(data.species.url);

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const speciesData = await response.json();
        return speciesData;
    }
    
    async function exibirResumePokemon() {
        const data = await dadosPokemon(index);

        const speciesData = await getSpecies(data);
        const summary = speciesData.flavor_text_entries.find(entry => entry.language.name === "en").flavor_text;
        const pokemonResumo = document.createElement('div');
        pokemonResumo.classList.add('pokemon-resumo');
        pokemonResumo.innerHTML = `<p>${summary}</p>`;
        pokemonContainer.appendChild(pokemonResumo);

    }
    exibirResumePokemon().then(() => {
        exibirStatsPokemon();
        exibirEvoltuionsPokemon().then(() => {
            exibirWeaknessesPokemon();
        })
    });

    async function exibirStatsPokemon() {
        const data = await dadosPokemon(index);

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
    }

    async function exibirEvoltuionsPokemon() {
       
        const data = await dadosPokemon(index);
        const speciesData = await getSpecies(data);
        try {
            const response = await fetch(speciesData.evolution_chain.url);

            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API');
            }

            const evolutionChainData = await response.json();
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
                evolutionItem.classList.add('info-card');
                evolutionItem.id = pokemon.id;

                evolutionItem.addEventListener('click', () => {
                    overlay.remove();
                    setTimeout(() => {
                        moreInfosPokemon(pokemon, evolutionItem.id);
                    }, 300);
                })

                const imagemEvolution = document.createElement('img');
                imagemEvolution.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                imagemEvolution.alt = pokemon.name;
                const pokemonEvolution = document.createElement('span');
                pokemonEvolution.innerText = pokemon.name;
                
                if (pokemon.level != undefined) {
                    const formEvolution = document.createElement('li');
                    formEvolution.classList.add('requirement-evolution');

                    const lvlItem = document.createElement('span');
                    lvlItem.innerText = pokemon.level;
                    const lvlText = document.createElement('span');
                    lvlText.innerText = 'lvl';
                    
                    formEvolution.appendChild(lvlItem);
                    formEvolution.appendChild(lvlText);
                    evolutionList.appendChild(formEvolution);
                } 
                
                if (pokemon.typeEvolution) {
                    const formEvolution = document.createElement('li');
                    formEvolution.classList.add('requirement-evolution');
                    
                    if (pokemon.typeEvolution.icon) {
                        const typeEvolutionIcon = document.createElement('img');
                        typeEvolutionIcon.classList.add('item-evolution');
                        typeEvolutionIcon.src = pokemon.typeEvolution.icon;
                        formEvolution.appendChild(typeEvolutionIcon);
                    }

                    if (pokemon.typeEvolution.data) {
                        const typeEvolutionData = document.createElement('span');
                        typeEvolutionData.innerText = pokemon.typeEvolution.data;
                        formEvolution.appendChild(typeEvolutionData);
                    }

                    if (pokemon.typeEvolution.name) {
                        const typeEvolutionName = document.createElement('span');
                        typeEvolutionName.innerText = pokemon.typeEvolution.name;
                        formEvolution.appendChild(typeEvolutionName);
                    }

                    evolutionList.appendChild(formEvolution);
                }
                
                evolutionItem.appendChild(imagemEvolution);
                evolutionItem.appendChild(pokemonEvolution);
                evolutionList.appendChild(evolutionItem);
            });

            function getEvolutionChain(chain, chainArray) {
                const pokemonName = chain.species.name;
                const pokemonId = chain.species.url.split('/')[6];
                const evolutionDetails = chain.evolution_details[0];
                
                if (evolutionDetails) {
                    // console.log(evolutionDetails);
                    if (evolutionDetails.min_level) {
                        chainArray.push({ name: pokemonName, id: pokemonId, level: evolutionDetails.min_level });
                    } else if (evolutionDetails.item) {
                        const itemName = evolutionDetails.item.name;
                        const itemUrl = `https://pokeapi.co/api/v2/item/${evolutionDetails.item.url.split('/')[6]}/`;
                        const itemSpriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: itemName, icon: itemSpriteUrl, url: itemUrl } });
                    } else if (evolutionDetails.min_level) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Lvl', data: evolutionDetails.min_level } });
                    } else if (evolutionDetails.min_happiness) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Happiness', data: evolutionDetails.min_happiness } });
                    } else if (evolutionDetails.min_affection) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Affection', data: evolutionDetails.min_affection } });
                    } else if (evolutionDetails.trigger.name === 'trade') {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: {data: evolutionDetails.trigger.name } });
                    } else if (evolutionDetails.min_beauty) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Beauty', data: evolutionDetails.min_beauty } });
                    } else if (evolutionDetails.known_move) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Move', data: evolutionDetails.known_move.name } });
                    } else if (evolutionDetails.location) {
                        chainArray.push({ name: pokemonName, id: pokemonId, typeEvolution: { name: 'Level up near route', data: evolutionDetails.location.name } });
                    }
                 
                } else {
                    chainArray.push({ name: pokemonName, id: pokemonId });
                }
            
                if (chain.evolves_to.length > 0) {
                    chain.evolves_to.forEach(pokemon => {
                        getEvolutionChain(pokemon, chainArray);
                    });
                }
                
                return chainArray;
            }

        } catch (error) {
            console.error(error);
        }

    }

    async function exibirWeaknessesPokemon() {
        const data = await dadosPokemon(index);
        try {
            const response = await fetch(data.types[0].type.url)

            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API');
            }

            const weaknessesData = await response.json();
            const weaknesses = weaknessesData.damage_relations.double_damage_from;
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
            
            const advantages = weaknessesData.damage_relations.double_damage_to;
            const pokemonAdvantage = document.createElement('div');
            pokemonAdvantage.classList.add('pokemon-weaknesses');
            pokemonAdvantage.classList.add('pokemons-types');
            pokemonContainer.appendChild(pokemonAdvantage);

            const titlePokemonAdvantage = document.createElement('h2');
            titlePokemonAdvantage.innerText = 'Advantage';
            pokemonAdvantage.appendChild(titlePokemonAdvantage);

            const advantageList = document.createElement('ul');
            pokemonAdvantage.appendChild(advantageList);
            
            advantages.forEach(advantage => {
                const advantageItem = document.createElement('li');
                advantageItem.innerText = advantage.name;
                advantageItem.id = advantage.name;
                advantageList.appendChild(advantageItem);
            });
            

        } catch (error) {
            console.error(error);
        }
    }

    container.appendChild(overlay);
}



async function dadosPokemon(index) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
        
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da APi.');
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error(error);
    }
}

async function pokemonsLoader(qtdPokemons) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtdPokemons}`);

        if (!response.ok) {
        throw new Error('Erro ao buscar dados da API.');
        }

        const data = await response.json();
        container.innerHTML = "";

        data.results.forEach((pokemon, index) => {
        pokemonEstruture(pokemon, index + 1);
        });
    } catch (error) {
        console.error(error);
    }
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

async function randomPokemon() {
    try {
        loadingScreen.style.display = 'flex';
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/`);

        if (!speciesResponse.ok) {
        throw new Error('Erro ao buscar dados da API.');
        }

        const speciesData = await speciesResponse.json();
        const totalPokemons = speciesData.count;
        const randomPokemonId = Math.floor(Math.random() * totalPokemons + 1);

        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);

        if (!pokemonResponse.ok) {
        throw new Error('Erro ao buscar dados da API.');
        }

        const pokemonData = await pokemonResponse.json();
        moreInfosPokemon(pokemonData, pokemonData.id);
        loadingScreen.style.display = 'none';
    } catch (error) {
        console.error(error);
    }
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
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
        const data = await response.json();
        pokemonList = data.results;
    } catch (error) {
        console.error(error);
    }
}

async function pesquisarPokemon(pesquisa) {
    loadingScreen.style.display = 'flex';
    pesquisa = pesquisa.toLowerCase();

    if (pokemonList.length === 0) {
        await getPokemonList();
    }

    let filteredPokemon = [];

    if (!isNaN(pesquisa)) { // Verifica se a pesquisa é um número
        const pokemon = pokemonList.find(pokemon => {
            return parseInt(pokemon.url.split("/")[6]) === parseInt(pesquisa);
        });
        if (pokemon) {
            filteredPokemon.push(pokemon);
        }
    } else {
        filteredPokemon = pokemonList.filter(pokemon => {
            return pokemon.name.includes(pesquisa);
        });
    }

    filteredPokemon.sort((a, b) => {
        return a.url.split("/")[6] - b.url.split("/")[6];
    });

    container.innerHTML = '';
    const pokemonPromises = filteredPokemon.map(pokemon => {
        return fetch(pokemon.url)
            .then(response => response.json());
    });

    const pokemonData = await Promise.all(pokemonPromises);

    pokemonData.forEach(pokemon => {
        pokemonEstruture(pokemon, pokemon.id);
    });
    loadingScreen.style.display = 'none';
}

const typesPokemon = document.querySelectorAll('.types-pokemon-filter li');

typesPokemon.forEach(element => {
  element.addEventListener('click', async (event) => {
    try {
      if (element.id == 'nenhum') {
        pokemonsLoader(24);
        return;
      }

      const type = event.target.id;
      const url = `https://pokeapi.co/api/v2/type/${type}`;
      loadingScreen.style.display = 'flex';

      const typeResponse = await fetch(url);

      if (!typeResponse.ok) {
        throw new Error('Erro ao buscar dados da API.');
      }

      const typeData = await typeResponse.json();
      const pokemonList = typeData.pokemon;

      const pokemonPromises = pokemonList.map(pokemon => fetch(pokemon.pokemon.url));
      const pokemonResponses = await Promise.all(pokemonPromises);

      if (!pokemonResponses.every(response => response.ok)) {
        throw new Error('Erro ao buscar dados da API.');
      }

      const pokemonDataList = await Promise.all(pokemonResponses.map(response => response.json()));
      container.innerHTML = "";
      pokemonDataList.forEach(pokemonData => {
        pokemonEstruture(pokemonData, pokemonData.id);
      });
      loadingScreen.style.display = 'none';
    } catch (error) {
      console.error(error);
    }
  });
});

async function nextPokemon(index, prevLater) {
    try {
        if (prevLater == 'later') {
            idPokemon = parseInt(index) + 1;

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)

            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API.');
            }   
            
            const pokemonData = await response.json();
            moreInfosPokemon(pokemonData, idPokemon);
        } else {
            idPokemon = parseInt(index) - 1;

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)

            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API.');
            }   
            
            const pokemonData = await response.json();
            moreInfosPokemon(pokemonData, idPokemon);
        }
    } catch (error) {
        console.error();
    }
}

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
