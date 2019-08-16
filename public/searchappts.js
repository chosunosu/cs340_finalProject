function searchApptsByDate() {
    //get the date
    var dateSearch_date  = document.getElementById('dateSearch_date').value
    //construct the URL and redirect to it
    window.location = '/appts/search/' + encodeURI(dateSearch_date)
}
