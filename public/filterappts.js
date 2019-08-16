function filterApptsByDoctor() {
    //get the id of the selected doctor from the filter dropdown
    var doctor_id = document.getElementById('doctor_filter').value
    //construct the URL and redirect to it
    window.location = '/appts/filter/' + parseInt(doctor_id)
}
