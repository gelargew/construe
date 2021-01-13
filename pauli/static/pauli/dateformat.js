document.addEventListener('DOMContentLoaded', () => {
    const dates = document.querySelectorAll('.date_submitted')
    dates.forEach(date => {
        let local_date = new Date(date.textContent)
        date.textContent = local_date.toLocaleString()
    })
    
})