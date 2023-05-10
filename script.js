const movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';

let movieData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

const drawTreeMap = () => {

    let hierarchy = d3
        .hierarchy(movieData, node => node['children'])
        .sum(node => node['value'])
        .sort((node1, node2) => node2['value'] - node1['value'])

    let createTreeMap = d3.treemap().size([1000, 550]);
    createTreeMap(hierarchy)

    let movieTiles = hierarchy.leaves();
    console.log(movieTiles);

    let block = canvas.selectAll('g')
        .data(movieTiles)
        .enter()
        .append('g')
        .attr('transform', item => 'translate(' + item['x0'] + ', ' + item['y0'] + ')');

    block.append('rect')
        .attr('class', 'tile')
        .attr('fill', movie => {
            let category = movie['data']['category'];

            if (category === 'Action') {
                return 'orange'
            } else if (category === 'Drama') {
                return 'lightgreen'
            } else if (category === 'Adventure') {
                return 'crimson'
            } else if (category === 'Family') {
                return 'steelblue'
            } else if (category === 'Animation') {
                return 'pink'
            } else if (category === 'Comedy') {
                return 'khaki'
            } else if (category === 'Biography') {
                return 'tan'
            }
        })
        .attr('stroke', '#333')
        .attr('data-name', item => item['data']['name'])
        .attr('data-value', item => item['data']['value'])
        .attr('data-category', item => item['data']['category'])
        .attr('width', item => item['x1'] - item['x0'])
        .attr('height', item => item['y1'] - item['y0'])
        .on('mouseover', item => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.attr('data-value', item['data']['value'])

            let revenue = item['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

            tooltip.html(
                '$ ' + revenue + '<hr />' + item['data']['name']
            )
        })
        .on('mouseout', item => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })


    block.append('text')
        .text(item => item['data']['name'])
        .attr('x', 5)
        .attr('y', 20)

}

d3.json(movieDataUrl)
    .then((data, error) => {
        if (error) {
            console.log(error);
        } else {
            movieData = data;
            console.log(movieData);

            drawTreeMap();
        }
    });
