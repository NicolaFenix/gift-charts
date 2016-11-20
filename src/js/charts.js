$(function () {

    var HEIGHT = 300,
        WIDTH = HEIGHT;

    render();

    function render() {

        //renderBubble();

        renderBar();

        renderColumns();

        renderStackedColumn();

        renderPie();

    }

    function renderBubble() {

        var svg = d3.select("svg#bubble"),
            margin = 20,
            diameter = +svg.attr("width"),
            g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

        var color = d3.scaleLinear()
            .domain([-1, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl);

        var pack = d3.pack()
            .size([diameter - margin, diameter - margin])
            .padding(2);

        d3.json("./src/json/bubble.json", function(error, root) {
            if (error) throw error;

            root = d3.hierarchy(root)
                .sum(function(d) { return d.size; })
                .sort(function(a, b) { return b.value - a.value; });

            var focus = root,
                nodes = pack(root).descendants(),
                view;

            // Define the div for the tooltip
            var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var circle = g.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("class", function(d) { console.log(d.data); return d.parent ? (d.children ? "node" : "node node--leaf" ): "node node--root"; })
                //.attr("data-personal-color", function(d) { if(d && d.parent){ console.log(d.parent.name); } })
                .style("fill", function(d) { return d.children ? color(d.depth) : null; })
                .style("fill", function(d) {if (d.data && d.data.datacolor) return d.data.datacolor  })
                .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
                .on("mouseover", function(d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div	.html(d.data.size + "g")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            var text = g.selectAll("text")
                .data(nodes)
                .enter().append("text")
                .attr("class", "label")
                .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
                .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
                .text(function(d) { return d.data.name; });
            //.append("text")
            //.attr("class", "quantity")
            //.text(function(d) { return d.data.size + "g"; })
            //.style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
            //.style("display", function(d) { return d.parent === root ? "inline" : "none"; });


            var node = g.selectAll("circle,text");

            svg
                .style("background", "#FFFFFF")
                .on("click", function() { zoom(root); });

            zoomTo([root.x, root.y, root.r * 2 + margin]);

            function zoom(d) {
                var focus0 = focus; focus = d;

                var transition = d3.transition()
                    .duration(d3.event.altKey ? 7500 : 750)
                    .tween("zoom", function(d) {
                        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                        return function(t) { zoomTo(i(t)); };
                    });

                transition.selectAll("text")
                    .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
                    .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
                    .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
                    .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
            }

            function zoomTo(v) {
                var k = diameter / v[2]; view = v;
                node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
                circle.attr("r", function(d) { return d.r * k; });
            }
        });


    }

    function renderBar() {

        $('#bar').css({
            height: 200,
            width: WIDTH
        }).highcharts({

                chart: {
                    type: 'bar',
                    margin: [0, 0, 0, 0],
                    spacingTop: 0,
                    spacingBottom: 0,
                    spacingLeft: 0,
                    spacingRight: 0
                },

                //hide xAxis
                xAxis: {
                    categories: ['Cereals', 'Vegetables', 'Pulses'],
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    gridLineColor: 'transparent',
                    labels: {
                        enabled: false
                    },
                    minorTickLength: 0,
                    tickLength: 0
                },

                //hide yAxis
                yAxis: {
                    min : 0,
                    max :100,
                    gridLineWidth: 0,
                    minorGridLineWidth: 0,
                    lineWidth: 0,
                    lineColor: 'transparent',

                    title: {
                        enabled: false
                    },

                    labels: {
                        enabled: false
                    },
                    minorTickLength: 0,
                    tickLength: 0
                },

                //remove title and subtitle
                title: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },
                subtitle: {
                    text: '',
                    style: {
                        display: 'none'
                    }
                },

                //remove credits
                credits: {
                    enabled: false
                },

                //hide legend
                legend: {
                    enabled: false
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.y + '%</b>';
                    }
                },

                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [
                    {
                        name: 'At risk',
                        color: 'red',
                        pointWidth: 200,
                        data: [37.5]
                    },{
                    name: 'Not at risk',
                    color: '#333333',
                    pointWidth: 200,
                    data: [62.5]
                }]
            });


    }

    function renderColumns() {

        $('#columns').css({
            height: HEIGHT,
            width: WIDTH
        }).highcharts({

            chart: {
                type: 'column',
                margin: [10, 10, 10, 10],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
            },

            //hide xAxis
            xAxis: {
                categories: ['Cereals', 'Vegetables', 'Pulses'],
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0
            },

            //hide yAxis
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                min: 0,
                max: 100,
                lineWidth: 0,
                lineColor: 'transparent',

                title: {
                    enabled: false
                },

                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0
            },


            //remove title and subtitle
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            subtitle: {
                text: '',
                style: {
                    display: 'none'
                }
            },

            //remove credits
            credits: {
                enabled: false
            },

            //hide legend
            legend: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.y + '%</b>';
                }
            },


            series: [{
                data: [5, 90, 5],
                pointWidth: 80,
                color: {
                    pattern: './src/img/columns/pattern.svg',
                    width: 20,
                    height: 20
                }
            }]

        });

        //Progress bar
        $('#columns-progress-bar').css({
            width: '70%'
        });

    }

    function renderStackedColumn() {

        $('#stacked').css({
            height: HEIGHT,
            width: WIDTH
        }).highcharts({
            chart: {
                type: 'column',
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
            },

            //remove title and subtitle
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            subtitle: {
                text: '',
                style: {
                    display: 'none'
                }
            },

            //remove credits
            credits: {
                enabled: false
            },

            //hide xAxis
            xAxis: {
                lineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
                gridLineColor: 'transparent',
                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0
            },

            //hide yAxis
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                min: 0,
                max: 100,
                lineWidth: 0,
                lineColor: 'transparent',

                title: {
                    enabled: false
                },

                labels: {
                    enabled: false
                },
                minorTickLength: 0,
                tickLength: 0
            },

            //hide legend
            legend: {
                enabled: false
            },

            tooltip: {
                formatter: function () {
                    return this.series.name + ': <b>' + this.y + '%</b>';
                }
            },

            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        //color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function () {
                            return '<span class="stacked-label">' + Math.round(this.percentage * 100) / 100 + '%<span>';
                        },
                        style: {
                            textShadow: false
                        }
                    },

                }
            },

            series: [{
                pointWidth: WIDTH,
                name: 'Cereals',
                color: '#fec82b',
                data: [21]
            }, {
                pointWidth: WIDTH,
                name: 'Vegetables',
                color: '#b8e434',
                data: [5]
            }, {
                pointWidth: WIDTH,
                name: 'Pulses',
                color: '#fe7d2f',
                data: [3]
            }, {
                pointWidth: WIDTH,
                name: 'Fish',
                color: '#9ed9e9',
                data: [6]
            }, {
                pointWidth: WIDTH,
                name: 'Meat',
                color: '#830219',
                data: [8]
            }, {
                pointWidth: WIDTH,
                name: 'Others',
                color: '#139ee1',
                data: [2]
            },
                {
                    pointWidth: WIDTH,
                    name: 'Not specified',
                    color: '#333333',
                    data: [55]
                }].reverse()
        });


    }

    function renderPie() {

        $('#pie').css({
            height: HEIGHT,
            width: WIDTH
        }).highcharts({

            chart: {
                type: 'pie',
                margin: [0, 0, 0, 0],
                spacingTop: 0,
                spacingBottom: 0,
                spacingLeft: 0,
                spacingRight: 0
            },

            //remove title and subtitle
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            subtitle: {
                text: '',
                style: {
                    display: 'none'
                }
            },

            plotOptions: {
                pie: {
                    borderColor: '#000000',
                    allowPointSelect: true,
                    //set radius
                    size: '75%',
                    //labels inside the pie
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return '<span class="pie-label">' + Math.round(this.percentage * 100) / 100 + '%<span>';
                        },
                        style: {
                            textShadow: false
                        },
                        distance: -30
                    }
                }
            },

            tooltip: {
                formatter: function () {
                    return this.key + ': <b>' + this.y + '%</b>';
                }
            },

            //remove credits
            credits: {
                enabled: false
            },

            series: [{
                name: 'Percentage',
                data: [{
                    name: 'Fats',
                    color: '#2e76b7',
                    y: 6
                }, {
                    name: 'Carbohydrates',
                    color: '#fcc00d',
                    y: 82
                }, {
                    name: 'Protein',
                    color: '#bf1818',
                    y: 12
                }]
            }]
        }, function (chart) { // on complete

            chart.renderer.image('./src/img/pie/background-alpha.svg', 0, 0, HEIGHT, WIDTH)
                .add();

        });

    }


});