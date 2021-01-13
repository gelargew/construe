document.addEventListener('DOMContentLoaded', () => {
    const rows = parseInt(document.querySelector('#row_count').value)
    const cols = parseInt(document.querySelector('#col_count').value)
    const quiz_id = document.querySelector('#quiz-id').value

    fetch(`/chart/${quiz_id}`)
    .then(response => response.json())
    .then(data => {
        const size = data.size
        document.querySelector('#correct_count').textContent = `correct: ${data.correct_count}/${size}`
        document.querySelector('#wrong_count').textContent = `wrong: ${data.wrong_count}/${size}`
        document.querySelector('#empty_count').textContent = `empty: ${data.empty_count}/${size}`
        var ctx = document.querySelector('#myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
            
            // The data for our dataset
            data: {
                labels: [...Array(cols).keys()].map(x => ++x),
                datasets: [{
                    label: 'correct',
                    borderColor: 'green',
                    data: data.correct,
                    cubicInterpolationMode: 'monotone',
                }, {
                    label: 'wrong',
                    borderColor: 'red',
                    data: data.wrong,
                    cubicInterpolationMode: 'monotone'
                }, {
                    label: 'empty',
                    borderColor: 'yellow',
                    data: data.empty,
                    cubicInterpolationMode: 'monotone'
                }],
            }, 

            // Configuration options go here
            options:{
                scales:{
                    xAxes: [{
                        scaleLabel: {
                            labelString: 'column',
                            display: true
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            labelString: 'rate (%)',
                            display: true
                        }
                    }]
                }
            }
        });

        
    })
    .then(document.querySelector('.container-sm').style.display = 'block')
    

})