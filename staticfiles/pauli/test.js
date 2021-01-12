document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#test-window').style.display = 'flex'
    document.querySelector('#loading-quiz').style.display = 'none'
    for (let i = 1; i < 6; i++) {
        document.querySelector(`#col-${i}`).style.display = 'block'
    }
    document.querySelector('#user-details').style.display = 'none'

    const num_input = document.querySelectorAll('.num-input')
    const quiz_id = document.querySelector('#quiz_id').value

    //fetch the already filled test answers, in case the user already did the test in the last 2 hours and yet to submit
    fetch(`/user_ans/${quiz_id}`)
    .then(response => response.json())
    .then(user_ans => {
        console.log(user_ans)
        // change focus to the next input everytime the current input value is filled     
        num_input.forEach(ele => {
            const num = ele.id.split('-')
            const col = parseInt(num[1])
            const row = parseInt(num[2])

            ele.value = user_ans[`#i-${col}-${row}`]

            ele.addEventListener('input', () => {
                if (parseInt(ele.value) >= 0) {                                       
                    const next = document.querySelector(`#i-${col}-${row+1}`)

                    if (next) {
                        window.scrollBy(0, 70)
                        next.focus()
                        
                    }
                    // change focus to the next row, also post the current answer to the server to be saved
                    else {
                        const column = document.querySelector(`#i-${col+1}-1`)
                        if (column) {
                            column.focus()
                            columns_control(col)
                        }
                    }
                }
                
            })    
        })
        num_input[0].focus()
    })

    
    
    //timer, PUT user answer to database every 30 seconds
    let time = document.querySelector('#user-time').value
    setInterval(() => {
        time = time - 1000
        if (time % (30*1000) < 800) {
            console.log('saved')
            save_answer(num_input, time)
        }
        if (time < 0) {
            clearInterval()
            document.querySelector('#finish').click()
        }
        let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((time % (1000 * 60)) / 1000);
        document.querySelector('#timer').textContent = `${hours}:${minutes}:${seconds}`
    }, 1000)

    document.querySelector('form').addEventListener('submit', () => {
        time = 0
        save_answer(num_input, time)
    })
})

const save_answer = (num_input, time)  => {
    let answers = []
    num_input.forEach(e => {
    answers.push(e.value)
    })
    console.log(answers.length)
    fetch('/answer', {
        method: 'PUT',
        body: JSON.stringify({
            answers: answers,
            quiz_id: document.querySelector('#quiz_id').value,
            time: time
        })
    })
    .then(response => {
        return true
    })
}

// control which columns is shown based on the current focus location
const columns_control = current => {
    for (let i = 1; i < 6; i++) {
        const show =  document.querySelector(`#col-${current+i}`)
        if (show) {
            show.style.display = 'block'
        }
    }
    const hide = document.querySelector(`#col-${current-4}`)
    if (hide) {
        hide.style.display = 'none'
    }
}
