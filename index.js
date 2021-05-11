let cities = [];
const maxCities = parseInt(process.argv[2], 10) || 20;
const cityToCheckFrom = parseInt(process.argv[3], 10) || 5;
const cityToCheckTo = parseInt(process.argv[4], 10) || 10;
const shouldLog = false; // set to true to see logs about the connections being found

const log = str => {
  if (shouldLog) {
    console.log(str);
  }
}

const randomNumber = (max) => {
  return Math.round(Math.random() * max);
}

const createCities = maxCities => {
  for(let i=0; i < maxCities; i++) {
    createCity(i);
  }
}

const createCity = index => {
  cities.push({
    connections: new Set() // automatically remove duplicate connections
  });
  if (index > 0) {
    connect(index, index - 1); // connect with the previous city
  }
  if (index > 1) {
    connect(index, randomNumber(index - 1)); // connect with a random city
  }
}

const connect = (a, b) => {
  log(`Connect ${a} to ${b}`);
  cities[a].connections.add(b);
  cities[b].connections.add(a);
}

const printCities = cities => {
  cities.forEach((city, indexCity) => {
    console.log(`City ${indexCity}    Connections: [${[...city.connections].join(', ')}]`);
  });
}

// a random graph hardcoded instead of pseudo-random
const hardcodedCities = () => {
  cities = [
    {connections: new Set([1, 2, 4])},
    {connections: new Set([0, 2, 3, 5, 15])},
    {connections: new Set([1, 0, 3, 10])},
    {connections: new Set([2, 1, 4, 11])},
    {connections: new Set([3, 0, 5, 7, 8, 13, 17])},
    {connections: new Set([4, 1, 6, 9, 14])}, // 9
    {connections: new Set([5, 7])},
    {connections: new Set([6, 4, 8])},
    {connections: new Set([7, 4, 9, 16])},
    {connections: new Set([8, 5, 10])}, // 5
    {connections: new Set([9, 2, 11, 12])},
    {connections: new Set([10, 3, 12])},
    {connections: new Set([11, 10, 13])},
    {connections: new Set([12, 4, 14, 18])},
    {connections: new Set([13, 5, 15])},
    {connections: new Set([14, 1, 16])},
    {connections: new Set([15, 8, 17])},
    {connections: new Set([16, 4, 18])},
    {connections: new Set([17, 13, 19])},
    {connections: new Set([18])},
  ]
}

// this should be a recursive fn,
// but for 20 cities most of the time two levels deep is enough to find a connection.
const shortestPath = (a, b) => {
  let path = [];
  if (cities[a].connections.has(b)) {
    path = [a, b];
    log(`Found a direct connection`);
  } else {
    cities[a].connections.forEach(city => {
      // skip checkings if we already found a connection
      // only proceed if we don't have a connection yet or have a 'via' connection
      // i.e. if we found a connection "A-C-D-B" and want to find a "A-E-B".
      if (path.length === 0 || path.length > 3) {
        let from = false;
        let to = false;
        let via = false;
        log(`Checking city ${city} connections...`);
        if (cities[a].connections.has(city)) {
          log(`Found connection from: ${a}-${city}`);
          from = true;
        }
        if (cities[city].connections.has(b)) {
          log(`Found connection to: ${city}-${b}`);
          to = true;
        }
        if (from && to) {
          log(`Found connection with 1 city between.`)
          path = [a, city, b];
        } else {
          if (from) {
            cities[city].connections.forEach(city2 => {
              if (cities[city2].connections.has(b)) {
                log(`Found connection via: ${city2}-${b}`);
                log(`Found connection with 2 cities between.`);
                path = [a, city, city2, b];
              }
            });
          } else if(to) {
            cities[a].connections.forEach(city2 => {
              if (cities[a].connections.has(city2)) {
                log(`Found connection via: ${a}-${city2}`);
                log(`Found connection with 2 cities between.`);
                path = [a, city2, city, b];
              }
            });
          }
        }
      }
    });
  }
  return path;
}

const printShortestPath = (a, b) => {
  let path = shortestPath(a, b);
  if (path.length === 0) {
    return console.log(`\nCouldn't find a path with 4 cities or less.\n`);
  }
  console.log(`\nShortest Path from City ${a} to City ${b}: [${path.join(', ')}]\n`);
}

const init = () => {
  createCities(maxCities);
  // hardcodedCities();
  printCities(cities);
  printShortestPath(cityToCheckFrom, cityToCheckTo);
}
init();
